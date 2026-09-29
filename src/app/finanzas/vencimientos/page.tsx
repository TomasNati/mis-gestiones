'use client';

import {
  BuscarVencimientosPayload,
  ComprobantePagoParaSubir,
  MovimientoDeVencimiento,
  Subcategoria,
  TipoDeGasto,
  VencimientoUI,
} from '@/lib/definitions';
import { obtenerSubCategorias, obtenerVencimientos } from '@/lib/orm/data';
import { mensajeErrorComprobante, obtenerLimitesComprobantes, subirComprobantePago } from '@/lib/api';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { FilterComponent, FILTERS_DEFAULT } from '@/components/vencimientos/Filtros/Filtros';
import { AgregarEditarModal } from '@/components/vencimientos/AgregarEditarModal/AgregarEditarModal';
import { persistirVencimiento, eliminarVencimiento, copiarVencimientos } from '@/lib/orm/actions';
import { Box } from '@mui/material';
import { VencimientosGrilla } from '@/components/vencimientos/VencimientoGrilla/VencimientoGrilla';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { CopiarModal } from '@/components/vencimientos/CopiarModal/CopiarModal';
import { toUTC } from '@/lib/helpers';
import { obtenerMovimientosParaVencimientosUI } from '@/components/vencimientos/vencimientosUtils';

const buscarVencimientoPayloadDefault: BuscarVencimientosPayload = {
  desde: toUTC(FILTERS_DEFAULT.desde?.toDate() || new Date()),
  hasta: toUTC(FILTERS_DEFAULT.hasta?.toDate() || new Date()),
  tipos: null,
  esAnual: null,
  pagado: null,
};

const Vencimientos = () => {
  const [vencimientos, setVencimientos] = useState<VencimientoUI[]>([]);
  const [tiposDeVencimientos, setTiposDeVencimientos] = useState<Subcategoria[]>([]);
  const [showAgregarEditarModal, setShowAgregarEditarModal] = useState(false);
  const [showCopiarModal, setShowCopiarModal] = useState(false);
  const [idsACopiar, setIdsACopiar] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vencimientoAEditar, setVencimientoAEditar] = useState<VencimientoUI | undefined>(undefined);
  const [posiblesPagos, setPosiblesPagos] = useState<MovimientoDeVencimiento[]>([]);
  const [buscarVencimientoPayload, setBuscarVencimientoPayload] = useState<BuscarVencimientosPayload>({
    ...buscarVencimientoPayloadDefault,
  });
  const [maxUploadBytes, setMaxUploadBytes] = useState<number | null>(null);
  const notificarError = (mensaje: string) => setConfigNotificacion({ open: true, severity: 'error', mensaje });
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  const buscarVencimientos = async (payload: BuscarVencimientosPayload) => {
    setIsLoading(true);
    const vencimientosObtenidos = await obtenerVencimientos(payload);
    setVencimientos(vencimientosObtenidos);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchTiposDeVencimientos = async () => {
      const subcategorias = await obtenerSubCategorias(TipoDeGasto.Fijo);
      // sort subcategorias by categoria
      subcategorias.sort((a, b) => {
        if (a.nombre < b.nombre) {
          return -1;
        }
        if (a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });
      setTiposDeVencimientos(subcategorias);
    };

    const fetchVencimientos = async () => {
      setIsLoading(true);
      const vencimientosObtenidos = await obtenerVencimientos(buscarVencimientoPayload);
      setVencimientos(vencimientosObtenidos);
      setIsLoading(false);
    };

    fetchTiposDeVencimientos();
    fetchVencimientos();
  }, [buscarVencimientoPayload]);

  useEffect(() => {
    const fetchLimites = async () => {
      const limites = await obtenerLimitesComprobantes();
      setMaxUploadBytes(limites?.max_upload_bytes ?? null);
    };

    fetchLimites();
  }, []);

  const toggleOpenAgregarEditar = () => setShowAgregarEditarModal(!showAgregarEditarModal);

  const handleAgregarVencimiento = () => {
    setVencimientoAEditar(undefined);
    setShowAgregarEditarModal(true);
  };

  const handleEditarMovimiento = async (vencimiento: VencimientoUI) => {
    const posiblesMovimientos = await obtenerMovimientosParaVencimientosUI(
      vencimiento.subcategoria.id,
      vencimiento.pago,
    );
    setPosiblesPagos(posiblesMovimientos);
    setVencimientoAEditar(vencimiento);
    setShowAgregarEditarModal(true);
  };

  const subirComprobantes = async (
    vencimientoId: string | undefined,
    vencimiento: VencimientoUI,
    comprobantes: ComprobantePagoParaSubir[],
  ): Promise<string[]> => {
    if (!comprobantes.length) {
      return [];
    }
    if (!vencimientoId) {
      return ['No se obtuvo el id del vencimiento, no se pudieron subir los comprobantes'];
    }
    const basePath = vencimiento.subcategoria.comprobantesPath;
    if (!basePath) {
      return ['La subcategoria del vencimiento no tiene comprobantes_path configurado'];
    }

    const dentroDeLimite: ComprobantePagoParaSubir[] = [];
    const erroresDescartados: string[] = [];
    comprobantes.forEach((comprobante) => {
      if (maxUploadBytes && comprobante.archivo.size > maxUploadBytes) {
        erroresDescartados.push(`${comprobante.subpath}: excede el tamaño máximo permitido`);
      } else {
        dentroDeLimite.push(comprobante);
      }
    });

    const resultados = await Promise.allSettled(
      dentroDeLimite.map((comprobante) => subirComprobantePago({ vencimientoId, basePath, comprobante })),
    );

    const erroresSubida = resultados.flatMap((resultado, indice) =>
      resultado.status === 'rejected'
        ? [`${dentroDeLimite[indice].subpath}: ${mensajeErrorComprobante(resultado.reason, 'error desconocido')}`]
        : [],
    );

    return [...erroresDescartados, ...erroresSubida];
  };

  const handleGuardarVencimiento = async (vencimiento: VencimientoUI, comprobantes: ComprobantePagoParaSubir[]) => {
    const resultado = await persistirVencimiento(vencimiento);

    if (!resultado.exitoso) {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: resultado.errores.join('\n'),
      });
      return;
    }

    const exitoVencimiento = vencimiento.id
      ? 'Vencimiento actualizado correctamente'
      : 'Vencimiento agregado correctamente';
    const errores = await subirComprobantes(resultado.id, vencimiento, comprobantes);
    const subidos = comprobantes.length - errores.length;

    if (errores.length) {
      const detalleFallos =
        subidos === 0
          ? 'no se pudo subir ningún comprobante'
          : `no se pudieron subir ${errores.length} de ${comprobantes.length} comprobantes`;
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: `${exitoVencimiento}, pero ${detalleFallos}:\n${errores.join('\n')}`,
      });
      setShowAgregarEditarModal(false);
      buscarVencimientos(buscarVencimientoPayload);
      return;
    }

    setConfigNotificacion({
      open: true,
      severity: 'success',
      mensaje: `${exitoVencimiento}${subidos > 0 ? `\n${subidos} comprobante(s) de pago subidos` : ''}`,
    });
    setShowAgregarEditarModal(false);
    buscarVencimientos(buscarVencimientoPayload);
  };

  const handleBuscarVencimientos = async (payload: BuscarVencimientosPayload) => {
    setBuscarVencimientoPayload(payload);
    buscarVencimientos(payload);
  };

  const handleEliminarVencimiento = async (id: string) => {
    const resultado = await eliminarVencimiento(id);
    if (resultado.exitoso) {
      buscarVencimientos(buscarVencimientoPayload);
    }
    if (!resultado.exitoso) {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: resultado.errores.join('\n'),
      });
    } else {
      setConfigNotificacion({
        open: true,
        severity: 'success',
        mensaje: 'vencimiento eliminado correctamente',
      });
      buscarVencimientos(buscarVencimientoPayload);
    }
  };

  const handleCopyVencimientosClicked = async (ids: string[]) => {
    setIdsACopiar(ids);
    setShowCopiarModal(true);
  };

  const handleCopiarVencimientos = async (fecha: Date) => {
    setIsLoading(true);
    const vencimientosACopiar = vencimientos.filter((v) => idsACopiar.includes(v.id || ''));
    if (vencimientosACopiar.length === 0) {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: 'No hay vencimientos seleccionados para copiar',
      });
      setShowCopiarModal(false);
      setIsLoading(false);
      return;
    }
    const resultado = await copiarVencimientos({
      vencimientosACopiar,
      fechaDeCopiado: fecha,
    });
    if (resultado.exitoso) {
      setConfigNotificacion({
        open: true,
        severity: 'success',
        mensaje: 'Vencimientos copiados correctamente',
      });
      buscarVencimientos(buscarVencimientoPayload);
    } else {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: resultado.errores.join('\n'),
      });
    }
    setShowCopiarModal(false);
    setIsLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display={'flex'} flexDirection="column" gap={2} padding={2}>
        <FilterComponent tiposDeVencimientos={tiposDeVencimientos} onBuscar={handleBuscarVencimientos} />
        <VencimientosGrilla
          vencimientos={vencimientos}
          isLoading={isLoading}
          onEdit={handleEditarMovimiento}
          onDelete={handleEliminarVencimiento}
          onAdd={handleAgregarVencimiento}
          onCopy={handleCopyVencimientosClicked}
        />
        {showAgregarEditarModal ? (
          <AgregarEditarModal
            tiposDeVencimiento={tiposDeVencimientos}
            onClose={toggleOpenAgregarEditar}
            onGuardar={handleGuardarVencimiento}
            onNotificarError={notificarError}
            maxUploadBytes={maxUploadBytes}
            open={showAgregarEditarModal}
            vencimiento={vencimientoAEditar}
            pagos={posiblesPagos}
          />
        ) : null}
        {showCopiarModal ? (
          <CopiarModal
            open={showCopiarModal}
            onCopiar={handleCopiarVencimientos}
            onClose={() => setShowCopiarModal(false)}
          />
        ) : null}
      </Box>
      <Notificacion configuracionProp={configNotificacion} />
    </LocalizationProvider>
  );
};
export default Vencimientos;

'use client';

import {
  BuscarVencimientosPayload,
  MovimientoDeVencimiento,
  Subcategoria,
  TipoDeGasto,
  VencimientoUI,
} from '@/lib/definitions';
import { obtenerMovimientosParaVencimientos, obtenerSubCategorias, obtenerVencimientos } from '@/lib/orm/data';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { FilterComponent } from '@/components/vencimientos/Filtros/Filtros';
import { AgregarEditarModal } from '@/components/vencimientos/AgregarEditarModal/AgregarEditarModal';
import { persistirVencimiento, eliminarVencimiento } from '@/lib/orm/actions';
import { Box } from '@mui/material';
import { VencimientosGrilla } from '@/components/vencimientos/VencimientoGrilla/VencimientoGrilla';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';

const Vencimientos = () => {
  const [vencimientos, setVencimientos] = useState<VencimientoUI[]>([]);
  const [tiposDeVencimientos, setTiposDeVencimientos] = useState<Subcategoria[]>([]);
  const [showAgregarEditarModal, setShowAgregarEditarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vencimientoAEditar, setVencimientoAEditar] = useState<VencimientoUI | undefined>(undefined);
  const [posiblesPagos, setPosiblesPagos] = useState<MovimientoDeVencimiento[]>([]);
  const [buscarVencimientoPayload, setBuscarVencimientoPayload] = useState<BuscarVencimientosPayload>(
    {} as BuscarVencimientosPayload,
  );
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  useEffect(() => {
    const fetchTiposDeVencimientos = async () => {
      const subcategorias = await obtenerSubCategorias(TipoDeGasto.Fijo);
      //sort subcategorias by categoria
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
    fetchTiposDeVencimientos();
    buscarVencimientos({} as BuscarVencimientosPayload);
  }, []);

  const toggleOpenAgregarEditar = () => setShowAgregarEditarModal(!showAgregarEditarModal);

  const handleAgregarVencimiento = () => {
    setVencimientoAEditar(undefined);
    setShowAgregarEditarModal(true);
  };

  const handleEditarMovimiento = async (vencimiento: VencimientoUI) => {
    const posiblesMovimientos = await obtenerMovimientosParaVencimientos(vencimiento.subcategoria.id);
    setPosiblesPagos(posiblesMovimientos);
    setVencimientoAEditar(vencimiento);
    setShowAgregarEditarModal(true);
  };

  const handleGuardarVencimiento = async (vencimiento: VencimientoUI) => {
    const resultado = await persistirVencimiento(vencimiento);
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
        mensaje: vencimiento.id ? 'Vencimiento agregados correctamente' : 'Vencimiento actualizado correctamente',
      });
      setShowAgregarEditarModal(false);
      buscarVencimientos(buscarVencimientoPayload);
    }
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

  const handleCopyVencimientos = async (ids: string[]) => {
    console.log(ids);
  };

  const buscarVencimientos = async (payload: BuscarVencimientosPayload) => {
    setIsLoading(true);
    const vencimientosObtenidos = await obtenerVencimientos(payload);
    setVencimientos(vencimientosObtenidos);
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
          onCopy={handleCopyVencimientos}
        />
        {showAgregarEditarModal ? (
          <AgregarEditarModal
            tiposDeVencimiento={tiposDeVencimientos}
            onClose={toggleOpenAgregarEditar}
            onGuardar={handleGuardarVencimiento}
            open={showAgregarEditarModal}
            vencimiento={vencimientoAEditar}
            pagos={posiblesPagos}
          />
        ) : null}
      </Box>
      <Notificacion configuracionProp={configNotificacion} />
    </LocalizationProvider>
  );
};
export default Vencimientos;

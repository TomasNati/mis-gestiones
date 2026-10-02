import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { CategoriaUIMovimiento, MovimientoGastoGrilla, TipoDeMovimientoGasto } from '@/lib/definitions';
import { obtenerDiasEnElMes } from '@/lib/helpers';
import { Fecha } from '../editores/Fecha/Fecha';
import { Concepto } from '../editores/Concepto/Concepto';
import { TipoDePagoEdicion } from '../editores/TipoDePago/TipoDePago';
import { NumberInput } from '../editores/Monto/Monto';
import { styles } from './MovimientosDelMesGrillaMRT.styles';
import { MovimientoFila } from './MovimientosDelMesGrillaMRT.types';

interface FilaMovimientoPanelProps {
  fila: MovimientoFila;
  categoriasMovimiento: CategoriaUIMovimiento[];
  anio: number;
  mes: number;
  onGuardar: (movimiento: MovimientoGastoGrilla) => Promise<void>;
  onCancelar: () => void;
}

const FilaMovimientoPanel = ({
  fila,
  categoriasMovimiento,
  anio,
  mes,
  onGuardar,
  onCancelar,
}: FilaMovimientoPanelProps) => {
  const esNuevo = !!fila.isNew;
  const [dia, setDia] = useState<number | undefined>(fila.dia);
  const [concepto, setConcepto] = useState<CategoriaUIMovimiento | null>(esNuevo ? null : fila.concepto);
  const [tipoDeGasto, setTipoDeGasto] = useState<TipoDeMovimientoGasto | undefined>(fila.tipoDeGasto);
  const [monto, setMonto] = useState<number | undefined>(undefined);
  const [comentarios, setComentarios] = useState<string>(fila.comentarios ?? '');
  const [guardando, setGuardando] = useState(false);

  const diasDelMes = obtenerDiasEnElMes(new Date(anio, mes, 1));

  const fechaRef = useRef<HTMLElement>(null);
  const montoRef = useRef<HTMLElement>(null);
  const comentariosRef = useRef<HTMLElement>(null);
  const guardarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      fechaRef.current?.querySelector<HTMLElement>('input')?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const montoFinal = monto ?? fila.monto;
  const valido =
    !!fila.id &&
    dia != null &&
    dia >= 1 &&
    dia <= diasDelMes &&
    !!concepto &&
    tipoDeGasto != null &&
    montoFinal != null &&
    montoFinal > 0.01;

  const handleGuardar = async () => {
    if (!valido || guardando) {
      return;
    }
    setGuardando(true);
    try {
      await onGuardar({
        ...fila,
        categoria: { nombre: concepto.categoriaNombre, active: concepto.categoriaActive },
        fecha: new Date(anio, mes, dia),
        concepto,
        tipoDeGasto,
        monto: montoFinal,
        comentarios,
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box
      sx={styles.filaPanel}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !guardando) {
          event.stopPropagation();
          onCancelar();
        }
      }}
    >
      <Box component="div" sx={styles.filaPanelTitulo}>
        {esNuevo ? 'Agregando movimiento' : 'Editando movimiento'}
      </Box>
      <Box sx={styles.filaPanelCampos}>
        <Box ref={fechaRef} sx={styles.filaCampoDia}>
          <Fecha
            diasDelMes={diasDelMes}
            initialValue={fila.dia}
            onChange={setDia}
            onTabPressed={() => {}}
            label="Día"
            size="small"
          />
        </Box>
        <Concepto
          categoriasMovimiento={categoriasMovimiento}
          conceptoInicial={concepto}
          onConceptoModificado={setConcepto}
          onTabPressed={() => {}}
          label="Categoría y concepto"
          size="small"
        />
        <Box
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              event.preventDefault();
              montoRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
            }
          }}
        >
          <TipoDePagoEdicion
            tipoDepagoInicial={fila.tipoDeGasto}
            onTipoDePagoChange={setTipoDeGasto}
            onTabPressed={() => {}}
            borderStyle="solid"
          />
        </Box>
        <Box
          ref={montoRef}
          sx={styles.filaCampoMonto}
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              event.preventDefault();
              comentariosRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
            }
          }}
        >
          <NumberInput valorInicial={fila.monto?.toString()} onBlur={setMonto} label="Monto" size="small" />
        </Box>
        <Box
          ref={comentariosRef}
          sx={styles.filaCampoComentarios}
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              event.preventDefault();
              guardarRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
            }
          }}
        >
          <TextField
            label="Comentarios"
            size="small"
            value={comentarios}
            onChange={(event) => setComentarios(event.target.value)}
            fullWidth
          />
        </Box>
        <Tooltip title={esNuevo ? 'Agregar' : 'Guardar'}>
          <span ref={guardarRef} style={{ display: 'inline-flex' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              disabled={!valido}
              aria-label={esNuevo ? 'Agregar' : 'Guardar'}
              onClick={handleGuardar}
              sx={styles.filaBoton}
            >
              {guardando ? <CircularProgress size={16} color="inherit" /> : <SaveIcon fontSize="small" />}
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Cancelar">
          <span style={{ display: 'inline-flex' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={onCancelar}
              disabled={guardando}
              aria-label="Cancelar"
              sx={styles.filaBoton}
            >
              <CloseIcon fontSize="small" />
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export { FilaMovimientoPanel };

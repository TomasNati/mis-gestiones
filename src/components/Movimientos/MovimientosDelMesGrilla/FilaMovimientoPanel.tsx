import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
          onCancelar();
        }
      }}
    >
      <Box
        component="div"
        sx={{
          width: '100%',
          typography: 'caption',
          color: 'text.secondary',
          mb: -0.5,
        }}
      >
        {esNuevo ? 'Agregando movimiento' : 'Editando movimiento'}
      </Box>
      <Box ref={fechaRef}>
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
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            comentariosRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
          }
        }}
      >
        <NumberInput valorInicial={fila.monto?.toString()} onBlur={setMonto} label="Monto" size="small" />
      </Box>
      <Box ref={guardarRef}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={!valido}
          startIcon={guardando ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          onClick={handleGuardar}
        >
          {esNuevo ? 'Agregar' : 'Guardar'}
        </Button>
      </Box>
      <Button size="small" variant="outlined" startIcon={<CloseIcon />} onClick={onCancelar} disabled={guardando}>
        Cancelar
      </Button>
      <Box
        ref={comentariosRef}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            guardarRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
          }
        }}
        sx={{ width: '100%' }}
      >
        <TextField
          label="Comentarios"
          size="small"
          multiline
          minRows={2}
          value={comentarios}
          onChange={(event) => setComentarios(event.target.value)}
          sx={{ width: '400px' }}
        />
      </Box>
    </Box>
  );
};

export { FilaMovimientoPanel };
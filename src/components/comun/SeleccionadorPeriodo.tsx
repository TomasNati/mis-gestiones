import { months, years } from '@/lib/definitions';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';
import { crearFecha, obtenerMesesPorAnio, moverFecha, AnioConMeses } from './seleccionadorPeriodoHelper';

const initialDate = new Date();

interface SeleccionadorPeriodoProps {
  anio?: number;
  setAnio?: (anio: number) => void;
  mes?: string;
  meses?: string[];
  setMes?: (mes: string) => void;
  setMeses?: (meses: string[]) => void;
  setMesYAnio?: (mes: string, anio: number) => void;
  mesesExclusivos?: boolean;
}
const SeleccionadorPeriodo = ({
  anio,
  setAnio,
  mes,
  meses,
  setMes,
  setMesYAnio,
  setMeses,
  mesesExclusivos,
}: SeleccionadorPeriodoProps) => {
  const [mesesElegidos, setMesesElegidos] = useState<string[]>(meses || []);
  const [mesExclusivoElegido, setMesExclusivoElegido] = useState<string | null>(mes || null);
  const [fechaInicial, setFechaInicial] = useState<Date>(
    crearFecha(anio || initialDate.getFullYear(), mes || months[0]),
  );
  const [mesesAMostrar, setMesesAMostrar] = useState<AnioConMeses[]>(obtenerMesesPorAnio(fechaInicial));
  const [aniosElegibles, setAniosElegibles] = useState<number[]>(years);

  const updateFechaInicial = (newFechaInicial: Date) => {
    setFechaInicial(newFechaInicial);
    setMesesAMostrar(obtenerMesesPorAnio(newFechaInicial));
  };

  const onMoverMesesIzquierda = () => {
    const mesesFlat = mesesAMostrar.flatMap(({ meses }) => meses);
    if (mesExclusivoElegido === mesesFlat[mesesFlat.length - 1]) {
      return;
    }
    const nuevaFecha = moverFecha(fechaInicial, -1);
    updateFechaInicial(nuevaFecha);
  };

  const onMoverMesesDerecha = () => {
    const nuevaFecha = moverFecha(fechaInicial, 1);
    updateFechaInicial(nuevaFecha);
  };

  const onAnioElegido = (e: SelectChangeEvent<number>) => {
    const nuevoAnio = e.target.value as number;
    const nuevoMes = mesExclusivoElegido || months[0];
    updateFechaInicial(crearFecha(nuevoAnio, nuevoMes));
    setMesYAnio && setMesYAnio(nuevoMes, nuevoAnio);
  };

  const onMesElegido = (_: React.MouseEvent<HTMLElement>, mes: string | null) => {
    const mesAMostrarElegido = mesesAMostrar.find(({ meses }) => meses.includes(mes || ''));
    if (!mesAMostrarElegido) return;

    const anio = mesAMostrarElegido.anio;
    const nuevosAniosElegibles = aniosElegibles.includes(anio)
      ? aniosElegibles
      : [...aniosElegibles, anio].sort((a, b) => b - a);

    setAniosElegibles(nuevosAniosElegibles);
    setMesExclusivoElegido(mes);
    setMesYAnio && setMesYAnio(mes || '', mesAMostrarElegido.anio);
  };

  const onMesesElegidos = (_: React.MouseEvent<HTMLElement>, meses: string[]) => {
    setMesesElegidos(meses);
    setMeses && setMeses(meses);
  };

  const obtenerAnioDelMesActual = () => {
    const fecha = mesesAMostrar.find(({ meses }) => meses.includes(mesExclusivoElegido || ''));
    return fecha?.anio || fechaInicial.getFullYear();
  };

  const mesesFlat = mesesAMostrar.flatMap(({ meses }) => meses);
  const moverIzquierdaDisabled = mesExclusivoElegido === mesesFlat[mesesFlat.length - 1];
  const moverADerechaDisabled = mesExclusivoElegido === mesesFlat[0];
  const anioParaEnero = mesesAMostrar
    .find(({ meses }) => meses.includes('Enero'))
    ?.anio.toString()
    .slice(-2);
  const anioParaDiciembre = mesesAMostrar
    .find(({ meses }) => meses.includes('Diciembre'))
    ?.anio.toString()
    .slice(-2);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '10px',
      }}
    >
      <FormControl sx={{ width: '100px', marginRight: '10px', marginBottom: '5px' }}>
        <Select
          sx={{
            height: '100%',
            '& .MuiSelect-select': {
              padding: '2px 0 2px 4px',
            },
          }}
          value={obtenerAnioDelMesActual()}
          onChange={onAnioElegido}
        >
          {aniosElegibles.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          color: 'red',
          display: 'flex',
          gap: '10px',
          '& .MuiButtonBase-root': {
            paddingTop: '0px',
            paddingBottom: '0px',
            minWidth: 'unset',
            height: '42.5px',
            '& .MuiButton-iconSizeMedium': {
              margin: '0px',
            },
          },
        }}
      >
        <Button
          variant="contained"
          startIcon={<ChevronLeftIcon />}
          onClick={onMoverMesesIzquierda}
          disabled={moverIzquierdaDisabled}
        />
        <ToggleButtonGroup
          value={mesesExclusivos ? mesExclusivoElegido : mesesElegidos}
          exclusive={mesesExclusivos}
          onChange={mesesExclusivos ? onMesElegido : onMesesElegidos}
          sx={{ paddingBottom: '5px' }}
        >
          {mesesAMostrar
            .flatMap(({ meses }) => meses)
            .map((mes, index) => (
              <ToggleButton
                key={mes}
                value={mes}
                aria-label="left aligned"
                sx={{ padding: '8px', whiteSpace: 'nowrap' }}
              >
                {mes === 'Enero'
                  ? `${mes} (${anioParaEnero})`
                  : mes === 'Diciembre'
                    ? `${mes} (${anioParaDiciembre})`
                    : mes}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
        <Button
          variant="contained"
          startIcon={<ChevronRightIcon />}
          onClick={onMoverMesesDerecha}
          disabled={moverADerechaDisabled}
        />
      </Box>
    </Box>
  );
};

export { SeleccionadorPeriodo };

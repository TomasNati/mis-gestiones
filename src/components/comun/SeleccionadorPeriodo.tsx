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
  mes?: string;
  meses?: AnioConMeses[];
  setMeses?: (meses: string[]) => void;
  setMesYAnio?: (mes: string, anio: number) => void;
  mesesExclusivos?: boolean;
}
const SeleccionadorPeriodo = ({
  anio,
  mes,
  meses,
  setMesYAnio,
  setMeses,
  mesesExclusivos,
}: SeleccionadorPeriodoProps) => {
  const [mesesConAniosElegidos, setMesesConAniosElegidos] = useState<AnioConMeses[]>(meses || []);
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

  const updateAniosElegibles = (nuevosAnios: number[]) => {
    const nuevosAniosElegibles = Array.from(new Set([...aniosElegibles, ...nuevosAnios])).sort((a, b) => b - a);
    setAniosElegibles(nuevosAniosElegibles);
  };

  const onMoverMesesIzquierda = () => {
    const nuevaFecha = moverFecha(fechaInicial, -1);
    updateFechaInicial(nuevaFecha);
  };

  const onMoverMesesDerecha = () => {
    const nuevaFecha = moverFecha(fechaInicial, 1);
    updateFechaInicial(nuevaFecha);
  };

  const onAnioElegido = (e: SelectChangeEvent<number>) => {
    const nuevoAnio = e.target.value as number;
    const primerMesElegido = (mesesExclusivos ? mesExclusivoElegido : mesesConAniosElegidos[0].meses[0]) || months[0];
    updateFechaInicial(crearFecha(nuevoAnio, primerMesElegido));
    if (mesesExclusivos) {
      setMesYAnio && setMesYAnio(primerMesElegido, nuevoAnio);
    } else {
      setMesesConAniosElegidos([]);
      //TODO: AVISAR QUE SE BORRARON LOS MESES ELEGIDOS
    }
  };

  const onMesElegido = (_: React.MouseEvent<HTMLElement>, mes: string | null) => {
    const mesAMostrarElegido = mesesAMostrar.find(({ meses }) => meses.includes(mes || ''));
    if (!mesAMostrarElegido || !mes) return;

    updateAniosElegibles([mesAMostrarElegido.anio]);
    setMesExclusivoElegido(mes);
    setMesYAnio && setMesYAnio(mes, mesAMostrarElegido.anio);
  };

  const onMesesElegidos = (_: React.MouseEvent<HTMLElement>, nuevosMeses: string[]) => {
    const nuevosMesesElegidos: AnioConMeses[] = [];

    mesesAMostrar.forEach(({ anio, meses }) => {
      const anioConMesesElegido = {
        anio,
        meses: meses.filter((mes) => nuevosMeses.includes(mes)),
      };
      if (anioConMesesElegido.meses.length > 0) {
        nuevosMesesElegidos.push(anioConMesesElegido);
      }
    });
    setMesesConAniosElegidos(nuevosMesesElegidos);
    updateAniosElegibles(nuevosMesesElegidos.map(({ anio }) => anio));
    console.log(nuevosMesesElegidos);
    // setMesYAnio && setMesYAnio(mes, mesAMostrarElegido.anio);
  };

  const obtenerAnioDelMesActual = () => {
    const fecha = mesesAMostrar.find(({ meses }) => meses.includes(mesExclusivoElegido || ''));
    return fecha?.anio || fechaInicial.getFullYear();
  };

  const ultimoMesVisibleElegido = () => {
    const mesesFlat = mesesAMostrar.flatMap(({ meses }) => meses);
    const ultimoMesElegible = mesesFlat[mesesFlat.length - 1];
    if (mesesExclusivos) {
      return mesExclusivoElegido === ultimoMesElegible;
    } else {
      return mesesConAniosElegidos.flatMap(({ meses }) => meses).includes(ultimoMesElegible);
    }
  };

  const primerMesVisibleElegido = () => {
    const mesesFlat = mesesAMostrar.flatMap(({ meses }) => meses);
    const primerMesElegible = mesesFlat[0];
    if (mesesExclusivos) {
      return mesExclusivoElegido === primerMesElegible;
    } else {
      return mesesConAniosElegidos.flatMap(({ meses }) => meses).includes(primerMesElegible);
    }
  };

  const moverIzquierdaDisabled = ultimoMesVisibleElegido();
  const moverADerechaDisabled = primerMesVisibleElegido();
  const mesesElegidos = mesesConAniosElegidos.flatMap(({ meses }) => meses);

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

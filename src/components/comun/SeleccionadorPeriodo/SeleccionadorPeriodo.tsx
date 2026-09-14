import { months, years } from '@/lib/definitions';
import { Box, FormControl, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import { crearFecha, obtenerMesesPorAnio, moverFecha, AnioConMeses } from '../seleccionadorPeriodoHelper';
import { styles } from './SeleccionadorPeriodo.styles';

const initialDate = new Date();

interface SeleccionadorPeriodoProps {
  anio?: number;
  mes?: string;
  meses?: AnioConMeses[];
  onAnioConMesesElegidos?: (mesesElegidos: string[], mesesVisibles: AnioConMeses[]) => void;
  setMesYAnio?: (mes: string, anio: number) => void;
  mesesExclusivos?: boolean;
  disableChangeMonths?: boolean;
}
const SeleccionadorPeriodo = ({
  anio,
  mes,
  meses,
  setMesYAnio,
  onAnioConMesesElegidos,
  mesesExclusivos,
  disableChangeMonths,
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
    const nuevosMesesAMostrar = obtenerMesesPorAnio(newFechaInicial);
    setMesesAMostrar(nuevosMesesAMostrar);
    return nuevosMesesAMostrar;
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
    const nuevosMesesAMostrar = updateFechaInicial(crearFecha(nuevoAnio, primerMesElegido));
    if (mesesExclusivos) {
      setMesYAnio && setMesYAnio(primerMesElegido, nuevoAnio);
    } else {
      setMesesConAniosElegidos([]);
      onAnioConMesesElegidos && onAnioConMesesElegidos([], nuevosMesesAMostrar);
    }
  };

  const onMesElegido = (mesSeleccionado: string) => {
    const mesAMostrarElegido = mesesAMostrar.find(({ meses }) => meses.includes(mesSeleccionado));
    if (!mesAMostrarElegido) return;

    updateAniosElegibles([mesAMostrarElegido.anio]);
    setMesExclusivoElegido(mesSeleccionado);
    setMesYAnio && setMesYAnio(mesSeleccionado, mesAMostrarElegido.anio);
  };

  const onMesesElegidos = (nuevosMeses: string[]) => {
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
    onAnioConMesesElegidos && onAnioConMesesElegidos(nuevosMeses, mesesAMostrar);
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

  const moverIzquierdaDisabled = disableChangeMonths || ultimoMesVisibleElegido();
  const moverADerechaDisabled = disableChangeMonths || primerMesVisibleElegido();
  const mesesElegidos = mesesConAniosElegidos.flatMap(({ meses }) => meses);

  const mesesVisibles = mesesAMostrar.flatMap(({ meses }) => meses);

  const anioParaEnero = mesesAMostrar
    .find(({ meses }) => meses.includes('Enero'))
    ?.anio.toString()
    .slice(-2);
  const anioParaDiciembre = mesesAMostrar
    .find(({ meses }) => meses.includes('Diciembre'))
    ?.anio.toString()
    .slice(-2);

  const etiquetaDeMes = (mesItem: string) => {
    if (mesItem === 'Enero') return `enero ${anioParaEnero}`;
    if (mesItem === 'Diciembre') return `diciembre ${anioParaDiciembre}`;
    return mesItem.toLowerCase();
  };

  if (mesesExclusivos) {
    return (
      <Box sx={styles.exclusiveContainer}>
        <FormControl size="small">
          <Select
            value={obtenerAnioDelMesActual()}
            onChange={onAnioElegido}
            variant="outlined"
            sx={styles.exclusiveYearSelect}
          >
            {aniosElegibles.map((year) => (
              <MenuItem key={year} value={year} sx={styles.exclusiveYearMenuItem}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          component="button"
          onClick={onMoverMesesIzquierda}
          disabled={moverIzquierdaDisabled}
          sx={{
            ...styles.exclusiveNavButton,
            mr: '6px',
            color: moverIzquierdaDisabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
            cursor: moverIzquierdaDisabled ? 'default' : 'pointer',
            opacity: moverIzquierdaDisabled ? 0.3 : 1,
          }}
        >
          <ChevronLeftIcon sx={styles.chevronIcon} />
        </Box>
        {mesesVisibles.map((mesItem) => {
          const isActive = mesItem === mesExclusivoElegido;
          return (
            <Box
              key={mesItem}
              component="button"
              onClick={() => onMesElegido(mesItem)}
              sx={{
                ...styles.exclusiveTab,
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                '&:hover': {
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                },
              }}
            >
              {etiquetaDeMes(mesItem)}
            </Box>
          );
        })}
        <Box
          component="button"
          onClick={onMoverMesesDerecha}
          disabled={moverADerechaDisabled}
          sx={{
            ...styles.exclusiveNavButton,
            ml: '6px',
            color: moverADerechaDisabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
            cursor: moverADerechaDisabled ? 'default' : 'pointer',
            opacity: moverADerechaDisabled ? 0.3 : 1,
          }}
        >
          <ChevronRightIcon sx={styles.chevronIcon} />
        </Box>
      </Box>
    );
  }

  // Multi-select mode (used by other pages) — keep original style
  const mesesElegidosFlat = mesesConAniosElegidos.flatMap(({ meses }) => meses);

  return (
    <Box sx={styles.multiContainer}>
      <FormControl sx={styles.yearFormControl}>
        <Select sx={styles.yearSelect} value={obtenerAnioDelMesActual()} onChange={onAnioElegido}>
          {aniosElegibles.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={styles.multiButtonRow}>
        <Button
          variant="contained"
          startIcon={<ChevronLeftIcon />}
          onClick={onMoverMesesIzquierda}
          disabled={moverIzquierdaDisabled}
        />
        <Box sx={styles.multiMonthsBox}>
          {mesesVisibles.map((mesItem) => {
            const isActive = mesesElegidosFlat.includes(mesItem);
            return (
              <Button
                key={mesItem}
                variant={isActive ? 'contained' : 'text'}
                onClick={() => onMesesElegidos([...mesesElegidosFlat, mesItem])}
                sx={styles.multiMonthButton}
              >
                {mesItem}
              </Button>
            );
          })}
        </Box>
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

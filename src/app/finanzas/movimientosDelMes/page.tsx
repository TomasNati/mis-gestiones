'use client';

import { obtenerMovimientosPorFecha } from '@/lib/orm/data';
import { Movimientos } from '@/components/Movimientos';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { MovimientoGasto } from '@/lib/definitions';

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const years = [2024, 2023, 2022];

const MovimientosDelMes = () => {
  const [anio, setAnio] = useState<number | undefined>(new Date().getFullYear());
  const [mes, setMes] = useState(months[new Date().getMonth()]);
  const [movimientos, setMovimientos] = useState<MovimientoGasto[]>([]);

  useEffect(() => {
    const obtenerMovimientos = async () => {
      if (anio && mes) {
        const obtenerMovimientos = async () => {
          const fecha = new Date(anio, months.indexOf(mes), 1);
          const primerDiaDelMesActual = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
          const movimientos = await obtenerMovimientosPorFecha(primerDiaDelMesActual);

          const movimientosNoCredito = movimientos.filter(
            (movimiento) => movimiento.tipoDeGasto.toString() !== 'Credito',
          );
          const movimientosCredito = movimientos.filter(
            (movimiento) => movimiento.tipoDeGasto.toString() === 'Credito',
          );
          return [...movimientosNoCredito, ...movimientosCredito];
        };
        const movimientos = await obtenerMovimientos();
        setMovimientos(movimientos);
      }
    };
    obtenerMovimientos();
  }, [mes, anio]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" gutterBottom>
          Movimientos del mes
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', marginTop: 3, marginBottom: 3 }}>
        <Button
          component={NextLink}
          variant="outlined"
          startIcon={<PlaylistAdd />}
          color="primary"
          sx={{ marginRight: 2 }}
          href="/finanzas/movimientosDelMes/agregar"
        >
          Agregar
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <FormControl sx={{ width: '100px', marginRight: '10px', marginBottom: '5px' }}>
          <Select
            sx={{
              '& .MuiSelect-select': {
                padding: '2px 0 2px 4px',
              },
            }}
            value={anio}
            onChange={(e) => setAnio(e.target.value as number)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box>
          {months.map((month, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => setMes(month)}
              color={month === mes ? 'success' : 'secondary'}
              sx={{
                marginRight: 1,
                marginBottom: 2,
                padding: '0 2px',
              }}
            >
              {month}
            </Button>
          ))}
        </Box>
      </Box>
      <Movimientos movimientos={movimientos} />
    </Box>
  );
};

export default MovimientosDelMes;

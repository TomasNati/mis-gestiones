'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { importarMovimientos } from '@/lib/actions';
import { useState } from 'react';

const years = [2022, 2023, 2024];
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

const Importar = () => {
  const [anio, setAnio] = useState(2024);
  const [mes, setMes] = useState('Enero');

  return (
    <form action={importarMovimientos}>
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" gutterBottom>
            Importar movimientos
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '80vh', // Set the container height to 80% of the viewport height
          }}
        >
          <Box sx={{ display: 'flex', marginBottom: '10px' }}>
            <FormControl sx={{ width: '100px', marginRight: '10px' }}>
              <InputLabel htmlFor="anio">Año</InputLabel>
              <Select
                label="Año"
                sx={{
                  '& .MuiSelect-select': {
                    paddingTop: '8px',
                    paddingBottom: '8px',
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
            <FormControl sx={{ width: '150px' }}>
              <InputLabel>Año</InputLabel>
              <Select
                label="Mes"
                sx={{
                  '& .MuiSelect-select': {
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  },
                }}
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Your Text"
            multiline
            variant="outlined"
            fullWidth
            rows={30}
            id="textoAImportar"
            name="textoAImportar"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              width: 'fit-content',
              marginTop: '5px',
            }}
          >
            Import
          </Button>
        </Box>
      </Container>
    </form>
  );
};

export default Importar;

/*
El text area guarda valores así:
'2\tServicios\tCrédito\t$13,000.00\tLawn Tennis\n2\tServicios\tCrédito\t$14,240.00\tTIC'

donde \t es el separador de columnas y \n es el separador de filas

*/

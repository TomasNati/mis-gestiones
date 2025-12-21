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
import { importarDatos } from '@/lib/orm/actions';
import { useEffect, useState } from 'react';
import { ImportarResult, TipoDeImportacion, months } from '@/lib/definitions';
import { Notificacion, ConfiguracionNotificacion } from '@/components/Notificacion';

const years = [2022, 2023, 2024, 2025, 2026, 2027];
const tipoDeImportacion: TipoDeImportacion[] = ['Gastos del mes', 'Presupuesto del mes', 'Horas sueño Tomi'];

const Importar = () => {
  const [anio, setAnio] = useState(2024);
  const [mes, setMes] = useState('Enero');
  const [tipo, setTipo] = useState<TipoDeImportacion>('Horas sueño Tomi');
  const [textoAImportar, setTextoAImportar] = useState('');
  const [importar, setImportar] = useState(false);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  useEffect(() => {
    const importarDatosNuevos = async () => {
      if (importar) {
        const resultado: ImportarResult = await importarDatos({
          anio,
          mes: months.indexOf(mes) + 1,
          tipo,
          textoAImportar,
        });
        console.log(resultado);
        if (resultado.exitoso) {
          setConfigNotificacion({
            open: true,
            severity: 'success',
            mensaje: 'Importación realizada correctamente',
          });
        } else {
          setConfigNotificacion({
            open: true,
            severity: 'error',
            mensaje: 'Error al importar',
          });
        }
        setImportar(false);
      }
    };
    importarDatosNuevos();
  }, [importar, anio, mes, tipo, textoAImportar]);

  return (
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
          Importar datos
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
            <InputLabel>Mes</InputLabel>
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
          <FormControl sx={{ width: '200px', marginRight: '10px' }}>
            <InputLabel htmlFor="anio">Tipo</InputLabel>
            <Select
              label="Tipo"
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px',
                },
              }}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoDeImportacion)}
            >
              {tipoDeImportacion.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
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
          value={textoAImportar}
          onChange={(e) => setTextoAImportar(e.target.value)}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 'fit-content',
              marginTop: '5px',
            }}
            onClick={() => {
              setImportar(true);
            }}
          >
            Import
          </Button>
          <Notificacion configuracionProp={configNotificacion} />
        </Box>
      </Box>
    </Container>
  );
};

export default Importar;

/*
El text area guarda valores así:
'2\tServicios\tCrédito\t$13,000.00\tLawn Tennis\n2\tServicios\tCrédito\t$14,240.00\tTIC'

donde \t es el separador de columnas y \n es el separador de filas

*/

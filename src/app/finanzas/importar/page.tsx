import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { importarMovimientos } from '@/lib/actions';

const Importar = () => {
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

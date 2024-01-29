import { Box, Button, Container, TextField, Typography } from '@mui/material';

const Importar = () => {
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
        <TextField label="Your Text" multiline variant="outlined" fullWidth rows={30} />
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: 'fit-content',
            marginTop: '5px',
          }}
        >
          Import
        </Button>
      </Box>
    </Container>
  );
};

export default Importar;

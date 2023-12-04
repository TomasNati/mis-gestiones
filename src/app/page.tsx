import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function HomePage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <div>
        <Alert severity="info" sx={{ mt: 2, mb: 5 }}>
          <AlertTitle>Hello 👋</AlertTitle>
          This app uses the Next.js App Router and Material UI v5.
        </Alert>
        <Grid container rowSpacing={3} columnSpacing={3}>
          <Grid xs={6}>
            <span>hola</span>
          </Grid>
          <Grid xs={6}>
            <span>hola</span>
          </Grid>
          <Grid xs={6}>
            <span>hola</span>
          </Grid>
          <Grid xs={6}>
            <span>hola</span>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

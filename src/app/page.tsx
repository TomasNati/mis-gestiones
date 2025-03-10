import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Grid2 as Grid } from '@mui/material';

export default function HomePage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <div>
        <Alert severity="info" sx={{ mt: 2, mb: 5 }}>
          <AlertTitle>Hello 👋</AlertTitle>
          This app uses the Next.js App Router and Material UI v5.
        </Alert>
        <Grid container rowSpacing={3} columnSpacing={3}>
          <Grid size={{ xs: 6 }}>
            <span>hola</span>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <span>hola</span>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <span>hola</span>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <span>hola</span>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

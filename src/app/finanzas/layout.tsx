'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

const FinanzasLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        background: 'var(--bg-page)',
        minHeight: '100%',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </Box>
  );
};

export default FinanzasLayout;

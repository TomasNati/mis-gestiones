'use client';
import * as React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import theme from './theme';
import { ThemeProvider } from './ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeProvider>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}

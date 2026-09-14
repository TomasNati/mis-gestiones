'use client';

import { useTheme, ThemeName } from '../ThemeContext';
import { Box } from '@mui/material';
import { styles } from './ThemeSwitcher.styles';

const THEMES: { name: ThemeName; color: string; label: string }[] = [
  { name: 'dorado', color: '#C99A44', label: 'Dorado' },
  { name: 'verde', color: '#7ED9BB', label: 'Verde' },
  { name: 'cian', color: '#4FB8C4', label: 'Cian' },
  { name: 'gris', color: '#C9C4B9', label: 'Gris' },
];

const ThemeSwitcher = () => {
  const { themeName, setThemeName } = useTheme();

  return (
    <Box sx={styles.container}>
      {THEMES.map((t) => (
        <Box
          key={t.name}
          component="button"
          title={t.label}
          onClick={() => setThemeName(t.name)}
          sx={{
            ...styles.swatchButton,
            border: `1px solid ${themeName === t.name ? 'var(--accent)' : 'transparent'}`,
          }}
        >
          <Box component="span" sx={{ ...styles.swatchDot, background: t.color }} />
        </Box>
      ))}
    </Box>
  );
};

export { ThemeSwitcher };

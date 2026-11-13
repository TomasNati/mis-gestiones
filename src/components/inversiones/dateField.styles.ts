/**
 * Campo de fecha del tema (`.date-input` del mockup): misma altura, tipografía
 * mono y borde que el resto de los controles. Se comparte entre la barra
 * superior y el rango personalizado del historial para que ambos pickers se
 * vean iguales.
 */
export const dateFieldSx: Record<string, unknown> = {
  inlineSize: 168,
  '& .MuiOutlinedInput-root': {
    height: 'var(--control-h)',
    backgroundColor: 'var(--bg-inset)',
    fontSize: '12.5px',
    '& fieldset': { borderColor: 'var(--border-soft)' },
    '&:hover fieldset': { borderColor: 'var(--border-strong)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--accent-emphasis)' },
  },
  '& .MuiInputBase-input': {
    padding: '0 8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12.5px',
    color: 'var(--text-primary)',
  },
  '& .MuiInputLabel-root': {
    fontSize: '12.5px',
    color: 'var(--text-tertiary)',
    '&.Mui-focused': { color: 'var(--accent)' },
  },
  '& .MuiInputAdornment-root': { color: 'var(--text-tertiary)' },
  '& .MuiIconButton-root': { color: 'var(--text-tertiary)' },
};

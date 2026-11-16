/**
 * Estilos del modal de alta de inversión. Fuente: `docs/mockups/inversiones.html`
 * (`#nuevaModal`) + `.modal`, `.field`, `.form-row.c2` de `assets/app.css`.
 * El marco (paper, header, footer e inputs con `--bg-inset`) viene del `MuiDialog`
 * global del tema; acá sólo van los detalles del contenido.
 */
export const styles = {
  titulo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  tituloTexto: {
    fontSize: 'var(--fs-16)',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitulo: {
    marginTop: '2px',
    fontSize: '12.5px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-tertiary)',
  },
  cerrar: {
    width: '28px',
    height: '28px',
    padding: 0,
    borderRadius: 'var(--radius)',
    color: 'var(--text-secondary)',
    '&:hover': { backgroundColor: 'var(--bg-row-hover)', color: 'var(--text-primary)' },
  },
  iconoCerrar: { fontSize: '18px' },
  contenido: {
    width: '560px',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: 0,
  },
  etiqueta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  requerido: { color: 'var(--danger)' },
  ayuda: {
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
  },
  fila: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  /** `.input` del mockup: 32px de alto, 13.5px y foco con `--accent-emphasis`. */
  input: {
    '& .MuiOutlinedInput-root': {
      height: 'var(--control-h)',
      padding: '0 10px',
      backgroundColor: 'var(--bg-inset)',
      borderRadius: 'var(--radius)',
      fontSize: '13.5px',
      '& fieldset': { borderColor: 'var(--border-soft)' },
      '&:hover fieldset': { borderColor: 'var(--border-strong)' },
      '&.Mui-focused fieldset': { borderColor: 'var(--accent-emphasis)' },
    },
    '& .MuiInputBase-input': {
      padding: 0,
      fontSize: '13.5px',
      color: 'var(--text-primary)',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'var(--text-tertiary)',
      opacity: 1,
    },
  },
  /** `.input.mono.right`: cifras tabulares alineadas a la derecha. */
  inputCantidad: {
    '& .MuiInputBase-input': {
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums',
      textAlign: 'right',
    },
  },
  opcion: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    fontSize: '13px',
  },
  opcionCodigo: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  opcionTipo: {
    marginLeft: 'auto',
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
  },
  /**
   * Lista desplegable de los autocompletes: superficie de popover del mockup
   * (`.popover`: `--bg-overlay`, borde, radio largo y sombra) con ítems compactos
   * de 13px, alineados con el resto del tema.
   */
  popper: {
    marginTop: '4px',
    backgroundColor: 'var(--bg-overlay)',
    backgroundImage: 'none',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-overlay)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    '& .MuiAutocomplete-listbox': {
      padding: '4px',
      maxHeight: 280,
    },
    '& .MuiAutocomplete-option': {
      minHeight: 0,
      padding: '6px 8px',
      borderRadius: 'var(--radius)',
      fontSize: '13px',
      color: 'var(--text-primary)',
      '&.Mui-focused, &[aria-selected="true"]': {
        backgroundColor: 'var(--bg-row-hover)',
      },
      '&[aria-selected="true"].Mui-focused': {
        backgroundColor: 'var(--bg-emphasis)',
      },
    },
    '& .MuiAutocomplete-noOptions': {
      padding: '10px 12px',
      fontSize: '12.5px',
      color: 'var(--text-tertiary)',
    },
  },
  botonSecundario: {
    backgroundColor: 'var(--bg-elevated)',
    borderColor: 'var(--border-soft)',
    color: 'var(--text-primary)',
    '&:hover': { backgroundColor: 'var(--bg-row-hover)', borderColor: 'var(--border-strong)' },
  },
} as const;

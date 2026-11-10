/** Estilos del modal de edición de día (mockup `docs/mockups/tomi.html`, `#diaModal`). */
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
  },
  bloque: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  blockTitle: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  blockHint: {
    fontWeight: 400,
    color: 'var(--text-tertiary)',
  },
  eventos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  separador: {
    border: 0,
    borderTop: '1px solid var(--border-muted)',
    margin: '2px 0',
    width: '100%',
  },
  notaFila: {
    display: 'grid',
    gridTemplateColumns: '170px 1fr auto',
    gap: '8px',
    alignItems: 'start',
  },
  notaTipo: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--bg-inset)',
      borderRadius: 'var(--radius)',
      fontSize: '13px',
    },
    '& .MuiInputBase-input': { fontSize: '13px' },
  },
  notaComentario: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--bg-inset)',
      borderRadius: 'var(--radius)',
      fontSize: '13px',
    },
    '& .MuiInputBase-input': { fontSize: '13px', minHeight: '56px' },
  },
  notaValor: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  notaDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  borrar: {
    width: '24px',
    height: '24px',
    padding: 0,
    borderRadius: 'var(--radius)',
    color: 'var(--text-tertiary)',
    '&:hover': { color: 'var(--danger)', backgroundColor: 'var(--danger-soft)' },
  },
  iconoBorrar: { fontSize: '16px' },
  botonGhost: {
    alignSelf: 'flex-start',
    color: 'var(--text-secondary)',
    '& .MuiButton-startIcon': { marginRight: '6px' },
    '&:hover': { backgroundColor: 'var(--bg-row-hover)', color: 'var(--text-primary)' },
  },
  botonSecundario: {
    backgroundColor: 'var(--bg-elevated)',
    borderColor: 'var(--border-soft)',
    color: 'var(--text-primary)',
    '&:hover': { backgroundColor: 'var(--bg-row-hover)', borderColor: 'var(--border-strong)' },
  },
  acciones: {
    justifyContent: 'flex-start',
  },
  footerTexto: {
    marginRight: 'auto',
    fontSize: '12.5px',
    color: 'var(--text-tertiary)',
  },
} as const;

/** sx dinámico de cada opción del select de notas (atenúa las inactivas). */
export const notaOpcionSx = (activa: boolean) => ({
  fontSize: '13px',
  ...(!activa && { opacity: 0.5 }),
});

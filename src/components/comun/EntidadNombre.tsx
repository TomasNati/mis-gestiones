interface EntidadNombreProps {
  nombre?: string;
  active?: boolean;
}

export const EntidadNombre = ({ nombre, active }: EntidadNombreProps) =>
  active === false ? <span style={{ opacity: 0.6, color: '#999' }}>{nombre}</span> : <span>{nombre}</span>;

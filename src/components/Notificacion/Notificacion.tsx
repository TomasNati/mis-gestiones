import { Snackbar, Alert } from '@mui/material';
import { useEffect, useState, SyntheticEvent } from 'react';

type ConfiguracionNotificacion = {
  open: boolean;
  severity: 'success' | 'info' | 'warning' | 'error';
  mensaje: string;
};

interface INotificacionProps {
  configuracionProp: ConfiguracionNotificacion;
}
const Notificacion = ({ configuracionProp }: INotificacionProps) => {
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>(configuracionProp);

  useEffect(() => {
    setConfigNotificacion(configuracionProp);
  }, [configuracionProp]);

  const onOcultarMensaje = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setConfigNotificacion({ ...configNotificacion, open: false });
  };

  return (
    <Snackbar
      open={configNotificacion.open}
      autoHideDuration={6000}
      onClose={onOcultarMensaje}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onOcultarMensaje} severity={configNotificacion.severity} variant="filled" sx={{ width: '100%' }}>
        {configNotificacion.mensaje}
      </Alert>
    </Snackbar>
  );
};

export { Notificacion };
export type { ConfiguracionNotificacion };

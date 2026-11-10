import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Box, Button } from '@mui/material';
import type { ReactNode } from 'react';

type TonoAlerta = 'danger' | 'attention' | 'info';

const tonos: Record<TonoAlerta, Record<string, unknown>> = {
  danger: {
    borderColor: 'var(--danger-border)',
    backgroundColor: 'var(--danger-soft)',
    '& .alert-icon': { color: 'var(--danger)' },
  },
  attention: {
    borderColor: 'var(--attention-border)',
    backgroundColor: 'var(--attention-soft)',
    '& .alert-icon': { color: 'var(--attention)' },
  },
  info: {
    borderColor: 'rgba(68, 147, 248, 0.4)',
    backgroundColor: 'var(--accent-soft)',
    alignItems: 'center',
    '& .alert-icon': { color: 'var(--accent)' },
  },
};

const Alerta = ({
  tone,
  icon,
  children,
  action,
}: {
  tone: TonoAlerta;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <Box
    role="alert"
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border-soft)',
      backgroundColor: 'var(--bg-panel)',
      fontSize: '13px',
      color: 'var(--text-secondary)',
      ...tonos[tone],
    }}
  >
    <Box className="alert-icon" sx={{ display: 'flex', flexShrink: 0, marginTop: '1px' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    {action}
  </Box>
);

const Num = ({ children }: { children: ReactNode }) => (
  <Box component="span" sx={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
    {children}
  </Box>
);

interface InversionesAlertsProps {
  errorCarga: boolean;
  sinCotizacionDelDia: boolean;
  diaSeleccionado: string;
  instrumentosSinPrecio: string[];
  viendoHistorial: boolean;
  onVolverAHoy: () => void;
}

/** Sección `.alerts` del mockup: errores de carga, precios faltantes e historial. */
export const InversionesAlerts = ({
  errorCarga,
  sinCotizacionDelDia,
  diaSeleccionado,
  instrumentosSinPrecio,
  viendoHistorial,
  onVolverAHoy,
}: InversionesAlertsProps) => {
  const hayAlertas = errorCarga || sinCotizacionDelDia || instrumentosSinPrecio.length > 0 || viendoHistorial;
  if (!hayAlertas) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '0 var(--gutter) 14px',
      }}
    >
      {errorCarga && (
        <Alerta tone="danger" icon={<ErrorOutlineIcon sx={{ fontSize: 18 }} />}>
          <b>Hubo un error al cargar las inversiones.</b>
        </Alerta>
      )}

      {sinCotizacionDelDia && (
        <Alerta tone="danger" icon={<ErrorOutlineIcon sx={{ fontSize: 18 }} />}>
          <b>
            No hay cotización del dólar guardada para el <Num>{diaSeleccionado}</Num>
          </b>
          : no se pueden calcular precios ni totales.
        </Alerta>
      )}

      {instrumentosSinPrecio.length > 0 && (
        <Alerta tone="attention" icon={<WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />}>
          <b>
            Sin precio guardado para el <Num>{diaSeleccionado}</Num>
          </b>
          : <Num>{instrumentosSinPrecio.join(', ')}</Num>
        </Alerta>
      )}

      {viendoHistorial && (
        <Alerta
          tone="info"
          icon={<HistoryOutlinedIcon sx={{ fontSize: 18 }} />}
          action={
            <Button
              size="small"
              variant="outlined"
              startIcon={<UndoIcon />}
              onClick={onVolverAHoy}
              sx={{ flexShrink: 0 }}
            >
              Volver a hoy
            </Button>
          }
        >
          Viendo el estado guardado del{' '}
          <b>
            <Num>{diaSeleccionado}</Num>
          </b>{' '}
          · solo lectura
        </Alerta>
      )}
    </Box>
  );
};

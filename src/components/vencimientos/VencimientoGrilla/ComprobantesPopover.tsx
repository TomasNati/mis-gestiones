import { ComprobantePagoBusqueda } from '@/lib/definitions';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import {
  CircularProgress,
  IconButton,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';

interface ComprobantesPopoverProps {
  anchorEl: HTMLElement | null;
  comprobantes: ComprobantePagoBusqueda[];
  descargando: string | null;
  onClose: () => void;
  onDescargar: (comprobante: ComprobantePagoBusqueda) => void;
}

export const ComprobantesPopover = ({
  anchorEl,
  comprobantes,
  descargando,
  onClose,
  onDescargar,
}: ComprobantesPopoverProps) => (
  <Popover
    open={Boolean(anchorEl)}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    slotProps={{ paper: { sx: { mt: 0.5 } } }}
  >
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Archivo</TableCell>
          <TableCell align="right">Descargar</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {comprobantes.map((comprobante) => (
          <TableRow key={comprobante.id} hover>
            <TableCell sx={{ wordBreak: 'break-all' }}>{comprobante.nombre}</TableCell>
            <TableCell align="right">
              {comprobante.path ? (
                <Tooltip title={`Descargar ${comprobante.nombre}`}>
                  <span>
                    <IconButton
                      size="small"
                      color="inherit"
                      disabled={descargando === comprobante.id}
                      aria-label={`Descargar ${comprobante.nombre}`}
                      onClick={() => onDescargar(comprobante)}
                    >
                      {descargando === comprobante.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DownloadIcon fontSize="small" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="La subcategoria no tiene comprobantes_path: no se puede resolver la ruta del archivo">
                  <span>
                    <IconButton size="small" disabled aria-label="Descargar no disponible">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Popover>
);

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ChangeEvent } from 'react';
import { styles } from './AgregarEditarModal.styles';

export const MAX_COMPROBANTES = 3;

export interface ComprobanteState {
  archivo: File | null;
  comentario: string;
}

const comprobanteVacio: ComprobanteState = {
  archivo: null,
  comentario: '',
};

export const crearComprobantesIniciales = (): ComprobanteState[] =>
  Array.from({ length: MAX_COMPROBANTES }, () => ({ ...comprobanteVacio }));

const extensionArchivo = (nombre: string) => {
  const ultimoPunto = nombre.lastIndexOf('.');
  return ultimoPunto > 0 ? nombre.slice(ultimoPunto + 1).toLowerCase() : '';
};

export const nombreComprobanteArchivo = (prefijo: string, comprobante: ComprobanteState) => {
  if (!comprobante.archivo) {
    return '';
  }
  const comentarioNormalizado = comprobante.comentario.trim();
  const extension = extensionArchivo(comprobante.archivo.name);
  return `${prefijo}${comentarioNormalizado ? `-${comentarioNormalizado}` : ''}${extension ? `.${extension}` : ''}`;
};

export const subpathsDuplicados = (comprobantes: ComprobanteState[], prefijo: string): string[] => {
  const conteo = new Map<string, number>();
  comprobantes
    .filter(({ archivo }) => Boolean(archivo))
    .map((comprobante) => nombreComprobanteArchivo(prefijo, comprobante))
    .forEach((subpath) => conteo.set(subpath, (conteo.get(subpath) ?? 0) + 1));
  return Array.from(conteo.entries())
    .filter(([, veces]) => veces > 1)
    .map(([subpath]) => subpath);
};

interface ComprobantesSectionProps {
  comprobantes: ComprobanteState[];
  prefijo: string;
  disabled: boolean;
  duplicados: string[];
  onArchivoSeleccionado: (indice: number, archivo: File | null) => void;
  onComentarioChanged: (indice: number, comentario: string) => void;
  onEliminarArchivo: (indice: number) => void;
}

export const ComprobantesSection = ({
  comprobantes,
  prefijo,
  disabled,
  duplicados,
  onArchivoSeleccionado,
  onComentarioChanged,
  onEliminarArchivo,
}: ComprobantesSectionProps) => {
  const cantidadComprobantes = comprobantes.filter(({ archivo }) => Boolean(archivo)).length;

  const handleArchivoSeleccionado = (indice: number, event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0] || null;
    event.target.value = '';
    onArchivoSeleccionado(indice, archivo);
  };

  return (
    <Accordion
      disabled={disabled}
      disableGutters
      sx={styles.comprobantesSection}
      slotProps={{ heading: { sx: { all: 'inherit', border: 0, px: 1 } } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="comprobantes-content" id="comprobantes-header">
        <Typography variant="body2" color={disabled ? 'text.disabled' : 'text.primary'}>
          Comprobantes de pago ({cantidadComprobantes}/{MAX_COMPROBANTES})
        </Typography>
      </AccordionSummary>
      <AccordionDetails id="comprobantes-content">
        <Box display="flex" flexDirection="column" gap={1.5}>
          {comprobantes.map((comprobante, indice) => (
            <Box key={indice} display="flex" flexDirection="column" gap={0.5}>
              <Box display="flex" gap={0.5} alignItems="center">
                <Tooltip title={comprobante.archivo ? comprobante.archivo.name : `Seleccionar archivo ${indice + 1}`}>
                  <span>
                    <IconButton
                      component="label"
                      color="primary"
                      size="small"
                      disabled={disabled}
                      aria-label={`Seleccionar archivo ${indice + 1}`}
                    >
                      <AttachFileIcon fontSize="small" />
                      <input type="file" hidden onChange={(event) => handleArchivoSeleccionado(indice, event)} />
                    </IconButton>
                  </span>
                </Tooltip>
                <TextField
                  label="Comentario"
                  value={comprobante.comentario}
                  onChange={(e) => onComentarioChanged(indice, e.target.value)}
                  disabled={disabled || !comprobante.archivo}
                  size="small"
                  sx={{ flex: 1 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {prefijo}
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Tooltip title={comprobante.archivo ? 'Quitar archivo' : 'Sin archivo para quitar'}>
                  <span>
                    <IconButton
                      color="error"
                      size="small"
                      disabled={disabled || !comprobante.archivo}
                      onClick={() => onEliminarArchivo(indice)}
                      aria-label={`Quitar archivo ${indice + 1}`}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              {comprobante.archivo ? (
                <Typography variant="caption" color="text.secondary">
                  {nombreComprobanteArchivo(prefijo, comprobante)}
                </Typography>
              ) : null}
            </Box>
          ))}
          {duplicados.length > 0 ? (
            <Typography variant="caption" color="error">
              Hay comprobantes que se van a guardar con el mismo nombre: {duplicados.join(', ')}. Agregá un comentario
              para distinguirlos.
            </Typography>
          ) : null}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

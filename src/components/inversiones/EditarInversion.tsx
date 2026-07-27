import { Inversion } from '@/lib/definitions';
import { Alert, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import {
  MRT_EditActionButtons,
  MRT_EditCellTextField,
  type MRT_Row,
  type MRT_TableInstance,
} from 'material-react-table';

interface EditarInversionProps {
  row: MRT_Row<Inversion>;
  table: MRT_TableInstance<Inversion>;
}

const DatoSoloLectura = ({ label, valor }: { label: string; valor: string }) => (
  <div>
    <Typography variant="caption" color="text.secondary" component="div">
      {label}
    </Typography>
    <Typography variant="body2">{valor || '-'}</Typography>
  </div>
);

export const EditarInversion = ({ row, table }: EditarInversionProps) => {
  const inversion = row.original;
  const { instrumento } = inversion;
  const cantidadCell = row.getAllCells().find((cell) => cell.column.id === 'cantidad');

  const nombreInstrumento = instrumento.codigo
    ? `${instrumento.nombre} (${instrumento.codigo})`
    : instrumento.nombre;

  return (
    <>
      <DialogTitle>Editar Inversión</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <DatoSoloLectura label="Instrumento" valor={nombreInstrumento} />
          <DatoSoloLectura label="Tipo" valor={instrumento.tipo} />
          {cantidadCell && (
            // `slotProps.htmlInput` replaces the one MRT passes as the deprecated
            // `inputProps`, so its `autoComplete: 'off'` has to be repeated here.
            <MRT_EditCellTextField
              cell={cantidadCell}
              table={table}
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 'any', autoComplete: 'off' } }}
            />
          )}
          <DatoSoloLectura label="Tipo de Renta" valor={instrumento.clase_renta} />
          <DatoSoloLectura label="Broker" valor={inversion.broker} />
          <Alert severity="info" sx={{ bgcolor: '#344d6b' }}>
            Se recomienda usar <strong>Guardar estado</strong> antes de guardar los cambios, para conservar el
            historial con la cantidad actual.
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons row={row} table={table} variant="text" />
      </DialogActions>
    </>
  );
};

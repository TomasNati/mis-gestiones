import { CategoriaUIMovimiento } from '@/lib/definitions';
import { Autocomplete, Box, TextField, autocompleteClasses, outlinedInputClasses } from '@mui/material';

interface ConceptoProps {
  categoriasMovimiento: CategoriaUIMovimiento[];
  conceptoInicial?: CategoriaUIMovimiento;
  onConceptoModificado: (concepto: CategoriaUIMovimiento) => void;
}
const Concepto = ({ categoriasMovimiento, conceptoInicial, onConceptoModificado }: ConceptoProps) => {
  return (
    <Box
      sx={{
        '& .input-concepto': {
          '> div': {
            width: '250px',
          },
          [`& .${autocompleteClasses.input}`]: {
            padding: '0 !important',
          },
          [`& .${outlinedInputClasses.root}`]: {
            padding: '8px',
          },
        },
      }}
    >
      <Autocomplete
        id="concepto"
        className="input-concepto"
        options={categoriasMovimiento}
        groupBy={(option: CategoriaUIMovimiento) => option.categoriaNombre}
        getOptionLabel={(option: CategoriaUIMovimiento) => option.nombre}
        value={conceptoInicial}
        onChange={(_, newValue) => {
          if (newValue) {
            onConceptoModificado(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  );
};

export { Concepto };

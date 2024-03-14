import { CategoriaUIMovimiento } from '@/lib/definitions';
import { Autocomplete, TextField } from '@mui/material';

interface ConceptoProps {
  categoriasMovimiento: CategoriaUIMovimiento[];
  conceptoInicial?: CategoriaUIMovimiento;
  onConceptoModificado: (concepto: CategoriaUIMovimiento) => void;
}
const Concepto = ({ categoriasMovimiento, conceptoInicial, onConceptoModificado }: ConceptoProps) => {
  return (
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
  );
};

export { Concepto };

import { CategoriaUIMovimiento, MovimientoGastoGrilla } from '@/lib/definitions';
import { Autocomplete, Box, TextField, autocompleteClasses, outlinedInputClasses } from '@mui/material';
import { GridFilterInputValueProps, GridFilterOperator } from '@mui/x-data-grid';
import { useImperativeHandle, useRef, useState } from 'react';

interface ConceptoProps {
  categoriasMovimiento: CategoriaUIMovimiento[];
  conceptoInicial?: CategoriaUIMovimiento | null;
  onConceptoModificado: (concepto: CategoriaUIMovimiento) => void;
  onTabPressed: () => void;
  size?: 'small' | 'medium';
  label?: string;
}
const Concepto = ({
  categoriasMovimiento,
  conceptoInicial,
  onConceptoModificado,
  onTabPressed,
  size,
  label,
}: ConceptoProps) => {
  const ref = useRef<HTMLElement>();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      onTabPressed();
    }
  };

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
        ref={ref}
        onKeyDown={handleKeyDown}
        options={categoriasMovimiento}
        groupBy={(option: CategoriaUIMovimiento) => option.categoriaNombre}
        getOptionLabel={(option: CategoriaUIMovimiento) => option.nombre}
        value={conceptoInicial}
        size={size}
        onChange={(_, newValue) => {
          if (newValue) {
            onConceptoModificado(newValue);
          }
        }}
        renderInput={(params) => <TextField label={label} {...params} />}
      />
    </Box>
  );
};

function ConceptoFilterInput(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;
  const [value, setValue] = useState(item.value || '');

  const conceptoRef: React.Ref<any> = useRef(null);
  useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      conceptoRef?.current?.querySelector('input').focus();
    },
  }));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <TextField
      ref={conceptoRef}
      value={value}
      onChange={handleInputChange}
      variant="standard"
      placeholder="Filter value"
      fullWidth
      label="Concepto"
    />
  );
}

const conceptoOperators: GridFilterOperator<any, MovimientoGastoGrilla>[] = [
  {
    label: 'Contains',
    value: 'contains',
    getApplyFilterFn: (filterItem, column) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (value) => {
        const movimiento = value.row as MovimientoGastoGrilla;
        return movimiento.concepto?.nombre?.toLowerCase().includes(filterItem.value.toLowerCase());
      };
    },
    InputComponent: ConceptoFilterInput,
  },
];

export { Concepto, conceptoOperators };

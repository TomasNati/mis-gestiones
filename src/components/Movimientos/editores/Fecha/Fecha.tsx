import { MovimientoGastoGrilla } from '@/lib/definitions';
import { focusOnField, obtenerDiasEnElMes } from '@/lib/helpers';
import { TextField } from '@mui/material';
import {
  GridCellParams,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterOperator,
  GridRenderCellParams,
  GridTreeNode,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useImperativeHandle, useRef, useState } from 'react';

interface FechaProps {
  initialValue?: number;
  diasDelMes: number;
  onChange: (value?: number) => void;
  onTabPressed: () => void;
}

const Fecha: React.FC<FechaProps> = ({ initialValue = 1, onChange, diasDelMes, onTabPressed }) => {
  const [value, setValue] = useState<number | undefined>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value);

    if (isNaN(newValue)) {
      setValue(undefined);
      onChange(undefined);
    } else if (newValue >= 1 && newValue <= diasDelMes) {
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleTabPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      onTabPressed();
    }
  };

  return (
    <TextField
      type="number"
      value={value}
      onChange={handleChange}
      onKeyDown={handleTabPress}
      inputProps={{ min: 1, max: diasDelMes, step: 1 }}
      variant="outlined"
    />
  );
};

const FechaEditInputCell = (props: GridRenderCellParams<any, Date>) => {
  const { id, value, field } = props;
  const anio = value?.getFullYear() || new Date().getFullYear();
  const mes = value?.getMonth() || new Date().getMonth();
  const dia = value?.getDate() || 1;
  const diasEnMes = obtenerDiasEnElMes(new Date(anio, mes, 1));
  const apiRef = useGridApiContext();

  const handleChange = (nuevoDia?: number) => {
    const newValue = nuevoDia ? new Date(anio, mes, nuevoDia) : undefined;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  const handleTabPressed = () => focusOnField(id as string, 'concepto');

  return <Fecha diasDelMes={diasEnMes} onChange={handleChange} initialValue={dia} onTabPressed={handleTabPressed} />;
};

function FechaFilterInput(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef } = props;
  const [value, setValue] = useState(item.value || '');

  const fechaRef: React.Ref<any> = useRef(null);
  useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      fechaRef?.current?.querySelector('input').focus();
    },
  }));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <TextField
      ref={fechaRef}
      value={value}
      onChange={handleInputChange}
      variant="standard"
      placeholder="Filter value"
      fullWidth
      label="Fecha"
    />
  );
}

const applyFilterFecha = (filterItem: GridFilterItem) => {
  if (!filterItem.field || !filterItem.value || !filterItem.operator) {
    return null;
  }

  return (value: GridCellParams<any, MovimientoGastoGrilla, MovimientoGastoGrilla, GridTreeNode>) => {
    const movimiento = value.row as MovimientoGastoGrilla;
    const dia = new Date(movimiento.fecha).getDate();
    switch (filterItem.operator) {
      case '<':
        return dia < parseInt(filterItem.value);
      case '<=':
        return dia <= parseInt(filterItem.value);
      case '=':
        return dia === parseInt(filterItem.value);
      case '>':
        return dia > parseInt(filterItem.value);
      case '>=':
        return dia >= parseInt(filterItem.value);
      case '!=':
        return dia !== parseInt(filterItem.value);
      default:
        return false;
    }
  };
};

const fechaOperators: GridFilterOperator<any, MovimientoGastoGrilla>[] = [
  {
    label: '=',
    value: '=',
    getApplyFilterFn: applyFilterFecha,
    InputComponent: FechaFilterInput,
  },
  {
    label: '!=',
    value: '!=',
    getApplyFilterFn: applyFilterFecha,
    InputComponent: FechaFilterInput,
  },
  {
    label: '<',
    value: '<',
    getApplyFilterFn: applyFilterFecha,
    InputComponent: FechaFilterInput,
  },
  {
    label: '<=',
    value: '<=',
    getApplyFilterFn: applyFilterFecha,
    InputComponent: FechaFilterInput,
  },
  {
    label: '>',
    value: '>',
    getApplyFilterFn: applyFilterFecha,
    InputComponent: FechaFilterInput,
  },
  {
    label: '>=',
    value: '>=',
    getApplyFilterFn: applyFilterFecha,
    InputComponent: FechaFilterInput,
  },
];

export { FechaEditInputCell, fechaOperators };

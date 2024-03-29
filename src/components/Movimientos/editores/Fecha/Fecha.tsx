import { obtenerDiasEnElMes } from '@/lib/helpers';
import { TextField } from '@mui/material';
import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { useState } from 'react';

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

export const FechaEditInputCell = (props: GridRenderCellParams<any, Date>) => {
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

  const handleTabPressed = () => {
    console.log('changing focus');
    apiRef.current.setCellFocus(id, 'concepto');
  };

  return <Fecha diasDelMes={diasEnMes} onChange={handleChange} initialValue={dia} onTabPressed={handleTabPressed} />;
};

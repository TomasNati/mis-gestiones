import React, { useState, ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import Mexp from 'math-expression-evaluator';
import { GridColDef, GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { GastoEstimadoItemDelMes } from '@/lib/definitions';

const mexp = new Mexp();

interface NumberInputProps {
  onBlur: (value?: number) => void;
  valorInicial?: string;
}

const NumberInput = ({ onBlur, valorInicial }: NumberInputProps) => {
  const [inputValue, setInputValue] = useState<string>(valorInicial || '');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  const handleBlur = () => {
    onBlur(inputValue ? parseFloat(inputValue) : undefined);
  };

  return (
    <TextField value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} onKeyDown={handleOnKeyDown} />
  );
};

const GastoEstimadoEditInputCell = (props: GridRenderCellParams<GastoEstimadoItemDelMes, GastoEstimadoItemDelMes>) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (newValue?: number) => {
    const newCellValue = { ...value, estimado: newValue, modificado: true };
    apiRef.current.setEditCellValue({ id, field, value: newCellValue });
  };

  return <NumberInput valorInicial={value?.estimado?.toString()} onBlur={handleChange} />;
};

const renderGastoEstimadoEditInputCell: GridColDef['renderCell'] = (params) => {
  return <GastoEstimadoEditInputCell {...params} />;
};

export { renderGastoEstimadoEditInputCell };

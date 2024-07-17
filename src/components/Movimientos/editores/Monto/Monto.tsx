import React, { useState, ChangeEvent } from 'react';
import { TextField, Tooltip } from '@mui/material';
import Mexp from 'math-expression-evaluator';
import { GridColDef, GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';

const mexp = new Mexp();

interface NumberInputProps {
  onBlur: (value?: number) => void;
  valorInicial?: string;
}

const NumberInput = ({ onBlur, valorInicial }: NumberInputProps) => {
  const [inputValue, setInputValue] = useState<string>(valorInicial || '');
  const [formulaValue, setFormulaValue] = useState<string>(valorInicial || '');
  const [previousInputValue, setPreviousInputValue] = useState<string>(valorInicial || '');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const valueToEval = event.target.value.startsWith('=') ? event.target.value.slice(1) : event.target.value;
    try {
      const result = mexp.eval(valueToEval); // Evaluate the expression
      if (!isNaN(result)) {
        setFormulaValue(result.toString()); // Update input value with result
      }
    } catch (error) {
      setFormulaValue(''); // Display error if evaluation fails
    }
    setInputValue(event.target.value);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  const handleBlur = () => {
    setPreviousInputValue(inputValue);
    setInputValue(formulaValue || '');
    onBlur(formulaValue ? parseFloat(formulaValue) : undefined);
  };

  const handleFocus = () => {
    setInputValue(previousInputValue);
  };

  // return formulaValue ? (
  //   <Tooltip title={formulaValue} arrow>
  //     <TextField label="Enter formula" value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} />
  //   </Tooltip>
  // ) : (
  //   <TextField label="Enter formula" value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} />
  // );

  return (
    <TextField
      value={inputValue}
      onChange={handleChange}
      onBlur={() => handleBlur()}
      onFocus={handleFocus}
      onKeyDown={handleOnKeyDown}
    />
  );
};

const MontoEditInputCell = (props: GridRenderCellParams<any, number>) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (newValue?: number) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return <NumberInput valorInicial={value?.toString()} onBlur={handleChange} />;
};

const renderMontoEditInputCell: GridColDef['renderCell'] = (params) => {
  return <MontoEditInputCell {...params} />;
};

export { renderMontoEditInputCell };

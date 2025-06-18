import React, { useState, ChangeEvent, useEffect } from 'react';
import { TextField, Tooltip } from '@mui/material';
import Mexp from 'math-expression-evaluator';
import { GridColDef, GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { MontoTooltip } from './MontoTooltip';

const mexp = new Mexp();

interface NumberInputProps {
  onBlur: (value?: number) => void;
  disabled?: boolean;
  valorInicial?: string;
  label?: string;
  size?: 'small' | 'medium';
}

const NumberInput = ({ onBlur, valorInicial, label, size, disabled }: NumberInputProps) => {
  const [inputValue, setInputValue] = useState<string>(valorInicial || '');
  const [formulaValue, setFormulaValue] = useState<string>(valorInicial || '');
  const [previousInputValue, setPreviousInputValue] = useState<string>(valorInicial || '');

  useEffect(() => {
    setInputValue(valorInicial || '');
    setFormulaValue(valorInicial || '');
    setPreviousInputValue(valorInicial || '');
  }, [valorInicial]);

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

  // Split tooltip if inputValue starts with '=' using + or - as separators
  const tooltip = inputValue.startsWith('=')
    ? inputValue
        .slice(1)
        .match(/[+-]?[^+-]+/g) // Match each term with its sign
        ?.map((term) => term.trim())
        .join('\n') || ''
    : '';

  return (
    <MontoTooltip tooltip={tooltip} formulaValue={formulaValue}>
      <TextField
        value={inputValue}
        onChange={handleChange}
        onBlur={() => handleBlur()}
        onFocus={handleFocus}
        onKeyDown={handleOnKeyDown}
        label={label}
        size={size}
        disabled={disabled}
      />
    </MontoTooltip>
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

export { renderMontoEditInputCell, NumberInput };

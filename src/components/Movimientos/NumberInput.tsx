import React, { useState, ChangeEvent } from 'react';
import { TextField, Tooltip } from '@mui/material';

const NumberInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [formulaValue, setFormulaValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setInputValue(value);
    if (inputValue.startsWith('=')) {
      try {
        const result = eval(inputValue.slice(1)); // Evaluate the expression
        if (!isNaN(result)) {
          setFormulaValue(result.toString()); // Update input value with result
        }
      } catch (error) {
        setFormulaValue(''); // Display error if evaluation fails
      }
    } else {
      setFormulaValue('');
    }
  };

  const handleBlur = () => {
    if (inputValue.startsWith('=')) {
      try {
        const result = eval(inputValue.slice(1)); // Evaluate the expression
        if (!isNaN(result)) {
          setInputValue(result.toString()); // Update input value with result
        } else {
          setInputValue('');
        }
      } catch (error) {
        setInputValue(''); // Display error if evaluation fails
      }
    }
  };

  return formulaValue ? (
    <Tooltip title={formulaValue} arrow>
      <TextField label="Enter formula" value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} />
    </Tooltip>
  ) : (
    <TextField label="Enter formula" value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} />
  );
};

export default NumberInput;

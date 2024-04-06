import React, { useState, ChangeEvent } from 'react';
import { TextField, Tooltip } from '@mui/material';
import Mexp from 'math-expression-evaluator';

const mexp = new Mexp();

interface NumberInputProps {
  onBlur: (value?: number) => void;
}

const NumberInput = ({ onBlur }: NumberInputProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [formulaValue, setFormulaValue] = useState<string>('');

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

  const handleBlur = () => {
    onBlur(1);
  };
  console.log('Formula value:', formulaValue);

  // return formulaValue ? (
  //   <Tooltip title={formulaValue} arrow>
  //     <TextField label="Enter formula" value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} />
  //   </Tooltip>
  // ) : (
  //   <TextField label="Enter formula" value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} />
  // );

  return <TextField label="Enter formula" value={inputValue} onChange={handleChange} onBlur={() => handleBlur()} />;
};

export default NumberInput;

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import { styled } from '@mui/material/styles';
import PercentIcon from '@mui/icons-material/Percent';

const NumberInput = styled(TextField)({
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
    padding: '3px',
  },
});

interface PercentageTextFieldProps {
  onChange: (valor?: number) => void;
}

const PercentageTextField = ({ onChange }: PercentageTextFieldProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^(?:\d{0,2}(?:\.\d)?)?$/;

    if (regex.test(value) && (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 99.9))) {
      event.target.value = value;
    } else {
      event.target.value = value.slice(0, -1);
    }
    onChange(parseFloat(event.target.value));
  };

  return (
    <NumberInput
      type="number"
      onChange={handleInputChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PercentIcon />
          </InputAdornment>
        ),
        inputProps: {
          min: 0,
          max: 99,
          step: 0.1,
        },
      }}
    />
  );
};

export default PercentageTextField;

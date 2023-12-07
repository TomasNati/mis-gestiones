import { styles } from './Styles';
import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  InputAdornment,
  Grid,
  Typography,
  Box,
} from '@mui/material';

const currencies = [
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
  { value: 'JPY', label: '¥' },
];

const paymentTypes = ['Credit Card', 'Debit Card', 'Cash', 'Other'];

const AgregarMovimiento = () => {
  const [selectedDate, handleDateChange] = useState(new Date());
  const [concepto, setConcepto] = useState('');
  const [tipoDePago, setTipoDePago] = useState('');
  const [amount, setAmount] = useState('');
  const [detalle, setDetalle] = useState('');

  const handleConceptoChange = (event: any, newValue: string | null) => {
    setConcepto(newValue || '');
  };

  const handleTipoDePagoChange = (event: any, newValue: string | null) => {
    setTipoDePago(newValue || '');
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleDetalleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetalle(event.target.value);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({
      selectedDate,
      concepto,
      tipoDePago,
      amount,
      detalle,
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            //margin="normal"
            id="date-picker-dialog"
            label="Día"
            value={selectedDate}
            // onChange={handleDateChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            id="concepto"
            options={['Option 1', 'Option 2', 'Option 3']}
            getOptionLabel={(option) => option}
            value={concepto}
            onChange={handleConceptoChange}
            renderInput={(params) => <TextField {...params} label="Concepto" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            id="tipo-de-pago"
            options={['Option 1', 'Option 2', 'Option 3']}
            getOptionLabel={(option) => option}
            value={tipoDePago}
            onChange={handleTipoDePagoChange}
            renderInput={(params) => <TextField {...params} label="Concepto" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Monto"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body1">$</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Detalle"
            id="detalle"
            value={detalle}
            onChange={handleDetalleChange}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export { AgregarMovimiento };

'use client';
import { styles } from './AgregarMovimiento.styles';
import React, { useEffect, useState } from 'react';
import {
  TextField,
  Autocomplete,
  InputAdornment,
  Typography,
  Box,
  Button,
} from '@mui/material';

import { crearMovimiento } from '@/lib/actions';
import { obtenerSubCategorias } from '@/lib/data';
import { Subcategoria, TipoDeMovimientoGasto } from '@/lib/definitions';

type ValorLista = {
  id: string;
  label: string;
};

const AgregarMovimiento = () => {
  const [fecha, setFecha] = useState<Date | string>(
    new Date().toISOString().split('T')[0],
  );
  const [concepto, setConcepto] = useState<Subcategoria | null>(null);
  const [tipoDePago, setTipoDePago] = useState<ValorLista | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [detalle, setDetalle] = useState('');
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);

  useEffect(() => {
    const fetchConceptos = async () => {
      const subcategorias = await obtenerSubCategorias();
      //sort subcategorias by categoria
      subcategorias.sort((a, b) => {
        if (a.categoria.nombre < b.categoria.nombre) {
          return -1;
        }
        if (a.categoria.nombre > b.categoria.nombre) {
          return 1;
        }
        return 0;
      });
      setSubcategorias(subcategorias);
    };
    fetchConceptos();
  }, []);

  const tipoDeMovimientoGastoArray: ValorLista[] = Object.keys(TipoDeMovimientoGasto).map(
    (key) => ({
      id: key,
      label: TipoDeMovimientoGasto[key as keyof typeof TipoDeMovimientoGasto],
    }),
  );

  const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(event.target.value);
  };
  const handleConceptoChange = (_: any, newValue: Subcategoria | null) => {
    setConcepto(newValue);
  };

  const handleTipoDePagoChange = (_: any, newValue: ValorLista | null) => {
    setTipoDePago(newValue);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(event.target.value);

    // Check if the input is a positive number
    if (!isNaN(inputValue) && inputValue >= 0) {
      setMonto(inputValue);
    } else {
      setMonto(0);
    }
  };

  const handleDetalleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetalle(event.target.value);
  };

  // const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData();

  //   // Append custom values to the FormData
  //   formData.append('fecha', fecha);
  //   formData.append('concepto', concepto?.id || '');
  //   formData.append('tipoDePago', tipoDePago);
  //   formData.append('amount', amount);
  //   formData.append('detalle', detalle);

  //   await crearMovimiento(formData);
  // };

  return (
    <Box>
      <Box sx={styles.movimiento}>
        <TextField
          className="input-fecha"
          id="fecha"
          name="fecha"
          type="date"
          value={fecha}
          onChange={handleFechaChange}
        />
        <Autocomplete
          id="concepto"
          className="input-concepto"
          options={subcategorias}
          groupBy={(option: Subcategoria) => option.categoria.nombre}
          getOptionLabel={(option: Subcategoria) => option.nombre}
          value={concepto}
          onChange={handleConceptoChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <Autocomplete
          id="tipoDePago"
          className="input-tipo-de-pago"
          options={tipoDeMovimientoGastoArray}
          getOptionLabel={(option) => option.label}
          value={tipoDePago}
          onChange={handleTipoDePagoChange}
          renderInput={(params) => <TextField {...params} name="tipoDePago" />}
        />
        <TextField
          id="monto"
          name="monto"
          className="input-monto"
          value={monto}
          type="number"
          inputProps={{ min: '0', step: '0.01' }}
          onChange={handleAmountChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body1">$</Typography>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="detalle"
          name="detalle"
          className="input-detalle"
          value={detalle}
          onChange={handleDetalleChange}
        />
      </Box>
    </Box>
  );
};

const AgregarMovimientos = () => {
  return (
    <Box sx={styles.container}>
      <AgregarMovimiento />
      <AgregarMovimiento />
      <AgregarMovimiento />
      <AgregarMovimiento />
      <AgregarMovimiento />
      <Button variant="contained" color="primary">
        Agregar
      </Button>
    </Box>
  );
};

export { AgregarMovimientos };

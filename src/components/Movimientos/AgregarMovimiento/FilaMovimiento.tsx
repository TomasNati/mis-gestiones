import { obtenerSubCategorias } from '@/lib/data';
import { TipoDeMovimientoGasto, Subcategoria } from '@/lib/definitions';
import { Delete } from '@mui/icons-material';
import {
  Box,
  TextField,
  Autocomplete,
  InputAdornment,
  Typography,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { styles } from './FilaMovimiento.styles';
import { styles as agregarStyles } from './AgregarMovimiento.styles';

type ValorLista = {
  id: string;
  label: string;
};

const tipoDeMovimientoGastoArray: ValorLista[] = Object.keys(TipoDeMovimientoGasto).map(
  (key) => ({
    id: key,
    label: TipoDeMovimientoGasto[key as keyof typeof TipoDeMovimientoGasto],
  }),
);

const tipoDeMovimientoGastoDefault =
  tipoDeMovimientoGastoArray.find((mov) => mov.label == TipoDeMovimientoGasto.Debito) ||
  null;

const FilaMovimiento = ({
  id,
  eliminarFila,
  subcategorias,
}: {
  id: number;
  eliminarFila: (id: number) => void;
  subcategorias: Subcategoria[];
}) => {
  const [fecha, setFecha] = useState<Date | string>(
    new Date().toISOString().split('T')[0],
  );
  const [concepto, setConcepto] = useState<Subcategoria | null>(null);
  const [tipoDePago, setTipoDePago] = useState<ValorLista | null>(
    tipoDeMovimientoGastoDefault,
  );
  const [monto, setMonto] = useState<number>(0);
  const [detalle, setDetalle] = useState('');

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
      <IconButton
        color="secondary"
        onClick={() => eliminarFila(id)}
        sx={agregarStyles.iconButton}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export { FilaMovimiento };

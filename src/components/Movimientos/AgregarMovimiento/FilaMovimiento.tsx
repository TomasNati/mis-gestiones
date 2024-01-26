import { TipoDeMovimientoGasto, CategoriaUIMovimiento, MovimientoUI } from '@/lib/definitions';
import { Delete, Error, Check } from '@mui/icons-material';
import { Box, TextField, Autocomplete, InputAdornment, Typography, IconButton } from '@mui/material';
import { useState } from 'react';
import { styles } from './FilaMovimiento.styles';
import { styles as agregarStyles } from './AgregarMovimiento.styles';
import { addTimeToDateString } from '@/lib/helpers';

type ValorLista = {
  id: string;
  label: string;
};

const tipoDeMovimientoGastoArray: ValorLista[] = Object.keys(TipoDeMovimientoGasto).map((key) => ({
  id: key,
  label: TipoDeMovimientoGasto[key as keyof typeof TipoDeMovimientoGasto],
}));

const FilaMovimiento = ({
  movimientoVacio,
  eliminarFila,
  categoriasMovimiento,
  filaActualizada,
}: {
  movimientoVacio: MovimientoUI;
  eliminarFila: (id: number) => void;
  categoriasMovimiento: CategoriaUIMovimiento[];
  filaActualizada: (movimiento: MovimientoUI) => void;
}) => {
  const [fecha, setFecha] = useState<Date | string>(movimientoVacio.fecha.toISOString().split('T')[0]);
  const [concepto, setConcepto] = useState<CategoriaUIMovimiento | null>(null);
  const [tipoDePago, setTipoDePago] = useState<ValorLista | null>(null);
  const [monto, setMonto] = useState<number | null>(null);
  const [detalle, setDetalle] = useState('');
  const [movimiento, setMovimiento] = useState<MovimientoUI>(movimientoVacio);

  const actualizarMovimiento = (nuevoMovimiento: MovimientoUI, actualizarFila: boolean = true) => {
    const { fecha, subcategoriaId, tipoDeGasto, monto } = nuevoMovimiento;
    nuevoMovimiento.valido = fecha && !!subcategoriaId && tipoDeGasto != null && monto > 0.01;
    setMovimiento(nuevoMovimiento);
    if (actualizarFila) filaActualizada(nuevoMovimiento);
  };

  const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(event.target.value);
    actualizarMovimiento({ ...movimiento, fecha: new Date(addTimeToDateString(event.target.value)) });
  };
  const handleConceptoChange = (_: any, newValue: CategoriaUIMovimiento | null) => {
    setConcepto(newValue);
    actualizarMovimiento({
      ...movimiento,
      subcategoriaId: newValue?.subcategoriaId || '',
      detalleSubcategoriaId: newValue?.detalleSubcategoriaId || '',
    });
  };

  const handleTipoDePagoChange = (_: any, newValue: ValorLista | null) => {
    setTipoDePago(newValue);
    actualizarMovimiento({ ...movimiento, tipoDeGasto: newValue?.id as TipoDeMovimientoGasto });
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(event.target.value);
    const nuevoMonto = !isNaN(inputValue) && inputValue >= 0 ? inputValue : null;
    setMonto(nuevoMonto);
    actualizarMovimiento({ ...movimiento, monto: nuevoMonto || 0 }, false);
  };

  const handleDetalleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetalle(event.target.value);
    actualizarMovimiento({ ...movimiento, comentarios: event.target.value }, false);
  };

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
        options={categoriasMovimiento}
        groupBy={(option: CategoriaUIMovimiento) => option.categoriaNombre}
        getOptionLabel={(option: CategoriaUIMovimiento) => option.nombre}
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
        value={monto || ''}
        type="number"
        inputProps={{ min: '0', step: '0.01' }}
        onBlur={() => filaActualizada(movimiento)}
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
        onBlur={() => filaActualizada(movimiento)}
      />
      {movimiento.valido ? <Check color="success" /> : <Error color="error" />}
      <IconButton color="secondary" onClick={() => eliminarFila(movimiento.filaId)} sx={agregarStyles.iconButton}>
        <Delete />
      </IconButton>
    </Box>
  );
};

export { FilaMovimiento };

import { TipoDeMovimientoGasto, CategoriaUIMovimiento, MovimientoUI } from '@/lib/definitions';
import { Delete, Error, Check } from '@mui/icons-material';
import { Box, TextField, Autocomplete, InputAdornment, Typography, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { styles } from './FilaMovimiento.styles';
import { styles as agregarStyles } from './AgregarMovimiento.styles';
import { set } from 'zod';

type ValorLista = {
  id: string;
  label: string;
};

const tipoDeMovimientoGastoArray: ValorLista[] = Object.keys(TipoDeMovimientoGasto).map((key) => ({
  id: key,
  label: TipoDeMovimientoGasto[key as keyof typeof TipoDeMovimientoGasto],
}));

const tipoDeMovimientoGastoDefault =
  tipoDeMovimientoGastoArray.find((mov) => mov.label == TipoDeMovimientoGasto.Debito) || null;

const movimientoVacio: MovimientoUI = {
  fecha: new Date(),
  tipoDeGasto: TipoDeMovimientoGasto.Debito,
  monto: 0,
  subcategoriaId: '',
  valido: false,
  filaId: 0,
};

const FilaMovimiento = ({
  id,
  eliminarFila,
  categoriasMovimiento,
  filaActualizada,
}: {
  id: number;
  eliminarFila: (id: number) => void;
  categoriasMovimiento: CategoriaUIMovimiento[];
  filaActualizada: (movimiento: MovimientoUI) => void;
}) => {
  const [fecha, setFecha] = useState<Date | string>(new Date().toISOString().split('T')[0]);
  const [concepto, setConcepto] = useState<CategoriaUIMovimiento | null>(null);
  const [tipoDePago, setTipoDePago] = useState<ValorLista | null>(tipoDeMovimientoGastoDefault);
  const [monto, setMonto] = useState<number | null>(null);
  const [detalle, setDetalle] = useState('');
  const [filaInvalida, setFilaInvalida] = useState(false);
  const [movimiento, setMovimiento] = useState<MovimientoUI>({ ...movimientoVacio, filaId: id });

  useEffect(() => {
    const movimientoValido = fecha != '' && concepto != null && tipoDePago != null && monto != null && monto > 0.01;
    setFilaInvalida(!movimientoValido);
    const nuevoMovimiento = {
      ...movimiento,
      valido: movimientoValido,
      fecha: new Date(fecha),
      subcategoriaId: concepto?.subcategoriaId || '',
      detalleSubcategoriaId: concepto?.detalleSubcategoriaId || '',
      tipoDeGasto: (tipoDePago?.id as TipoDeMovimientoGasto) || TipoDeMovimientoGasto.Debito,
      monto: monto || 0,
      comentarios: detalle,
    };
    setMovimiento(nuevoMovimiento);
    filaActualizada(nuevoMovimiento);
  }, [fecha, concepto, tipoDePago, monto, detalle]);

  const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(event.target.value);
    setMovimiento({ ...movimiento, fecha: new Date(event.target.value) });
  };
  const handleConceptoChange = (_: any, newValue: CategoriaUIMovimiento | null) => {
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
      setMonto(null);
    }
  };

  const handleDetalleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetalle(event.target.value);
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
      <TextField id="detalle" name="detalle" className="input-detalle" value={detalle} onChange={handleDetalleChange} />
      {filaInvalida ? <Error color="error" /> : <Check color="success" />}
      <IconButton color="secondary" onClick={() => eliminarFila(id)} sx={agregarStyles.iconButton}>
        <Delete />
      </IconButton>
    </Box>
  );
};

export { FilaMovimiento };

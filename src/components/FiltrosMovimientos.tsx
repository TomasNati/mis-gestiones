import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  FormControlLabel,
  Checkbox,
  FormControl,
  IconButton,
  Grid2,
  Autocomplete,
  TextField,
  Box,
  Button,
} from '@mui/material';
import { styles } from './FiltrosMovimientos.styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { BuscarVencimientosPayload, Subcategoria, Categoria, TipoDeMovimientoGasto } from '@/lib/definitions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type FiltersTypes = dayjs.Dayjs | Subcategoria[] | Categoria[] | boolean | number | string | null | string[];

export const FILTERS_DEFAULT: Filters = {
  desde: dayjs().startOf('month'),
  hasta: dayjs().endOf('month').startOf('day'),
  categorias: null,
  subcategorias: null,
  tiposDePago: null,
  montoMinimo: null,
  montoMaximo: null,
  detalle: null,
};

interface Filters {
  desde: dayjs.Dayjs | null;
  hasta: dayjs.Dayjs | null;
  categorias: Categoria[] | null;
  subcategorias: Subcategoria[] | null;
  tiposDePago: string[] | null;
  montoMinimo: number | null;
  montoMaximo: number | null;
  detalle: string | null;
 
  [index: string]: FiltersTypes;
}

interface FiltrosMovimientosProps {
  subcategorias: Subcategoria[];
  categorias: Categoria[];
  onBuscar: (payload: BuscarVencimientosPayload) => void;
}

const FiltrosMovimientos = ({ subcategorias, categorias, onBuscar }: FiltrosMovimientosProps) => {
  const [filters, setFilters] = useState<Filters>({ ...FILTERS_DEFAULT });

  const tiposDePago = [TipoDeMovimientoGasto.Efectivo, TipoDeMovimientoGasto.Credito, TipoDeMovimientoGasto.Debito];

  const handleChange = (field: string, value: FiltersTypes) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubcategoriasChange = (value: Subcategoria[]) => {
    setFilters((prev) => ({ ...prev, subcategorias: value }));
  };

  const handleCategoriasChange = (value: Categoria[]) => {
    setFilters((prev) => ({ ...prev, categorias: value }));
  };

  const buscarVencimientos = () => {
    const payload = {
      ...filters,
      categorias: filters.categorias?.map(({ id }) => id) || null,
      subcategorias: filters.subcategorias?.map(({ id }) => id) || null,
      tiposDePago: filters.tiposDePago,
      montoMinimo: filters.montoMinimo,
      montoMaximo: filters.montoMaximo,
      detalle: filters.detalle,
      desde: filters.desde ? filters.desde.toDate() : null,
      hasta: filters.hasta ? filters.hasta.toDate() : null,
    };
    console.log('Buscar movimientos con payload:', payload);

   // onBuscar(payload);
  };

  return (
    <Grid2 container spacing={2} sx={styles.container}>
      <DatePicker
        label="Desde"
        value={filters.desde}
        onChange={(value) => handleChange('desde', value)}
        maxDate={filters.hasta || undefined}
        sx={styles.datePicker}
      />
      <DatePicker
        label="Hasta"
        value={filters.hasta}
        onChange={(value) => handleChange('hasta', value)}
        minDate={filters.desde || undefined}
        sx={styles.datePicker}
      />
      <FormControl sx={styles.dropdown}>
        <Autocomplete
          options={categorias}
          getOptionLabel={(option: Categoria) => option.nombre}
          getOptionKey={(option: Categoria) => option.id}
          value={filters.categorias || []}
          multiple
          disableCloseOnSelect
          filterSelectedOptions
          renderInput={(params) => <TextField {...params} label="Categorías" />}
          onChange={(_, value) => handleCategoriasChange(value)}
          size="small"
        />
      </FormControl>
      <FormControl sx={styles.dropdown}>
        <Autocomplete
          options={subcategorias}
          getOptionLabel={(option: Subcategoria) => option.nombre}
          getOptionKey={(option: Subcategoria) => option.id}
          value={filters.subcategorias || []}
          multiple
          disableCloseOnSelect
          filterSelectedOptions
          renderInput={(params) => <TextField {...params} label="Subcategorías" />}
          onChange={(_, value) => handleSubcategoriasChange(value)}
          size="small"
        />
      </FormControl>
      <FormControl sx={styles.dropdownSmall}>
        <Autocomplete
          options={tiposDePago}
          getOptionLabel={(option: string) => option}
          value={filters.tiposDePago || []}
          multiple
          filterSelectedOptions
          disableCloseOnSelect
          renderInput={(params) => <TextField {...params} label="Tipos de Pago" />}
          onChange={(_, value) => handleChange('tiposDePago', value)}
          size="small"
        />
      </FormControl>
      <FormControl sx={styles.moneyInput}>
        <TextField
          label="Monto Mínimo"
          type="number"
          value={filters.montoMinimo || ''}
          onChange={(e) => handleChange('montoMinimo', e.target.value ? parseFloat(e.target.value) : null)}
          size="small"
          slotProps={{
            input: {
              startAdornment: <span style={{ paddingRight: '5px' }}>$</span>,
            },
          }}
        />
      </FormControl>
      <FormControl sx={styles.moneyInput}>
        <TextField
          label="Monto Máximo"
          type="number"
          value={filters.montoMaximo || ''}
          onChange={(e) => handleChange('montoMaximo', e.target.value ? parseFloat(e.target.value) : null)}
          size="small"
          slotProps={{
        input: {
          startAdornment: <span style={{ paddingRight: '5px' }}>$</span>,
        },
          }}
          sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'primary.main',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'primary.main',
        },
        '& .Mui-focused .MuiInputLabel-root': {
          color: 'primary.main',
        },
          }}
        />
      </FormControl>
      <FormControl sx={styles.dropdown}>
        <TextField
          label="Detalle"
          type="text"
          value={filters.detalle || ''}
          onChange={(e) => handleChange('detalle', e.target.value || null)}
          size="small"
        />
      </FormControl>
      <IconButton size="large" color="primary" onClick={buscarVencimientos}>
        <SearchOutlinedIcon />
      </IconButton>
    </Grid2>
  );
};

export { FiltrosMovimientos };

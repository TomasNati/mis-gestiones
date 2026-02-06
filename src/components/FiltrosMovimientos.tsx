import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FormControl, IconButton, Grid2, Autocomplete, TextField, Chip } from '@mui/material';
import { styles } from './FiltrosMovimientos.styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  BuscarVencimientosPayload,
  Subcategoria,
  Categoria,
  TipoDeMovimientoGasto,
  CategoriaUIMovimiento,
} from '@/lib/definitions';

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
  subcategorias: CategoriaUIMovimiento[] | null;
  tiposDePago: string[] | null;
  montoMinimo: number | null;
  montoMaximo: number | null;
  detalle: string | null;

  [index: string]: FiltersTypes;
}

interface FiltrosMovimientosProps {
  subcategorias: CategoriaUIMovimiento[];
  categorias: Categoria[];
  onBuscar: () => void;
}

const FiltrosMovimientos = ({ subcategorias, categorias, onBuscar }: FiltrosMovimientosProps) => {
  const [filters, setFilters] = useState<Filters>({ ...FILTERS_DEFAULT });
  const [filteredSubcategorias, setFilteredSubcategorias] = useState<CategoriaUIMovimiento[]>(subcategorias);

  useEffect(() => {
    setFilteredSubcategorias(subcategorias);
  }, [subcategorias]);

  const tiposDePago = [TipoDeMovimientoGasto.Efectivo, TipoDeMovimientoGasto.Credito, TipoDeMovimientoGasto.Debito];

  const handleChange = (field: string, value: FiltersTypes) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubcategoriasChange = (value: CategoriaUIMovimiento[]) => {
    setFilters((prev) => ({ ...prev, subcategorias: value }));
  };

  const handleCategoriasChange = (value: Categoria[]) => {
    let updatedSelectedSubcategorias: CategoriaUIMovimiento[] = filters.subcategorias || [];

    if (value.length > 0) {
      const newFilteredSubcategorias = subcategorias.filter((subcat) =>
        value.some((cat) => cat.id === subcat.categoriaId),
      );

      updatedSelectedSubcategorias = (filters.subcategorias || []).filter((subcat) =>
        newFilteredSubcategorias.some((newSubcat) => newSubcat.id === subcat.id),
      );

      setFilteredSubcategorias(newFilteredSubcategorias);
    }

    setFilters((prev) => ({ ...prev, categorias: value, subcategorias: updatedSelectedSubcategorias }));
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

    onBuscar();
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
          options={filteredSubcategorias}
          groupBy={(option: CategoriaUIMovimiento) => option.categoriaNombre}
          getOptionLabel={(option: CategoriaUIMovimiento) => option.nombre}
          getOptionKey={(option: CategoriaUIMovimiento) => option.id}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={`(${option.categoriaNombre}) ${option.nombre}`}
                {...getTagProps({ index })}
                key={option.id}
              />
            ))
          }
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

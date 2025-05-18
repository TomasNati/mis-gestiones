import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Grid2,
} from '@mui/material';
import { styles } from './Filtros.styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { BuscarVencimientosPayload } from '@/lib/definitions';
import { toUTC } from '@/lib/helpers';

type FiltersTypes = dayjs.Dayjs | string | boolean | null;

interface Filters {
  desde: dayjs.Dayjs | null;
  hasta: dayjs.Dayjs | null;
  concepto: string | null;
  esAnual: boolean | null;
  estricto: boolean | null;
  pagado: boolean | null;
  [index: string]: FiltersTypes;
}

const FilterComponent = () => {
  const [filters, setFilters] = useState<Filters>({
    desde: dayjs().startOf('month'),
    hasta: dayjs().endOf('month'),
    concepto: '',
    esAnual: false,
    estricto: false,
    pagado: false,
  });

  const handleChange = (field: string, value: FiltersTypes) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const buscarVencimientos = () => {
    const payload: BuscarVencimientosPayload = {
      ...filters,
      desde: filters.desde ? toUTC(filters.desde.toDate()) : null,
      hasta: filters.hasta ? toUTC(filters.hasta.toDate()) : null,
    };

    console.log(payload);
  };

  return (
    <Grid2 container spacing={2}>
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

      <FormControl size="small" sx={styles.concepto}>
        <InputLabel>Concepto</InputLabel>
        <Select value={filters.concepto} label="Concepto" onChange={(e) => handleChange('concepto', e.target.value)}>
          <MenuItem value="val1">Val1</MenuItem>
          <MenuItem value="val2">Val2</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.esAnual === null ? undefined : filters.esAnual}
            onChange={(e) => handleChange('esAnual', e.target.checked)}
          />
        }
        label="Es Anual"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.estricto === null ? undefined : filters.estricto}
            onChange={(e) => handleChange('estricto', e.target.checked)}
          />
        }
        label="Estricto"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.pagado === null ? undefined : filters.pagado}
            onChange={(e) => handleChange('pagado', e.target.checked)}
          />
        }
        label="Pagado"
      />
      <IconButton size="large" color="primary" onClick={buscarVencimientos}>
        <SearchOutlinedIcon />
      </IconButton>
    </Grid2>
  );
};

export { FilterComponent };

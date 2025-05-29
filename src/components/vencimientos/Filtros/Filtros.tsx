import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FormControlLabel, Checkbox, FormControl, IconButton, Grid2, Autocomplete, TextField } from '@mui/material';
import { styles } from './Filtros.styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { BuscarVencimientosPayload, Subcategoria } from '@/lib/definitions';
import { toUTC } from '@/lib/helpers';

type FiltersTypes = dayjs.Dayjs | Subcategoria[] | boolean | null;

interface Filters {
  desde: dayjs.Dayjs | null;
  hasta: dayjs.Dayjs | null;
  tipos: Subcategoria[] | null;
  esAnual: boolean | null;
  estricto: boolean | null;
  pagado: boolean | null;
  [index: string]: FiltersTypes;
}

interface FilterComponentProps {
  tiposDeVencimientos: Subcategoria[];
  onBuscar: (payload: BuscarVencimientosPayload) => void;
}

const FilterComponent = ({ tiposDeVencimientos, onBuscar }: FilterComponentProps) => {
  const [tipos, setTipos] = useState<Subcategoria[]>([]);
  const [filters, setFilters] = useState<Filters>({
    desde: dayjs().startOf('month'),
    hasta: dayjs().add(1, 'month').endOf('month'),
    tipos: null,
    esAnual: null,
    estricto: null,
    pagado: null,
  });

  useEffect(() => {
    setTipos(tiposDeVencimientos);
  }, [tiposDeVencimientos]);

  const handleChange = (field: string, value: FiltersTypes) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: boolean) => {
    setFilters((prev) => {
      const newValue = prev[field] === false ? true : prev[field] === true ? null : false;
      return { ...prev, [field]: newValue };
    });
  };

  const handleTiposChange = (value: Subcategoria[]) => {
    setFilters((prev) => ({ ...prev, tipos: value }));
  };

  const buscarVencimientos = () => {
    const payload: BuscarVencimientosPayload = {
      ...filters,
      tipos: filters.tipos?.map(({ id }) => id) || null,
      desde: filters.desde ? toUTC(filters.desde.toDate()) : null,
      hasta: filters.hasta ? toUTC(filters.hasta.toDate()) : null,
    };

    onBuscar(payload);
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

      <FormControl sx={styles.tipo}>
        <Autocomplete
          options={tipos}
          getOptionLabel={(option: Subcategoria) => option.nombre}
          value={filters.tipos || []}
          multiple
          filterSelectedOptions
          renderInput={(params) => <TextField {...params} label="Tipo" />}
          onChange={(_, value) => handleTiposChange(value)}
          size="small"
        />
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.esAnual === true}
            indeterminate={filters.esAnual === null}
            onChange={(e) => handleCheckboxChange('esAnual', e.target.checked)}
          />
        }
        label="Es Anual"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.estricto === true}
            indeterminate={filters.estricto === null}
            onChange={(e) => handleCheckboxChange('estricto', e.target.checked)}
          />
        }
        label="Estricto"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.pagado === true}
            indeterminate={filters.pagado === null}
            onChange={(e) => handleCheckboxChange('pagado', e.target.checked)}
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

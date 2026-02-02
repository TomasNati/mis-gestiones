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
import { styles } from './Filtros.styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { BuscarVencimientosPayload, Subcategoria } from '@/lib/definitions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type FiltersTypes = dayjs.Dayjs | Subcategoria[] | boolean | null;

export const FILTERS_DEFAULT: Filters = {
  desde: dayjs().startOf('month'),
  hasta: dayjs().endOf('month').startOf('day'),
  tipos: null,
  esAnual: null,
  pagado: null,
};

interface Filters {
  desde: dayjs.Dayjs | null;
  hasta: dayjs.Dayjs | null;
  tipos: Subcategoria[] | null;
  esAnual: boolean | null;
  pagado: boolean | null;
  [index: string]: FiltersTypes;
}

interface FilterComponentProps {
  tiposDeVencimientos: Subcategoria[];
  onBuscar: (payload: BuscarVencimientosPayload) => void;
}

const FilterComponent = ({ tiposDeVencimientos, onBuscar }: FilterComponentProps) => {
  const [tipos, setTipos] = useState<Subcategoria[]>([]);
  const [filters, setFilters] = useState<Filters>({ ...FILTERS_DEFAULT });

  useEffect(() => {
    setTipos(tiposDeVencimientos);
  }, [tiposDeVencimientos]);

  const handleChange = (field: string, value: FiltersTypes) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string) => {
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
      desde: filters.desde ? filters.desde.toDate() : null,
      hasta: filters.hasta ? filters.hasta.toDate() : null,
    };

    onBuscar(payload);
  };

  const onMoverMesesIzquierda = () => {
    setFilters((prev) => ({
      ...prev,
      desde: prev.desde ? prev.desde.subtract(1, 'month').startOf('month') : null,
      hasta: prev.hasta ? prev.hasta.subtract(1, 'month').endOf('month').startOf('day') : null,
    }));
  };
  const onMoverMesesDerecha = () => {
    setFilters((prev) => ({
      ...prev,
      desde: prev.desde ? prev.desde.add(1, 'month').startOf('month') : null,
      hasta: prev.hasta ? prev.hasta.add(1, 'month').endOf('month').startOf('day') : null,
    }));
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
      <Box sx={styles.buttonsContainer}>
        <Button variant="outlined" startIcon={<ChevronLeftIcon />} onClick={onMoverMesesIzquierda} />
        <Button variant="outlined" startIcon={<ChevronRightIcon />} onClick={onMoverMesesDerecha} />
      </Box>

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
            onChange={() => handleCheckboxChange('esAnual')}
          />
        }
        label="Es Anual"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.pagado === true}
            indeterminate={filters.pagado === null}
            onChange={() => handleCheckboxChange('pagado')}
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

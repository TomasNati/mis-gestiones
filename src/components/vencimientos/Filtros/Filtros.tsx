import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Grid2 as Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

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

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} justifyItems={'center'}>
        <Grid container alignItems="flex-start">
          {/* Date Filters */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DatePicker
              label="Desde"
              value={filters.desde}
              onChange={(value) => handleChange('desde', value)}
              sx={{
                '& input': {
                  padding: '9px',
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DatePicker
              label="Hasta"
              value={filters.hasta}
              onChange={(value) => handleChange('hasta', value)}
              sx={{
                '& input': {
                  padding: '9px',
                },
              }}
            />
          </Grid>

          {/* Concepto Dropdown */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Concepto</InputLabel>
              <Select
                value={filters.concepto}
                label="Concepto"
                onChange={(e) => handleChange('concepto', e.target.value)}
              >
                <MenuItem value="val1">Val1</MenuItem>
                <MenuItem value="val2">Val2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Checkbox Filters */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.esAnual === null ? undefined : filters.esAnual}
                    onChange={(e) => handleChange('esAnual', e.target.checked)}
                  />
                }
                label="Es Anual"
              />
            </Grid>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.estricto === null ? undefined : filters.estricto}
                    onChange={(e) => handleChange('estricto', e.target.checked)}
                  />
                }
                label="Estricto"
              />
            </Grid>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.pagado === null ? undefined : filters.pagado}
                    onChange={(e) => handleChange('pagado', e.target.checked)}
                  />
                }
                label="Pagado"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export { FilterComponent };

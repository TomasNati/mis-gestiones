'use client';

import { useId, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
} from '@mui/material';
import { styles } from './InversionesFiltros.styles';

export type FacetaInversiones = 'tipo' | 'renta' | 'broker';

export interface FiltrosInversiones {
  tipo: string[];
  renta: string[];
  broker: string[];
  /** Texto libre: filtra por nombre o código de instrumento. */
  busqueda: string;
}

export interface OpcionesFiltrosInversiones {
  tipo: string[];
  renta: string[];
  broker: string[];
}

export const FILTROS_INVERSIONES_DEFAULT: FiltrosInversiones = {
  tipo: [],
  renta: [],
  broker: [],
  busqueda: '',
};

const FACETAS: { key: FacetaInversiones; label: string }[] = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'renta', label: 'Tipo de renta' },
  { key: 'broker', label: 'Broker' },
];

interface InversionesFiltrosProps {
  filtros: FiltrosInversiones;
  opciones: OpcionesFiltrosInversiones;
  onFiltrosChange: (filtros: FiltrosInversiones) => void;
}

/**
 * Segunda toolbar de Inversiones (`.toolbar.filters-bar`): multiselect de tipo,
 * tipo de renta y broker, chips de filtros activos y búsqueda por nombre/código
 * de instrumento. Los filtros afectan solo a la grilla; la tira de stats y los
 * gráficos siguen usando toda la cartera.
 */
export const InversionesFiltros = ({ filtros, opciones, onFiltrosChange }: InversionesFiltrosProps) => {
  const popoverId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const seleccionados = FACETAS.flatMap(({ key }) => filtros[key].map((valor) => ({ facet: key, valor })));
  const hayBusqueda = filtros.busqueda.length > 0;

  const toggleFaceta = (faceta: FacetaInversiones, valor: string) => {
    const actuales = filtros[faceta];
    const siguientes = actuales.includes(valor)
      ? actuales.filter((actual) => actual !== valor)
      : [...actuales, valor];
    onFiltrosChange({ ...filtros, [faceta]: siguientes });
  };

  const quitarFiltro = (faceta: FacetaInversiones, valor: string) => {
    onFiltrosChange({ ...filtros, [faceta]: filtros[faceta].filter((actual) => actual !== valor) });
  };

  const limpiar = () => {
    onFiltrosChange({ ...FILTROS_INVERSIONES_DEFAULT });
    setAnchorEl(null);
  };

  return (
    <Box sx={styles.bar}>
      <Button
        variant="outlined"
        aria-haspopup="dialog"
        aria-expanded={anchorEl !== null}
        aria-controls={anchorEl !== null ? popoverId : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={styles.filtrosButton}
      >
        <FilterAltOutlinedIcon />
        Filtros
        {seleccionados.length > 0 && (
          <Box component="span" sx={styles.countBadge}>
            {seleccionados.length}
          </Box>
        )}
        <ExpandMoreIcon />
      </Button>

      <Popover
        id={popoverId}
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: styles.popover } }}
      >
        <Box sx={styles.popoverHeader}>
          <Box component="span">
            <b>Filtros</b> · seleccioná uno o varios
          </Box>
          <Button size="small" onClick={limpiar} sx={styles.popoverClear}>
            Limpiar
          </Button>
        </Box>

        {FACETAS.map(({ key, label }) => (
          <Box key={key} sx={styles.grupo}>
            <Box sx={styles.grupoTitulo}>{label}</Box>
            <Box sx={styles.opciones}>
              {opciones[key].map((valor) => (
                <FormControlLabel
                  key={valor}
                  control={
                    <Checkbox
                      size="small"
                      checked={filtros[key].includes(valor)}
                      onChange={() => toggleFaceta(key, valor)}
                    />
                  }
                  label={valor}
                  sx={styles.opcion}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Popover>

      <Box sx={styles.chips}>
        {seleccionados.map(({ facet, valor }) => {
          const label = FACETAS.find(({ key }) => key === facet)?.label ?? facet;
          return (
            <Chip
              key={`${facet}|${valor}`}
              size="small"
              label={
                <>
                  <Box component="span" sx={styles.chipFacet}>
                    {label}
                  </Box>
                  {valor}
                </>
              }
              onDelete={() => quitarFiltro(facet, valor)}
              sx={styles.chip}
            />
          );
        })}
      </Box>

      <Box sx={styles.spacer} />

      <TextField
        size="small"
        value={filtros.busqueda}
        onChange={(event) => onFiltrosChange({ ...filtros, busqueda: event.target.value })}
        placeholder="Filtrar instrumento o código…"
        aria-label="Filtrar por nombre o código de instrumento"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
            endAdornment: hayBusqueda ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                  onClick={() => onFiltrosChange({ ...filtros, busqueda: '' })}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={styles.search}
      />
    </Box>
  );
};

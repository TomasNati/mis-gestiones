import React from 'react';
import { Box, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs, { Dayjs } from 'dayjs';
import { EventoSuenio, TipoEventoSuenio } from '@/lib/definitions';

/** Texto de ayuda por tipo de evento, como en el mockup. */
const hintPorTipo: Record<TipoEventoSuenio, string> = {
  Dormido: 'se durmió',
  Despierto: 'se despertó',
};

const estilos = {
  fila: {
    display: 'grid',
    gridTemplateColumns: 'auto 96px auto 1fr',
    gap: '8px',
    alignItems: 'center',
  },
  segmented: {
    height: 'var(--control-h-sm)',
    padding: '2px',
    backgroundColor: 'var(--bg-inset)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius)',
    '&.MuiToggleButtonGroup-root': { gap: 0 },
    '& .MuiToggleButtonGroup-grouped': {
      border: 0,
      margin: 0,
      borderRadius: '4px',
    },
    '& .MuiToggleButton-root': {
      border: 0,
      borderRadius: '4px',
      padding: '0 8px',
      gap: '6px',
      height: '100%',
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 1,
      color: 'var(--text-secondary)',
      '&:hover': { color: 'var(--text-primary)', backgroundColor: 'transparent' },
      '&.Mui-selected': {
        backgroundColor: 'var(--bg-emphasis)',
        color: 'var(--text-primary)',
        '&:hover': { backgroundColor: 'var(--bg-emphasis)' },
      },
    },
  },
  hora: {
    width: '96px',
    '& .MuiOutlinedInput-root': {
      height: 'var(--control-h-sm)',
      borderRadius: 'var(--radius)',
      backgroundColor: 'var(--bg-inset)',
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-soft)' },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-strong)' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--accent-emphasis)',
      borderWidth: '1px',
    },
    '& .MuiInputBase-input': {
      height: 'var(--control-h-sm)',
      padding: '0 8px',
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums',
      fontSize: '13px',
    },
    '& .MuiSvgIcon-root': { fontSize: '16px' },
  },
  borrar: {
    width: '24px',
    height: '24px',
    padding: 0,
    borderRadius: 'var(--radius)',
    color: 'var(--text-tertiary)',
    '&:hover': { color: 'var(--danger)', backgroundColor: 'var(--danger-soft)' },
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
} as const;

interface DormidoDespiertoPickerProps {
  evento: EventoSuenio;
  onEventoChange: (evento: EventoSuenio) => void;
  onDelete: (event: EventoSuenio) => void;
}

const DormidoDespiertoPicker = ({ evento, onEventoChange, onDelete }: DormidoDespiertoPickerProps) => {
  const onHoraChanged = (newValue: Dayjs | null) => {
    if (newValue) {
      onEventoChange({ ...evento, hora: newValue.format('HH:mm') });
    }
  };

  const onTipoChange = (_: React.MouseEvent<HTMLElement>, tipo: TipoEventoSuenio | null) => {
    if (tipo) {
      onEventoChange({ ...evento, tipo });
    }
  };

  return (
    <Box sx={estilos.fila}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={evento.tipo}
        onChange={onTipoChange}
        aria-label="Estado del evento"
        sx={estilos.segmented}
      >
        <ToggleButton value="Dormido">
          <BedtimeOutlinedIcon sx={{ fontSize: '14px' }} /> Dormido
        </ToggleButton>
        <ToggleButton value="Despierto">
          <WbSunnyOutlinedIcon sx={{ fontSize: '14px' }} /> Despierto
        </ToggleButton>
      </ToggleButtonGroup>

      <TimeField
        size="small"
        value={dayjs(evento.hora, 'HH:mm')}
        format="HH:mm"
        onChange={onHoraChanged}
        sx={estilos.hora}
      />

      <IconButton
        onClick={() => onDelete(evento)}
        title="Quitar evento"
        aria-label="Quitar evento"
        sx={estilos.borrar}
      >
        <DeleteIcon sx={{ fontSize: '16px' }} />
      </IconButton>

      <Box component="span" sx={estilos.hint}>
        {hintPorTipo[evento.tipo]}
      </Box>
    </Box>
  );
};

export { DormidoDespiertoPicker };

import AddIcon from '@mui/icons-material/Add';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Box, Button, FormControlLabel, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { ChangeEvent, MouseEvent } from 'react';
import type { Dayjs } from 'dayjs';
import { INSTRUMENTO_MONEDA, InstrumentoMoneda, TIPO_DOLAR, TIPO_DOLAR_LABEL, TipoDolar } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { styles } from './InversionesToolbar.styles';

interface InversionesTopbarActionsProps {
  fecha: Dayjs;
  maxFecha: Dayjs;
  viendoHistorial: boolean;
  guardandoEstado: boolean;
  sobreescribir: boolean;
  mostrandoGraficos: boolean;
  esFechaHabilitada: (dia: Dayjs) => boolean;
  onFechaChange: (nuevaFecha: Dayjs | null) => void;
  onNuevaInversion: () => void;
  onGuardarEstado: () => void;
  onSobreescribirChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onToggleGraficos: () => void;
}

/**
 * Acciones del topbar (`.topbar-actions`): fecha del estado, guardar estado,
 * sobreescribir, gráficos y nueva inversión.
 */
export const InversionesTopbarActions = ({
  fecha,
  maxFecha,
  viendoHistorial,
  guardandoEstado,
  sobreescribir,
  mostrandoGraficos,
  esFechaHabilitada,
  onFechaChange,
  onNuevaInversion,
  onGuardarEstado,
  onSobreescribirChange,
  onToggleGraficos,
}: InversionesTopbarActionsProps) => (
  <Box sx={styles.actions}>
    <DatePicker
      value={fecha}
      onChange={onFechaChange}
      maxDate={maxFecha}
      shouldDisableDate={(dia) => !esFechaHabilitada(dia)}
      format="DD/MM/YYYY"
      slots={{ openPickerIcon: CalendarMonthOutlinedIcon }}
      slotProps={{
        openPickerIcon: { sx: { fontSize: 16 } },
        textField: {
          size: 'small',
          sx: styles.dateField,
          inputProps: {
            'aria-label': 'Fecha del estado',
            title: 'Elegir una fecha pasada abre el estado guardado en modo lectura',
          },
        },
      }}
    />

    <Button
      variant="outlined"
      startIcon={<SaveOutlinedIcon />}
      onClick={onGuardarEstado}
      disabled={guardandoEstado || viendoHistorial}
      sx={styles.neutralButton}
    >
      Guardar estado
    </Button>

    <FormControlLabel
      title="Reemplaza el estado ya guardado para hoy"
      control={
        <Switch size="small" checked={sobreescribir} onChange={onSobreescribirChange} disabled={viendoHistorial} />
      }
      label="Sobreescribir"
      sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '13px', color: 'var(--text-secondary)' } }}
    />

    <Box sx={styles.divider} />

    <Button
      variant="text"
      startIcon={<BarChartOutlinedIcon />}
      aria-pressed={mostrandoGraficos}
      onClick={onToggleGraficos}
      sx={{
        color: mostrandoGraficos ? 'var(--accent)' : 'var(--text-secondary)',
        backgroundColor: mostrandoGraficos ? 'var(--accent-soft)' : 'transparent',
        '&:hover': {
          backgroundColor: mostrandoGraficos ? 'var(--accent-soft)' : 'var(--bg-row-hover)',
        },
      }}
    >
      Gráficos
    </Button>

    <Button variant="contained" startIcon={<AddIcon />} onClick={onNuevaInversion} disabled={viendoHistorial}>
      Nueva inversión
    </Button>
  </Box>
);

export interface TasasDolar {
  oficial: number | null;
  bolsa: number | null;
  contadoconliqui: number | null;
}

interface InversionesCurrencyBarProps {
  moneda: InstrumentoMoneda;
  tipoDolar: TipoDolar;
  tasas: TasasDolar;
  ultimoEstado: string | null;
  onMonedaChange: (event: MouseEvent<HTMLElement>, nuevaMoneda: InstrumentoMoneda | null) => void;
  onTipoDolarChange: (event: MouseEvent<HTMLElement>, nuevoTipoDolar: TipoDolar | null) => void;
}

const formatearDolar = (valor: number | null) => (valor == null ? '—' : `$ ${transformNumberToCurrenty(valor, 0)}`);

/**
 * Barra de moneda (`.toolbar.currency-bar`): moneda y tipo de cambio a la
 * izquierda, cotizaciones y último estado guardado a la derecha.
 */
export const InversionesCurrencyBar = ({
  moneda,
  tipoDolar,
  tasas,
  ultimoEstado,
  onMonedaChange,
  onTipoDolarChange,
}: InversionesCurrencyBarProps) => (
  <Box sx={styles.currencyBar}>
    <ToggleButtonGroup
      exclusive
      size="small"
      value={moneda}
      onChange={onMonedaChange}
      aria-label="Moneda"
      sx={styles.segmented}
    >
      <ToggleButton value={INSTRUMENTO_MONEDA.PESO}>Peso</ToggleButton>
      <ToggleButton value={INSTRUMENTO_MONEDA.DOLAR_BOLSA}>Dólar</ToggleButton>
    </ToggleButtonGroup>

    <ToggleButtonGroup
      exclusive
      size="small"
      value={tipoDolar}
      onChange={onTipoDolarChange}
      aria-label="Tipo de cambio"
      sx={styles.segmented}
    >
      <ToggleButton value={TIPO_DOLAR.OFICIAL}>{TIPO_DOLAR_LABEL[TIPO_DOLAR.OFICIAL]}</ToggleButton>
      <ToggleButton value={TIPO_DOLAR.BOLSA}>{TIPO_DOLAR_LABEL[TIPO_DOLAR.BOLSA]}</ToggleButton>
      <ToggleButton value={TIPO_DOLAR.CCL}>{TIPO_DOLAR_LABEL[TIPO_DOLAR.CCL]}</ToggleButton>
    </ToggleButtonGroup>

    <Box component="span" sx={styles.summary}>
      Dólar oficial{' '}
      <Box component="span" sx={styles.summaryNum}>
        {formatearDolar(tasas.oficial)}
      </Box>
      {' · '}bolsa{' '}
      <Box component="span" sx={styles.summaryNum}>
        {formatearDolar(tasas.bolsa)}
      </Box>
      {' · '}CCL{' '}
      <Box component="span" sx={styles.summaryNum}>
        {formatearDolar(tasas.contadoconliqui)}
      </Box>
    </Box>

    <Box sx={styles.spacer} />

    <Box component="span" sx={styles.summary}>
      <SaveOutlinedIcon sx={{ fontSize: 14 }} />
      Último estado guardado:{' '}
      <Box component="span" sx={styles.summaryNum}>
        {ultimoEstado ?? '—'}
      </Box>
    </Box>
  </Box>
);

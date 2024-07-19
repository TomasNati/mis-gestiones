import { months, years } from '@/lib/definitions';
import { Box, FormControl, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';

interface SeleccionadorPeriodoProps {
  anio?: number;
  setAnio: (anio: number) => void;
  mes?: string;
  meses?: string[];
  setMes?: (mes: string) => void;
  setMeses?: (meses: string[]) => void;
  mesesExclusivos?: boolean;
}
const SeleccionadorPeriodo = ({
  anio,
  setAnio,
  mes,
  meses,
  setMes,
  setMeses,
  mesesExclusivos,
}: SeleccionadorPeriodoProps) => {
  const [mesesElegidos, setMesesElegidos] = useState<string[]>(meses || []);
  const [mesExclusivoElegido, setMesExclusivoElegido] = useState<string | null>(mes || null);

  useEffect(() => {
    setMesExclusivoElegido(mes || null);
    setMesesElegidos(meses || []);
  }, [mes, meses]);

  const onMesElegido = (_: React.MouseEvent<HTMLElement>, mes: string | null) => {
    setMesExclusivoElegido(mes);
    setMes && setMes(mes || '');
  };

  const onMesesElegidos = (_: React.MouseEvent<HTMLElement>, meses: string[]) => {
    setMesesElegidos(meses);
    setMeses && setMeses(meses);
  };

  const mostrarMeses = setMes || setMeses;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '10px',
      }}
    >
      <FormControl sx={{ width: '100px', marginRight: '10px', marginBottom: '5px' }}>
        <Select
          sx={{
            height: '100%',
            '& .MuiSelect-select': {
              padding: '2px 0 2px 4px',
            },
          }}
          value={anio}
          onChange={(e) => setAnio(e.target.value as number)}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {mostrarMeses ? (
        <ToggleButtonGroup
          value={mesesExclusivos ? mesExclusivoElegido : mesesElegidos}
          exclusive={mesesExclusivos}
          onChange={mesesExclusivos ? onMesElegido : onMesesElegidos}
          sx={{ paddingBottom: '5px' }}
        >
          {months.map((month, index) => (
            <ToggleButton key={index} value={month} aria-label="left aligned" sx={{ padding: '8px' }}>
              {month}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ) : null}
    </Box>
  );
};

export { SeleccionadorPeriodo };

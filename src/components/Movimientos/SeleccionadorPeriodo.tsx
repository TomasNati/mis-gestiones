import { months, years } from '@/lib/definitions';
import { Box, FormControl, Select, MenuItem, Button } from '@mui/material';

interface SeleccionadorPeriodoProps {
  anio?: number;
  setAnio: (anio: number) => void;
  mes?: string;
  setMes?: (mes: string) => void;
}
const SeleccionadorPeriodo = ({ anio, setAnio, mes, setMes }: SeleccionadorPeriodoProps) => {
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
      {setMes ? (
        <Box>
          {months.map((month, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => setMes(month)}
              color={month === mes ? 'success' : 'secondary'}
              sx={{
                marginRight: 1,
                marginBottom: 2,
                padding: '0 2px',
              }}
            >
              {month}
            </Button>
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

export { SeleccionadorPeriodo };

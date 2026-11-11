'use client';

import { Box, Typography } from '@mui/material';
import { ChartPanel } from '@/components/ui';
import type { DatoGrafico } from '@/hooks/inversiones/useInversiones';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { styles } from './ComposicionInversiones.styles';

const TIPO_INSTRUMENTO_LABEL: Record<string, string> = {
  ACCION_LOCAL: 'Acción local',
  ACCION_INTERNACIONAL: 'Acción internacional',
  BONO: 'Bono',
  CEDEAR: 'CEDEAR',
  CRIPTO: 'Cripto',
  ETF: 'ETF',
  FCI: 'FCI',
  FCI_EXTERIOR: 'FCI exterior',
  ON: 'ON',
};

/** Monto compacto para la tabla (`$ 33,6 M`), como el mockup. */
const formatearCompacto = (valor: number, simbolo: string): string => {
  const abs = Math.abs(valor);
  if (abs >= 1_000_000) {
    return `${simbolo} ${(valor / 1_000_000).toLocaleString('es-AR', { maximumFractionDigits: 1 })} M`;
  }
  if (abs >= 1_000) {
    return `${simbolo} ${(valor / 1_000).toLocaleString('es-AR', { maximumFractionDigits: 0 })} mil`;
  }
  return `${simbolo} ${transformNumberToCurrenty(valor, 0) ?? '-'}`;
};

interface ComposicionInversionesProps {
  datos: DatoGrafico[];
  totalValor: number | null;
  simbolo: string;
}

/**
 * Segundo gráfico de Inversiones: composición por tipo de instrumento.
 * Barras horizontales relativas al tipo más grande, con porcentaje y monto.
 */
export const ComposicionInversiones = ({ datos, totalValor, simbolo }: ComposicionInversionesProps) => {
  const total = datos.reduce((acc, dato) => acc + dato.value, 0);
  const mayor = datos.reduce((acc, dato) => Math.max(acc, dato.value), 0);
  const hint = totalValor == null ? undefined : `${simbolo} ${transformNumberToCurrenty(totalValor, 0) ?? '-'}`;

  return (
    <ChartPanel title="Composición" hint={hint}>
      {datos.length === 0 || total <= 0 ? (
        <Box sx={styles.placeholder}>
          <Typography variant="body2" color="text.secondary">
            Sin datos para mostrar.
          </Typography>
        </Box>
      ) : (
        <Box component="table" sx={styles.table}>
          <Box component="tbody">
            {datos.map((dato) => {
              const pct = Math.round((dato.value / total) * 100);
              const ancho = mayor > 0 ? Math.max((dato.value / mayor) * 100, 1) : 0;
              const label = TIPO_INSTRUMENTO_LABEL[dato.label.trim().toUpperCase()] ?? dato.label;

              return (
                <Box component="tr" key={dato.label} sx={styles.row}>
                  <Box component="td" sx={styles.tipo}>
                    {label}
                  </Box>
                  <Box component="td" sx={styles.barCell}>
                    <Box sx={styles.track} role="img" aria-label={`${label} ${pct} %`}>
                      <Box component="span" sx={{ ...styles.fill, width: `${ancho}%` }} />
                    </Box>
                  </Box>
                  <Box component="td" sx={styles.pct}>
                    {pct} %
                  </Box>
                  <Box component="td" sx={styles.monto}>
                    {formatearCompacto(dato.value, simbolo)}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </ChartPanel>
  );
};

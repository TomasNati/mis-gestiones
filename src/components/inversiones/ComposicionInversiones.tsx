'use client';

import { Box, Typography } from '@mui/material';
import { ChartPanel } from '@/components/ui';
import type { DatoGrafico } from '@/hooks/inversiones/useInversiones';
import { ETIQUETA_RENTA, ETIQUETA_TIPO_INSTRUMENTO } from '@/lib/inversiones/historial';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { styles } from './ComposicionInversiones.styles';

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

interface TablaComposicionProps {
  datos: DatoGrafico[];
  simbolo: string;
  etiquetas?: Record<string, string>;
}

/** Una tabla de barras relativa a su categoría más grande (misma escala visual en las tres). */
const TablaComposicion = ({ datos, simbolo, etiquetas }: TablaComposicionProps) => {
  const total = datos.reduce((acc, dato) => acc + dato.value, 0);
  const mayor = datos.reduce((acc, dato) => Math.max(acc, dato.value), 0);

  if (datos.length === 0 || total <= 0) {
    return (
      <Box sx={styles.placeholder}>
        <Typography variant="body2" color="text.secondary">
          Sin datos para mostrar.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="table" sx={styles.table}>
      <Box component="tbody">
        {datos.map((dato) => {
          const pct = Math.round((dato.value / total) * 100);
          const ancho = mayor > 0 ? Math.max((dato.value / mayor) * 100, 1) : 0;
          const clave = dato.label.trim().toUpperCase();
          const label = etiquetas?.[clave] ?? dato.label;

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
  );
};

interface ComposicionInversionesProps {
  datosPorTipo: DatoGrafico[];
  datosPorRenta: DatoGrafico[];
  datosPorBroker: DatoGrafico[];
  totalValor: number | null;
  simbolo: string;
}

export const ComposicionInversiones = ({
  datosPorTipo,
  datosPorRenta,
  datosPorBroker,
  totalValor,
  simbolo,
}: ComposicionInversionesProps) => {
  const hint = totalValor == null ? undefined : `${simbolo} ${transformNumberToCurrenty(totalValor, 0) ?? '-'}`;

  return (
    <ChartPanel title="Composición" hint={hint}>
      <Box sx={styles.block}>
        <Box sx={styles.blockTitle}>Por tipo de instrumento</Box>
        <TablaComposicion datos={datosPorTipo} simbolo={simbolo} etiquetas={ETIQUETA_TIPO_INSTRUMENTO} />
      </Box>
      <Box sx={styles.block}>
        <Box sx={styles.blockTitle}>Por renta</Box>
        <TablaComposicion datos={datosPorRenta} simbolo={simbolo} etiquetas={ETIQUETA_RENTA} />
      </Box>
      <Box sx={styles.block}>
        <Box sx={styles.blockTitle}>Por broker</Box>
        <TablaComposicion datos={datosPorBroker} simbolo={simbolo} />
      </Box>
    </ChartPanel>
  );
};

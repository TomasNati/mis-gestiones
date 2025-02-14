import { months } from '@/lib/definitions';

export interface AnioConMeses {
  anio: number;
  meses: string[];
}

export const moverFecha = (fecha: Date, meses: number) => {
  const nuevaFecha = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth() + meses, 5));
  return nuevaFecha;
};

export const crearFecha = (anio: number, mes: string) => {
  return new Date(Date.UTC(anio, months.indexOf(mes), 5));
};

export const obtenerMesesPorAnio = (fechaInicial: Date): AnioConMeses[] => {
  const resultado: AnioConMeses[] = [];
  let mesActual = fechaInicial.getMonth();
  let anioActual = fechaInicial.getFullYear();

  let anioInicial: AnioConMeses = {
    anio: anioActual,
    meses: [],
  };

  for (let i = 0; i < 12; i++) {
    anioInicial.meses.push(months[mesActual]);
    mesActual = (mesActual + 1) % 12;

    // If the month is January, switch to the next year
    if (mesActual === 0) {
      resultado.push(anioInicial);
      anioActual++;
      anioInicial = {
        anio: anioActual,
        meses: [],
      };
    }
  }

  // Push the last year's object
  anioInicial.meses.length > 0 && resultado.push(anioInicial);

  return resultado;
};

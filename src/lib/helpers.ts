import { AnioConMeses } from '@/components/comun/seleccionadorPeriodoHelper';
import {
  CategoriaUIMovimiento,
  ConceptoExcelASubcategoria,
  MovimientoGasto,
  TipoDeMovimientoGasto,
  TiposDeConceptoExcel,
  TiposDeServicioExcel,
  months,
  conceptoExcelGastosEstimadosTemplate,
  GastoEstimadoAnualUI,
  GastoEstimadoItemDelMes,
  ImportarSuenioTomiDia,
  AgendaTomiDia,
} from './definitions';

export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
  const timestamp = new Date().toLocaleString();

  switch (level.toLowerCase()) {
    case 'info':
      console.log(`[${timestamp}] \x1b[32m[INFO]\x1b[0m ${message}`);
      break;
    case 'warning':
      console.warn(`[${timestamp}] \x1b[33m[WARNING]\x1b[0m ${message}`);
      break;
    case 'error':
      console.error(`[${timestamp}] \x1b[31m[ERROR]\x1b[0m ${message}`);
      break;
    default:
      console.log(`[${timestamp}] ${message}`);
  }
};

function esBisiesto(year: number): boolean {
  if (year % 4 !== 0) {
    return false;
  } else if (year % 100 !== 0) {
    return true;
  } else if (year % 400 === 0) {
    return true;
  } else {
    return false;
  }
}

export const obtenerDiasEnElMes = (fecha: Date) => {
  const mes = fecha.getMonth();
  const meses = months.map((m) => m.toLowerCase());

  let diasEnElMes = 0;
  const diasEnFebrero = esBisiesto(fecha.getFullYear()) ? 29 : 28;

  switch (meses[mes]) {
    case 'enero':
    case 'marzo':
    case 'mayo':
    case 'julio':
    case 'agosto':
    case 'octubre':
    case 'diciembre':
      diasEnElMes = 31;
      break;
    case 'febrero':
      diasEnElMes = diasEnFebrero;
      break;
    default:
      diasEnElMes = 30;
      break;
  }

  return diasEnElMes;
};

export const formatDate = (
  date: Date,
  showHour: boolean = false,
  customOptions: Intl.DateTimeFormatOptions = {},
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: showHour ? '2-digit' : undefined,
    minute: showHour ? '2-digit' : undefined,
    second: showHour ? '2-digit' : undefined,
    hour12: false,
  };

  const options = { ...defaultOptions, ...customOptions };

  return date.toLocaleString('es-AR', options).replace(/, /, ' ');
};

export const obtenerDiaYDiaDeLaSemana = (fechaUTC: Date): string => {
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };

  const formattedDate = fechaUTC.toLocaleDateString('es-ES', opciones);
  const [weekday, day] = formattedDate.split(' ');

  return `${day} ${weekday}`;
};

export const addTimeToDateString = (date: string) => {
  // Get the current date and time
  const currentDatetime = new Date();

  // Format the time as HH:mm:ss
  const formattedTime = currentDatetime.toTimeString().slice(0, 8);

  // Combine the date and time
  const extendedDateString = `${date} ${formattedTime}`;

  return extendedDateString;
};

export const setDateAsUTC = (fecha: Date): Date => {
  // Get the timezone offset in minutes
  const timezoneOffset = fecha.getTimezoneOffset();
  // Adjust the date by adding the timezone offset
  fecha.setMinutes(fecha.getMinutes() + timezoneOffset);
  // Convert the adjusted date to UTC
  return new Date(fecha.toUTCString());
};

export const toUTC = (original: Date, dateOnly = true): Date => {
  const utcDate = new Date(
    Date.UTC(
      original.getUTCFullYear(),
      original.getUTCMonth(),
      original.getUTCDate(),
      dateOnly ? 0 : original.getUTCHours(),
      dateOnly ? 0 : original.getUTCMinutes(),
      dateOnly ? 0 : original.getUTCSeconds(),
      dateOnly ? 0 : original.getUTCMilliseconds(),
    ),
  );

  return utcDate;
};

/**
 * Converts a time string in the format "HH:MM" to the total number of minutes.
 *
 * @param time - The time string to convert, in the format "HH:MM".
 * @returns The total number of minutes represented by the time string.
 */
export const timeStringToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Converts a given number of minutes into a human-readable time string format.
 *
 * @param minutes - The total number of minutes to be converted.
 * @returns A string representing the time in hours and minutes.
 *
 * @example
 * ```typescript
 * const timeString = minutesToTimeString(125);
 * console.log(timeString); // "2h 5m"
 * ```
 */
export const minutesToTimeString = (minutes: number): string => {
  const durationHours = Math.floor(minutes / 60);
  const durationRemainingMinutes = minutes % 60;
  const durationLabel = `${durationHours > 0 ? `${durationHours}h ` : ''}${
    durationRemainingMinutes > 0 ? `${durationRemainingMinutes}m` : ''
  }`;
  return durationLabel;
};

export const transformCurrencyToNumber = (currencyString: string): number | null => {
  // Remove non-numeric characters except for '.' to handle decimal values
  const numericString = currencyString.replace(/[^0-9.]/g, '');

  // Parse the numeric string to a float
  const numericValue = parseFloat(numericString);

  // Check if the parsing was successful
  if (!isNaN(numericValue)) {
    return numericValue;
  } else {
    return null; // Parsing failed
  }
};

export const transformNumberToCurrenty = (value?: number): string | undefined => {
  return value?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
};

export const generateUUID = (): string => {
  let d = new Date().getTime();

  if (globalThis.window && globalThis.window.performance && typeof globalThis.window.performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
};

export const obtenerTipoDeMovimientoGasto = (tipoDePago: string): TipoDeMovimientoGasto => {
  switch (tipoDePago) {
    case 'Efectivo':
      return TipoDeMovimientoGasto.Efectivo;
    case 'Crédito':
      return TipoDeMovimientoGasto.Credito;
    case 'Débito':
      return TipoDeMovimientoGasto.Debito;
    default:
      return TipoDeMovimientoGasto.Efectivo;
  }
};

export const obtenerCategoriaUIMovimiento = ({
  subcategoria,
  detalleSubcategoria,
}: MovimientoGasto): CategoriaUIMovimiento => {
  const categoriaUIMovimiento: CategoriaUIMovimiento = {
    id: detalleSubcategoria?.id || subcategoria.id,
    nombre: detalleSubcategoria
      ? `(${detalleSubcategoria.subcategoria.nombre}) ${detalleSubcategoria.nombre}`
      : subcategoria.nombre,
    categoriaNombre: subcategoria.categoria.nombre,
    subcategoriaId: subcategoria.id,
    detalleSubcategoriaId: detalleSubcategoria?.id,
  };

  return categoriaUIMovimiento;
};

export const actualizarSubcategoria = (categoriaUI: CategoriaUIMovimiento) => {
  // , movimiento: MovimientoGasto) => {
  if (categoriaUI.detalleSubcategoriaId) {
    //   movimiento.subcategoria =  {
    //     id: categoriaUI.subcategoriaId,
    //     nombre: '', categoria: ''}
    //   movimiento.detalleSubcategoria = categoriaUI.detalleSubcategoriaId;
    // } else {
    //   movimiento.subcategoria = categoriaUI.subcategoriaId;
    //   movimiento.detalleSubcategoria = null;
    // }
  }
};

export const focusOnField = (id: string, field: string, inputSelector: string = 'input') =>
  (document.querySelector(`[data-id="${id}"] [data-field="${field}"] ${inputSelector}`) as HTMLInputElement)?.focus();

export const mapearTiposDeConceptoExcelASubcategorias = (
  tipoDeConcepto: string,
  comentario: string,
): ConceptoExcelASubcategoria => {
  const resultado: {
    subcategoriaId: string;
    detalleSubcategoriaId?: string;
    sinComentarios?: boolean;
  } = {
    subcategoriaId: '',
    detalleSubcategoriaId: undefined,
    sinComentarios: false,
  };

  switch (tipoDeConcepto) {
    case TiposDeConceptoExcel.Taxi:
      resultado.subcategoriaId = '2f98436d-4f72-4bdd-adf9-6c89507e4439';
      break;
    case TiposDeConceptoExcel.Comida:
      resultado.subcategoriaId = '3990f166-fbd5-4227-9480-40064c290689';
      break;
    case TiposDeConceptoExcel.Kiosco:
      resultado.subcategoriaId = '';
      break;
    case TiposDeConceptoExcel.Ropa:
      resultado.subcategoriaId = '3f69985d-ac48-407d-b36d-0c05022697ed';
      break;
    case TiposDeConceptoExcel.TecnologíaHardware:
      resultado.subcategoriaId = '50e1ce59-a52e-4185-a487-acf84a584717';
      break;
    case TiposDeConceptoExcel.Coca:
      resultado.subcategoriaId = 'b2031fc3-be75-4a91-b584-f22436e70a14';
      break;
    case TiposDeConceptoExcel.CosasCasa:
      resultado.subcategoriaId = '314ee9b4-3488-44be-a681-21dfa859a61c';
      break;
    case TiposDeConceptoExcel.Deporte:
      resultado.subcategoriaId = '1ed7e69b-aa38-405d-b4fd-cb87dcfdbde9';
      break;
    case TiposDeConceptoExcel.Doctores:
      resultado.subcategoriaId = 'daafa406-1687-4c56-9d2c-3fe7cd5b8269';
      break;
    case TiposDeConceptoExcel.Emilio:
      resultado.subcategoriaId = 'bb814ac0-ae30-481c-9164-71868798d737';
      break;
    case TiposDeConceptoExcel.Escuela:
      resultado.subcategoriaId = '';
      break;
    case TiposDeConceptoExcel.EscuelaKiosco:
      resultado.subcategoriaId = 'aed07cba-f0e0-4953-9087-f1b7390e5535';
      resultado.detalleSubcategoriaId = '75a61534-9c3c-44dc-a085-a16b2d8866ca';
      break;
    case TiposDeConceptoExcel.LibreParaUsar:
      resultado.subcategoriaId = '';
      break;
    case TiposDeConceptoExcel.Regalos:
      resultado.subcategoriaId = '9ca0e67d-db40-4435-85b0-46cf5d607b6a';
      break;
    case TiposDeConceptoExcel.Otras:
      resultado.subcategoriaId = '40427b72-ded3-44a5-b166-11f03617f7f9';
      break;
    case TiposDeConceptoExcel.Psicologa:
      resultado.subcategoriaId = 'b6e5694b-f329-4464-8b80-e60306f0fb86';
      break;
    case TiposDeConceptoExcel.ProductosPersonales:
      resultado.subcategoriaId = '75eab0ce-6248-402d-96e9-2356e3bbcc96';
      break;
    case TiposDeConceptoExcel.RopaHijos:
      resultado.subcategoriaId = 'fc49d0cb-51ee-4628-a019-40240edadbde';
      break;
    case TiposDeConceptoExcel.ExtrasClaudia:
      resultado.subcategoriaId = 'e8362bf6-66f8-469e-a203-218fd52c9fb6';
      break;
    case TiposDeConceptoExcel.HijosHigiene:
      resultado.subcategoriaId = '9c90e9f1-7262-4f0a-a0ba-e88876b731be';
      break;
    case TiposDeConceptoExcel.Juguetes:
      resultado.subcategoriaId = '9b5875af-913d-4138-b02c-a15c20614a19';
      break;
    case TiposDeConceptoExcel.MedicamentosHijos:
      resultado.subcategoriaId = '0ca9dfa2-7850-4459-b833-6ceb0ff36ac8';
      break;
    case TiposDeConceptoExcel.TransportePublico:
      resultado.subcategoriaId = 'df112432-ff89-4bf0-8b9a-dda0983b4429';
      break;
    case TiposDeConceptoExcel.Mantenimiento:
      resultado.subcategoriaId = '7263dbb5-b54a-4e18-93f4-96ae29396fda';
      break;
    case TiposDeConceptoExcel.Restaurant:
      resultado.subcategoriaId = '668eeba2-9d52-4ed3-a46d-337d539e94f3';
      break;
    case TiposDeConceptoExcel.Farmacia:
      resultado.subcategoriaId = '612c7227-3a3e-43e8-ad67-f45fda448582';
      break;
    case TiposDeConceptoExcel.SueldoClaudia:
      resultado.subcategoriaId = '666a77ac-2035-41bf-a830-f7fd10513d5c';
      break;
    case TiposDeConceptoExcel.Supermercado:
      resultado.subcategoriaId = 'ede87023-cf7a-4375-bad0-1739e31bf470';
      break;
    case TiposDeConceptoExcel.Mejoras:
      resultado.subcategoriaId = '8a962fce-890e-4cc8-8065-6eeb0b7db638';
      break;
    case TiposDeConceptoExcel.Servicios: {
      resultado.sinComentarios = true;

      let comentarioAjustado = comentario;
      if (comentarioAjustado.startsWith('Patente')) {
        comentarioAjustado = 'Patente';
      }
      switch (comentarioAjustado) {
        case TiposDeServicioExcel.AguasDeSantiago:
          resultado.subcategoriaId = '8b326350-cbe9-4633-9bfd-f67ed9a8c638';
          break;
        case TiposDeServicioExcel.Cablevision:
          resultado.subcategoriaId = '2df913d3-c627-4ac6-b6fb-210afa9aa8ea';
          break;
        case TiposDeServicioExcel.Contadora:
          resultado.subcategoriaId = '3351b34b-b8e0-45ce-bea8-acec4fa8e49b';
          break;
        case TiposDeServicioExcel.Personal:
          resultado.subcategoriaId = '2a16dabd-0600-4767-a713-d1bb6ba627fb';
          break;
        case TiposDeServicioExcel.Edese:
          resultado.subcategoriaId = '44d7d98e-8ce8-4a93-868a-2d7bd51f8cdf';
          break;
        case TiposDeServicioExcel.Gasnor:
          resultado.subcategoriaId = '77d6eb72-e3a8-4417-9ce8-ba59123c69f3';
          break;
        case TiposDeServicioExcel.SantiagoInmobiliarioMunicipal:
          resultado.subcategoriaId = '752ae6bf-b486-4033-b92f-ffef9e4a271c';
          break;
        case TiposDeServicioExcel.SantiagoRentasProvincial:
          resultado.subcategoriaId = 'b7c53d13-1af1-4de4-8315-61f47bee318f';
          break;
        case TiposDeServicioExcel.DtoTucCorSAT:
          resultado.subcategoriaId = 'cf9994c2-5a8d-4f30-8797-e6ff9fa2654c';
          break;
        case TiposDeServicioExcel.DtoTucCorGasnor:
          resultado.subcategoriaId = '671e440e-5c4a-4a15-806d-441f38f9b24c';
          break;
        case TiposDeServicioExcel.DtoTucCorEdet:
          resultado.subcategoriaId = 'b66eb6bc-4bc9-49db-bdaa-9d2b79c2e2e0';
          break;
        case TiposDeServicioExcel.DtoTucCorDGR:
          resultado.subcategoriaId = 'd9a99882-cc0e-414a-a89f-a83be92a9559';
          break;
        case TiposDeServicioExcel.DtoTucCorCISI:
          resultado.subcategoriaId = 'dbf160e0-cd11-4dfa-ab1b-dc4d3b59ed61';
          break;
        case TiposDeServicioExcel.DtoTucMarDGR:
          resultado.subcategoriaId = '41c4e23d-55f6-4e9b-ae53-046e5ad1096c';
          break;
        case TiposDeServicioExcel.BahiaABSA:
          resultado.subcategoriaId = '4092d83a-5170-4616-bb47-f00ae27da710';
          break;
        case TiposDeServicioExcel.BahiaMunicipal:
          resultado.subcategoriaId = '15be16e1-fb76-4a13-bdda-2bb589ee8b10';
          break;
        case TiposDeServicioExcel.BahiaARBA:
          resultado.subcategoriaId = '886b95de-5739-4a7f-ab37-4365a751224a';
          break;
        case TiposDeServicioExcel.MonotributoNati:
          resultado.subcategoriaId = '46916604-b612-43fd-bf9c-61d83e178a34';
          break;
        case TiposDeServicioExcel.LawnTennis:
          resultado.subcategoriaId = '6f5f4346-fc38-489e-a4ff-59d0a0c9804b';
          break;
        case TiposDeServicioExcel.TIC:
          resultado.subcategoriaId = '76689e72-971b-4755-8e3c-a2eab25a64f2';
          break;
        case TiposDeServicioExcel.ReadersDigest:
          resultado.subcategoriaId = '3d5cd77d-653c-491d-a944-3b6a33770c90';
          break;
        case TiposDeServicioExcel.HBOMax:
          resultado.subcategoriaId = 'e96cdf6c-1d0b-4fcf-92bd-e7e23df359fa';
          break;
        case TiposDeServicioExcel.Netflix:
          resultado.subcategoriaId = '66911a27-4e5f-445e-b124-c981817265e0';
          break;
        case TiposDeServicioExcel.Spotify:
          resultado.subcategoriaId = 'cd31d1d9-7b6b-485e-b967-583c955927da';
          break;
        case TiposDeServicioExcel.AportesClaudia:
          resultado.subcategoriaId = '4ff1671a-6bfc-4dff-82c0-3e7b88359d3a';
          break;
        case TiposDeServicioExcel.TerapiaOcupacional:
          resultado.subcategoriaId = 'e2079bb3-6264-4e72-a77f-02751847930d';
          break;
        case TiposDeServicioExcel.Auto:
          resultado.subcategoriaId = '495b62c6-921b-4c3f-9ab3-3fde8f9b88e2';
          break;
        case TiposDeServicioExcel.Colegio:
          resultado.subcategoriaId = 'a5618f61-d2f2-4c54-be97-77521e0e905f';
          break;
        case TiposDeServicioExcel.Patente:
          resultado.sinComentarios = false;
          resultado.subcategoriaId = '8d18954a-a5de-40be-8515-5bcca231bb9c';
          break;
      }
      break;
    }
    case TiposDeConceptoExcel.HijosOtros:
      resultado.subcategoriaId = 'ce16188d-8926-4115-9678-f899ab692337';
      break;
    case TiposDeConceptoExcel.EscuelaExtras:
      resultado.subcategoriaId = 'aed07cba-f0e0-4953-9087-f1b7390e5535';
      resultado.detalleSubcategoriaId = '11c84e6b-538b-428a-bc12-3ce3b54656eb';
      break;
    case TiposDeConceptoExcel.CosasParaElAuto:
      resultado.subcategoriaId = '68b2a8e9-4da3-4b2e-9628-0d0eeb629792';
      break;
    case TiposDeConceptoExcel.Taller:
      resultado.subcategoriaId = '84d3ca73-d9fa-430b-b309-908e268af033';
      break;
    case TiposDeConceptoExcel.TecnologiaOtros:
      resultado.subcategoriaId = '4f2a831f-f22d-4199-8715-b54de7765d38';
      break;
    case TiposDeConceptoExcel.SaludOptica:
    case TiposDeConceptoExcel.LentesOptica:
      resultado.subcategoriaId = '4996faa8-daa5-460c-9377-0e5e92de3bfa';
      break;
    case TiposDeConceptoExcel.ViajeHotel:
      resultado.subcategoriaId = '80827210-6ab0-4325-9979-73ffd73f703f';
      break;
    case TiposDeConceptoExcel.HogarOtras:
      resultado.subcategoriaId = 'e4fe4945-4e89-445b-bac0-eb907cdc3245';
      break;
    case TiposDeConceptoExcel.EntretenimientoLibros:
      resultado.subcategoriaId = 'cf5595ac-9079-4345-90de-ccbb5b3b49b3';
      break;
    case TiposDeConceptoExcel.ColegioMateriales:
      resultado.subcategoriaId = '482a3d6d-b067-4181-99bf-9201f6ae2732';
      break;
    case TiposDeConceptoExcel.Nafta:
      resultado.subcategoriaId = '0a931bf6-9b13-4855-a586-a57dae0705c7';
      break;
    case TiposDeConceptoExcel.HijosDepYJuegos:
      resultado.subcategoriaId = '284fc189-3879-4876-b7ca-7e7ffddff12b';
      break;
    case TiposDeConceptoExcel.ViajeAvion:
      resultado.subcategoriaId = '9ce40e92-3a81-4373-b2db-9f7a74556917';
      break;
    case TiposDeConceptoExcel.Teatro:
      resultado.subcategoriaId = '317a66ed-af0e-4b84-a77e-efbb31c33948';
      break;
    case TiposDeConceptoExcel.Alcohol:
      resultado.subcategoriaId = 'c4fb8b43-6697-4bc3-84c1-ee0fa34ae3af';
      break;
    case TiposDeConceptoExcel.Peluqueria_belleza:
      resultado.subcategoriaId = 'a544c67b-969b-486c-a859-6e1087da9858';
      break;
    case TiposDeConceptoExcel.ViajeTransporte:
      resultado.subcategoriaId = '79a56cbf-78e7-4300-9519-26769b1ef66a';
      break;
    case TiposDeConceptoExcel.MaestraDeApoyo:
      resultado.subcategoriaId = '2dd77fcd-8478-44d7-9c46-bb53f3e3425c';
      break;
    default:
      logMessage('Tipo de concepto no mapeado: ' + tipoDeConcepto, 'error');
      resultado.subcategoriaId = '';
      break;
  }

  return resultado;
};

export const mapearSubcategoriasATiposDeConceptoExcel = (
  subcategoriaId?: string,
): [string | undefined, string | undefined] => {
  if (!subcategoriaId) {
    return [undefined, undefined];
  }
  let tipoDeConcepto = '';
  let comentario: string | undefined = undefined;

  switch (subcategoriaId) {
    case '2f98436d-4f72-4bdd-adf9-6c89507e4439':
      tipoDeConcepto = TiposDeConceptoExcel.Taxi;
      break;
    case '3990f166-fbd5-4227-9480-40064c290689':
      tipoDeConcepto = TiposDeConceptoExcel.Comida;
      break;
    case '3f69985d-ac48-407d-b36d-0c05022697ed':
      tipoDeConcepto = TiposDeConceptoExcel.Ropa;
      break;
    case '50e1ce59-a52e-4185-a487-acf84a584717':
      tipoDeConcepto = TiposDeConceptoExcel.TecnologíaHardware;
      break;
    case 'b2031fc3-be75-4a91-b584-f22436e70a14':
      tipoDeConcepto = TiposDeConceptoExcel.Coca;
      break;
    case '314ee9b4-3488-44be-a681-21dfa859a61c':
      tipoDeConcepto = TiposDeConceptoExcel.CosasCasa;
      break;
    case '1ed7e69b-aa38-405d-b4fd-cb87dcfdbde9':
      tipoDeConcepto = TiposDeConceptoExcel.Deporte;
      break;
    case 'daafa406-1687-4c56-9d2c-3fe7cd5b8269':
      tipoDeConcepto = TiposDeConceptoExcel.Doctores;
      break;
    case 'bb814ac0-ae30-481c-9164-71868798d737':
      tipoDeConcepto = TiposDeConceptoExcel.Emilio;
      break;
    case 'aed07cba-f0e0-4953-9087-f1b7390e5535':
      tipoDeConcepto = TiposDeConceptoExcel.EscuelaKiosco;
      break;
    case '75a61534-9c3c-44dc-a085-a16b2d8866ca':
      tipoDeConcepto = TiposDeConceptoExcel.EscuelaKiosco; // Assuming this is the detalleSubcategoriaId for EscuelaKiosco
      break;
    case '9ca0e67d-db40-4435-85b0-46cf5d607b6a':
      tipoDeConcepto = TiposDeConceptoExcel.Regalos;
      break;
    case '40427b72-ded3-44a5-b166-11f03617f7f9':
      tipoDeConcepto = TiposDeConceptoExcel.Otras;
      break;
    case 'b6e5694b-f329-4464-8b80-e60306f0fb86':
      tipoDeConcepto = TiposDeConceptoExcel.Psicologa;
      break;
    case '75eab0ce-6248-402d-96e9-2356e3bbcc96':
      tipoDeConcepto = TiposDeConceptoExcel.ProductosPersonales;
      break;
    case 'fc49d0cb-51ee-4628-a019-40240edadbde':
      tipoDeConcepto = TiposDeConceptoExcel.RopaHijos;
      break;
    case 'e8362bf6-66f8-469e-a203-218fd52c9fb6':
      tipoDeConcepto = TiposDeConceptoExcel.ExtrasClaudia;
      break;
    case '9c90e9f1-7262-4f0a-a0ba-e88876b731be':
      tipoDeConcepto = TiposDeConceptoExcel.HijosHigiene;
      break;
    case '9b5875af-913d-4138-b02c-a15c20614a19':
      tipoDeConcepto = TiposDeConceptoExcel.Juguetes;
      break;
    case '0ca9dfa2-7850-4459-b833-6ceb0ff36ac8':
      tipoDeConcepto = TiposDeConceptoExcel.MedicamentosHijos;
      break;
    case 'df112432-ff89-4bf0-8b9a-dda0983b4429':
      tipoDeConcepto = TiposDeConceptoExcel.TransportePublico;
      break;
    case '7263dbb5-b54a-4e18-93f4-96ae29396fda':
      tipoDeConcepto = TiposDeConceptoExcel.Mantenimiento;
      break;
    case '668eeba2-9d52-4ed3-a46d-337d539e94f3':
      tipoDeConcepto = TiposDeConceptoExcel.Restaurant;
      break;
    case '612c7227-3a3e-43e8-ad67-f45fda448582':
      tipoDeConcepto = TiposDeConceptoExcel.Farmacia;
      break;
    case '666a77ac-2035-41bf-a830-f7fd10513d5c':
      tipoDeConcepto = TiposDeConceptoExcel.SueldoClaudia;
      break;
    case 'ede87023-cf7a-4375-bad0-1739e31bf470':
      tipoDeConcepto = TiposDeConceptoExcel.Supermercado;
      break;
    case '8a962fce-890e-4cc8-8065-6eeb0b7db638':
      tipoDeConcepto = TiposDeConceptoExcel.Mejoras;
      break;
    case 'ce16188d-8926-4115-9678-f899ab692337':
      tipoDeConcepto = TiposDeConceptoExcel.HijosOtros;
      break;
    case '11c84e6b-538b-428a-bc12-3ce3b54656eb':
      tipoDeConcepto = TiposDeConceptoExcel.EscuelaExtras; // Assuming this is the detalleSubcategoriaId for EscuelaExtras
      break;
    case '68b2a8e9-4da3-4b2e-9628-0d0eeb629792':
      tipoDeConcepto = TiposDeConceptoExcel.CosasParaElAuto;
      break;
    case '84d3ca73-d9fa-430b-b309-908e268af033':
      tipoDeConcepto = TiposDeConceptoExcel.Taller;
      break;
    case '4f2a831f-f22d-4199-8715-b54de7765d38':
      tipoDeConcepto = TiposDeConceptoExcel.TecnologiaOtros;
      break;
    case '4996faa8-daa5-460c-9377-0e5e92de3bfa':
      tipoDeConcepto = TiposDeConceptoExcel.SaludOptica;
      break;
    case '80827210-6ab0-4325-9979-73ffd73f703f':
      tipoDeConcepto = TiposDeConceptoExcel.ViajeHotel;
      break;
    case 'e4fe4945-4e89-445b-bac0-eb907cdc3245':
      tipoDeConcepto = TiposDeConceptoExcel.HogarOtras;
      break;
    case 'cf5595ac-9079-4345-90de-ccbb5b3b49b3':
      tipoDeConcepto = TiposDeConceptoExcel.EntretenimientoLibros;
      break;
    case '482a3d6d-b067-4181-99bf-9201f6ae2732':
      tipoDeConcepto = TiposDeConceptoExcel.ColegioMateriales;
      break;
    case '0a931bf6-9b13-4855-a586-a57dae0705c7':
      tipoDeConcepto = TiposDeConceptoExcel.Nafta;
      break;
    case '284fc189-3879-4876-b7ca-7e7ffddff12b':
      tipoDeConcepto = TiposDeConceptoExcel.HijosDepYJuegos;
      break;
    case '9ce40e92-3a81-4373-b2db-9f7a74556917':
      tipoDeConcepto = TiposDeConceptoExcel.ViajeAvion;
      break;
    case '317a66ed-af0e-4b84-a77e-efbb31c33948':
      tipoDeConcepto = TiposDeConceptoExcel.Teatro;
      break;
    case 'c4fb8b43-6697-4bc3-84c1-ee0fa34ae3af':
      tipoDeConcepto = TiposDeConceptoExcel.Alcohol;
      break;
    case 'c7682c23-aacb-4cd1-8169-ac63248c1233':
      tipoDeConcepto = TiposDeConceptoExcel.Otras;
      break;
    case 'a544c67b-969b-486c-a859-6e1087da9858':
      tipoDeConcepto = TiposDeConceptoExcel.Peluqueria_belleza;
      break;
    case '79a56cbf-78e7-4300-9519-26769b1ef66a':
      tipoDeConcepto = TiposDeConceptoExcel.ViajeTransporte;
      break;
    case '2dd77fcd-8478-44d7-9c46-bb53f3e3425c':
      comentario = TiposDeConceptoExcel.MaestraDeApoyo;
      break;
    case '8b326350-cbe9-4633-9bfd-f67ed9a8c638':
      comentario = TiposDeServicioExcel.AguasDeSantiago;
      break;
    case '2df913d3-c627-4ac6-b6fb-210afa9aa8ea':
      comentario = TiposDeServicioExcel.Cablevision;
      break;
    case '3351b34b-b8e0-45ce-bea8-acec4fa8e49b':
      comentario = TiposDeServicioExcel.Contadora;
      break;
    case '2a16dabd-0600-4767-a713-d1bb6ba627fb':
      comentario = TiposDeServicioExcel.Personal;
      break;
    case '44d7d98e-8ce8-4a93-868a-2d7bd51f8cdf':
      comentario = TiposDeServicioExcel.Edese;
      break;
    case '77d6eb72-e3a8-4417-9ce8-ba59123c69f3':
      comentario = TiposDeServicioExcel.Gasnor;
      break;
    case '752ae6bf-b486-4033-b92f-ffef9e4a271c':
      comentario = TiposDeServicioExcel.SantiagoInmobiliarioMunicipal;
      break;
    case 'b7c53d13-1af1-4de4-8315-61f47bee318f':
      comentario = TiposDeServicioExcel.SantiagoRentasProvincial;
      break;
    case 'cf9994c2-5a8d-4f30-8797-e6ff9fa2654c':
      comentario = TiposDeServicioExcel.DtoTucCorSAT;
      break;
    case '671e440e-5c4a-4a15-806d-441f38f9b24c':
      comentario = TiposDeServicioExcel.DtoTucCorGasnor;
      break;
    case 'b66eb6bc-4bc9-49db-bdaa-9d2b79c2e2e0':
      comentario = TiposDeServicioExcel.DtoTucCorEdet;
      break;
    case 'd9a99882-cc0e-414a-a89f-a83be92a9559':
      comentario = TiposDeServicioExcel.DtoTucCorDGR;
      break;
    case 'dbf160e0-cd11-4dfa-ab1b-dc4d3b59ed61':
      comentario = TiposDeServicioExcel.DtoTucCorCISI;
      break;
    case '41c4e23d-55f6-4e9b-ae53-046e5ad1096c':
      comentario = TiposDeServicioExcel.DtoTucMarDGR;
      break;
    case '4092d83a-5170-4616-bb47-f00ae27da710':
      comentario = TiposDeServicioExcel.BahiaABSA;
      break;
    case '15be16e1-fb76-4a13-bdda-2bb589ee8b10':
      comentario = TiposDeServicioExcel.BahiaMunicipal;
      break;
    case '886b95de-5739-4a7f-ab37-4365a751224a':
      comentario = TiposDeServicioExcel.BahiaARBA;
      break;
    case '46916604-b612-43fd-bf9c-61d83e178a34':
      comentario = TiposDeServicioExcel.MonotributoNati;
      break;
    case '6f5f4346-fc38-489e-a4ff-59d0a0c9804b':
      comentario = TiposDeServicioExcel.LawnTennis;
      break;
    case '76689e72-971b-4755-8e3c-a2eab25a64f2':
      comentario = TiposDeServicioExcel.TIC;
      break;
    case '3d5cd77d-653c-491d-a944-3b6a33770c90':
      comentario = TiposDeServicioExcel.ReadersDigest;
      break;
    case 'e96cdf6c-1d0b-4fcf-92bd-e7e23df359fa':
      comentario = TiposDeServicioExcel.HBOMax;
      break;
    case '66911a27-4e5f-445e-b124-c981817265e0':
      comentario = TiposDeServicioExcel.Netflix;
      break;
    case 'cd31d1d9-7b6b-485e-b967-583c955927da':
      comentario = TiposDeServicioExcel.Spotify;
      break;
    case '4ff1671a-6bfc-4dff-82c0-3e7b88359d3a':
      comentario = TiposDeServicioExcel.AportesClaudia;
      break;
    case 'e2079bb3-6264-4e72-a77f-02751847930d':
      comentario = TiposDeServicioExcel.TerapiaOcupacional;
      break;
    case '495b62c6-921b-4c3f-9ab3-3fde8f9b88e2':
      comentario = TiposDeServicioExcel.Auto;
      break;
    case 'a5618f61-d2f2-4c54-be97-77521e0e905f':
      comentario = TiposDeServicioExcel.Colegio;
      break;
    case '8d18954a-a5de-40be-8515-5bcca231bb9c':
      comentario = TiposDeServicioExcel.Patente;
      break;
    default:
      tipoDeConcepto = 'ERROR';
  }

  if (tipoDeConcepto === '') {
    tipoDeConcepto = 'Servicios';
  }

  return [tipoDeConcepto, comentario];
};

export const exportarGastosEstimados = (gastos: GastoEstimadoAnualUI[], meses: string[]): void => {
  const resultado: string[][] = [];
  const header = ['Categoria', ...meses];

  conceptoExcelGastosEstimadosTemplate.forEach((concepto) => {
    if (concepto.tipo === 'categoria') {
      resultado.push([concepto.descripcion, '']);
    } else {
      const gasto = gastos.find((g) => g.id === concepto.subcategoriaId);
      if (gasto) {
        const fila: string[] = [gasto.descripcion.replace('------------- ', '')];
        meses.forEach((mes) => {
          fila.push((gasto[mes] as GastoEstimadoItemDelMes)?.estimado.toString() || '');
        });
        resultado.push(fila);
      }
    }
  });

  // Convert array of objects to CSV format
  const csvContent = [
    header.join(','), // Header row
    ...resultado.map((row) => row.join(',')), // Data rows
  ].join('\n');

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to download the file
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'resultado.csv');
  link.click();

  // Cleanup
  URL.revokeObjectURL(url);
};

export const cloneObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const parseTextoSuenioTomi = (input: string): ImportarSuenioTomiDia[] => {
  const result: ImportarSuenioTomiDia[] = [];
  // Split the input string by lines
  const lines = input.split('\n').filter((line) => line.trim() !== '');

  // Map each line to an array of TimeEntry objects
  lines.forEach((line) => {
    // Remove the leading number and arrow (e.g., ""1 -> "")
    const cleanedLine = line.replace(/^\d+\s*->\s*/, '');

    // Split the line by the ""||"" delimiter
    const entries = cleanedLine.split('||').filter((entry) => entry.trim() !== '');

    // Map each entry to a TimeEntry object
    const dia: ImportarSuenioTomiDia = {
      id: generateUUID(),
      eventos: entries.map((entry) => {
        const [tiempo, tipo] = entry.trim().split(/\s+/);
        return { tiempo, tipo };
      }),
    };
    result.push(dia);
  });

  return result;
};

export const SonIguales = (aniosConMeses1: AnioConMeses[], aniosConMeses2: AnioConMeses[]): boolean => {
  const esMismoAnioConMeses = (anioConMeses1: AnioConMeses, anioConMeses2: AnioConMeses) => {
    if (anioConMeses1.anio !== anioConMeses2.anio) {
      return false;
    }

    if (anioConMeses1.meses.length !== anioConMeses2.meses.length) {
      return false;
    }

    for (let i = 0; i < anioConMeses1.meses.length; i++) {
      if (anioConMeses1.meses[i] !== anioConMeses2.meses[i]) {
        return false;
      }
    }

    return true;
  };

  if (aniosConMeses1.length !== aniosConMeses2.length) {
    return false;
  }

  for (let i = 0; i < aniosConMeses1.length; i++) {
    if (!esMismoAnioConMeses(aniosConMeses1[i], aniosConMeses2[i])) {
      return false;
    }
  }

  return true;
};

export const obtenerMinutosDeSuenio = (dia: AgendaTomiDia): number => {
  let minutoStart = 0;
  return dia.eventos.reduce((acc, evento) => {
    const minutosEnd = timeStringToMinutes(evento.hora);
    if (evento.tipo === 'Despierto') {
      return acc + (minutosEnd - minutoStart);
    }
    minutoStart = minutosEnd;
    return acc;
  }, 0);
};

export const obtenerHorasDeSuenio = (dia: AgendaTomiDia): number => obtenerMinutosDeSuenio(dia) / 60;

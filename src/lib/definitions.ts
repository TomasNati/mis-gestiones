export enum TipoDeGasto {
  Fijo = 'FIJO',
  Variable = 'VARIABLE',
}

export enum TipoDeMovimientoGasto {
  Credito = 'Credito',
  Debito = 'Debito',
  Efectivo = 'Efectivo',
}

export type Categoria = {
  id: string;
  nombre: string;
  comentarios?: string;
};

export type Subcategoria = {
  id: string;
  comentarios?: string;
  categoria: Categoria;
  tipoDeGasto: TipoDeGasto;
  nombre: string;
};

export type SubcategoriaDB = {
  id: string;
  comentarios?: string;
  categoriaId: string;
  categoriaNombre: string;
  tipoDeGasto: TipoDeGasto;
  nombre: string;
};

export type Gasto = {
  id: string;
  comentarios?: string;
  fecha: Date;
  subcategoria: Subcategoria;
  montoEstimado: number;
};

export type DetalleSubcategoria = {
  id: string;
  nombre: string;
  comentarios?: string;
  subcategoria: Subcategoria;
};

export type DetalleSubcategoriaDB = {
  id: string;
  nombre: string;
  comentarios?: string;
  subCategoriaId: string;
  subCategoriaNombre: string;
  subCategoriaTipoDeGasto: TipoDeGasto;
  categoriaId: string;
  categoriaNombre: string;
};

export type MovimientoGasto = {
  id: string;
  comentarios?: string;
  fecha: Date;
  subcategoria: Subcategoria;
  detalleSubcategoria?: DetalleSubcategoria;
  tipoDeGasto: TipoDeMovimientoGasto;
  monto: number;
};

export type MovimientoGastoGrilla = {
  id: string;
  comentarios?: string;
  fecha: Date;
  categoria: string;
  concepto: CategoriaUIMovimiento;
  tipoDeGasto: TipoDeMovimientoGasto;
  monto: number;
  isNew?: boolean;
};

export type MovimientoGastoDB = {
  id: string;
  comentarios: string | null;
  fecha: Date;
  tipoDeGasto: TipoDeMovimientoGasto;
  monto: number;
  subCategoriaId: string;
  subCategoriaNombre: string;
  subCategoriaTipoDeGasto: TipoDeGasto;
  categoriaId: string;
  categoriaNombre: string;
  detalleSubCategoriaId?: string;
  detalleSubCategoriaNombre?: string;
};

export type MovimientoGastoInsertarDB = {
  fecha: Date;
  monto: string;
  subcategoria: string;
  detallesubcategoria: string | null;
  tipodepago: string;
  comentarios: string | null;
};

export type MovimientoUI = {
  id?: string;
  comentarios?: string;
  fecha: Date;
  subcategoriaId: string;
  detalleSubcategoriaId?: string;
  tipoDeGasto?: TipoDeMovimientoGasto;
  monto: number;
  valido: boolean;
  filaId: number;
};

export type CategoriaUIMovimiento = {
  id: string;
  nombre: string;
  categoriaNombre: string;
  subcategoriaId: string;
  detalleSubcategoriaId?: string;
};

export type ResultadoAPI = {
  errores: string[];
  exitoso: boolean;
};

export type TipoDeImportacion = 'Gastos del mes' | 'Presupuesto del mes';

export type ImportarUI = {
  anio: number;
  mes: number;
  tipo: TipoDeImportacion;
  textoAImportar: string;
};

export type ImportarMovimientoUI = {
  anio: number;
  mes: number;
  textoAImportar: string;
};

export interface MovimientoGastoAImportar {
  dia: number;
  subcategoria: string;
  detalleSubcategoria?: string;
  tipoDePago: TipoDeMovimientoGasto;
  monto: number;
  comentarios?: string;
}

export enum TiposDeConceptoExcel {
  Taxi = 'taxi',
  Comida = 'comida',
  Kiosco = 'kiosco',
  Ropa = 'ropa',
  TecnologíaHardware = 'Tecnología-hardware',
  Coca = 'coca',
  CosasCasa = 'cosas casa',
  Deporte = 'deporte',
  Doctores = 'doctores',
  Emilio = 'Emilio',
  Escuela = 'escuela',
  EscuelaKiosco = 'escuela-kiosco',
  LibreParaUsar = 'Libre para usar',
  Regalos = 'regalos',
  Otras = 'otras',
  Psicologa = 'psicologa',
  ProductosPersonales = 'productos personales',
  RopaHijos = 'ropa-hijos',
  ExtrasClaudia = 'extras Claudia',
  HijosHigiene = 'hijos-higiene',
  Juguetes = 'juguetes',
  MedicamentosHijos = 'medicamentos-hijos',
  TransportePublico = 'Transporte publico',
  Mantenimiento = 'Mantenimiento',
  Restaurant = 'Restaurant',
  Farmacia = 'Farmacia',
  SueldoClaudia = 'Sueldo Claudia',
  Supermercado = 'Supermercado',
  Mejoras = 'Mejoras',
  Servicios = 'Servicios',
  HijosOtros = 'Hijos-otros',
  EscuelaExtras = 'Escuela-extras',
  CosasParaElAuto = 'Cosas para el auto',
  Taller = 'Taller',
  TecnologiaOtros = 'Tecnología-otros',
  LentesOptica = 'Lentes - Óptica',
  ViajeHotel = 'Viaje-hotel',
  SaludOptica = 'Salud-Òptica',
  HogarOtras = 'Hogar-otras',
  EntretenimientoLibros = 'Entretenimiento - libros',
  ColegioMateriales = 'Colegio - Materiales',
  Nafta = 'Nafta',
  HijosDepYJuegos = 'Hijos - Dep y juegos',
  ViajeAvion = 'Viaje-avión',
  Teatro = 'Teatro',
  Alcohol = 'Alcohol',
  Peluqueria_belleza = 'Peluquería/belleza',
  ViajeTransporte = 'Viaje-transporte',
  MaestraDeApoyo = 'Maestra de apoyo',
}

export enum TiposDeServicioExcel {
  AguasDeSantiago = 'Aguas de Santiago',
  Cablevision = 'Cablevision',
  Contadora = 'Contadora',
  Personal = 'Personal',
  Edese = 'Edese',
  Gasnor = 'Gasnor',
  SantiagoInmobiliarioMunicipal = 'Santiago - Inmobiliario municipal',
  SantiagoRentasProvincial = 'Santiago - Rentas provincial',
  DtoTucCorSAT = 'Dto. Tuc-Cór - SAT',
  DtoTucCorGasnor = 'Dto. Tuc-Cór - Gasnor',
  DtoTucCorEdet = 'Dto. Tuc-Cór - Edet',
  DtoTucCorDGR = 'Dto. Tuc-Cór - DGR',
  DtoTucCorCISI = 'Dto. Tuc-Cór - CISI',
  DtoTucMarDGR = 'Dto. Tuc-Mar - DGR',
  BahiaABSA = 'Bahía - ABSA',
  BahiaMunicipal = 'Bahía - Municipal',
  BahiaARBA = 'Bahía - ARBA',
  MonotributoNati = 'Monotributo Nati',
  LawnTennis = 'Lawn Tennis',
  TIC = 'TIC',
  ReadersDigest = 'Readers & Digest',
  HBOMax = 'HBO Max',
  Netflix = 'Netflix',
  Spotify = 'Spotify',
  AportesClaudia = 'Aportes Claudia',
  TerapiaOcupacional = 'Terapia Ocupacional',
  Auto = 'Auto',
  Colegio = 'Colegio',
  Patente = 'Patente',
}

export type TipoDeServicioExcel =
  | 'Aguas de Santiago'
  | 'Cablevision'
  | 'Contadora'
  | 'Personal'
  | 'Edese'
  | 'Gasnor'
  | 'Santiago - Inmobiliario municipal'
  | 'Santiago - Rentas provincial'
  | 'Dto. Tuc-Cór - SAT'
  | 'Dto. Tuc-Cór - Gasnor'
  | 'Dto. Tuc-Cór - Edet'
  | 'Dto. Tuc-Cór - DGR'
  | 'Dto. Tuc-Cór - CISI'
  | 'Dto. Tuc-Mar - DGR'
  | 'Bahía - ABSA'
  | 'Bahía - Municipal'
  | 'Bahía - ARBA'
  | 'Monotributo Nati'
  | 'Lawn Tennis'
  | 'TIC'
  | 'Readers & Digest'
  | 'HBO Max'
  | 'Netflix'
  | 'Spotify'
  | 'Aportes Claudia';

export interface ImportarResult {
  lineasInvalidas: {
    linea: string;
    razon: string;
  }[];
  exitoso: boolean;
  error?: string;
  temporal?: ConceptoExcelGastosEstimadoFila[];
}

export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

export type MovimientoGastoGrillaNullable = DeepNullable<MovimientoGastoGrilla>;

export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const years = [2024, 2023, 2022];

export interface ConceptoExcelASubcategoria {
  subcategoriaId: string;
  detalleSubcategoriaId?: string;
  sinComentarios?: boolean;
}

interface ConceptoExcelGastosEstimadoFila {
  indice: number;
  descripcion: string;
  tipo: 'categoria' | 'subcategoria' | 'XXXX';
  monto?: number;
}

export const conceptoExcelGastosEstimadosTemplate: ConceptoExcelGastosEstimadoFila[] = [
  {
    indice: 0,
    descripcion: 'Hijos',
    tipo: 'categoria',
  },
  {
    indice: 1,
    descripcion: 'Actividades',
    tipo: 'subcategoria',
  },
  {
    indice: 2,
    descripcion: 'Medicamentos',
    tipo: 'subcategoria',
  },
  {
    indice: 3,
    descripcion: 'Higiene',
    tipo: 'subcategoria',
  },
  {
    indice: 4,
    descripcion: 'Ropa',
    tipo: 'subcategoria',
  },
  {
    indice: 5,
    descripcion: 'Colegio-Extras',
    tipo: 'subcategoria',
  },
  {
    indice: 6,
    descripcion: 'Juguetes',
    tipo: 'subcategoria',
  },
  {
    indice: 7,
    descripcion: 'Deportes y juegos',
    tipo: 'subcategoria',
  },
  {
    indice: 8,
    descripcion: 'Otros',
    tipo: 'subcategoria',
  },
  {
    indice: 9,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 10,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 11,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 12,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 13,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 14,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 15,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 16,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 17,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 18,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 19,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 20,
    descripcion: 'Educación',
    tipo: 'categoria',
  },
  {
    indice: 21,
    descripcion: 'Cursos',
    tipo: 'subcategoria',
  },
  {
    indice: 22,
    descripcion: 'Colegio',
    tipo: 'subcategoria',
  },
  {
    indice: 23,
    descripcion: 'Materiales escuela',
    tipo: 'subcategoria',
  },
  {
    indice: 24,
    descripcion: 'Otros',
    tipo: 'subcategoria',
  },
  {
    indice: 25,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 26,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 27,
    descripcion: 'Servicios',
    tipo: 'categoria',
  },
  {
    indice: 28,
    descripcion: 'Lawn Tennis',
    tipo: 'subcategoria',
  },
  {
    indice: 29,
    descripcion: 'TIC',
    tipo: 'subcategoria',
  },
  {
    indice: 30,
    descripcion: 'Readers & Digest',
    tipo: 'subcategoria',
  },
  {
    indice: 31,
    descripcion: 'HBO Max',
    tipo: 'subcategoria',
  },
  {
    indice: 32,
    descripcion: 'Netflix',
    tipo: 'subcategoria',
  },
  {
    indice: 33,
    descripcion: 'Disney+',
    tipo: 'subcategoria',
  },
  {
    indice: 34,
    descripcion: 'Libros',
    tipo: 'subcategoria',
  },
  {
    indice: 35,
    descripcion: 'Deporte',
    tipo: 'subcategoria',
  },
  {
    indice: 36,
    descripcion: 'Teatro',
    tipo: 'subcategoria',
  },
  {
    indice: 37,
    descripcion: 'Spotify',
    tipo: 'subcategoria',
  },
  {
    indice: 38,
    descripcion: 'Otro',
    tipo: 'subcategoria',
  },
  {
    indice: 39,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 40,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 41,
    descripcion: 'Diario',
    tipo: 'categoria',
  },
  {
    indice: 42,
    descripcion: 'Comida',
    tipo: 'subcategoria',
  },
  {
    indice: 43,
    descripcion: 'Restaurants',
    tipo: 'subcategoria',
  },
  {
    indice: 44,
    descripcion: 'Productos personales',
    tipo: 'subcategoria',
  },
  {
    indice: 45,
    descripcion: 'Ropa',
    tipo: 'subcategoria',
  },
  {
    indice: 46,
    descripcion: 'Supermercado',
    tipo: 'subcategoria',
  },
  {
    indice: 47,
    descripcion: 'Peluqueria/Belleza',
    tipo: 'subcategoria',
  },
  {
    indice: 48,
    descripcion: 'Alcohol',
    tipo: 'subcategoria',
  },
  {
    indice: 49,
    descripcion: 'Gaseosas',
    tipo: 'subcategoria',
  },
  {
    indice: 50,
    descripcion: 'Otras',
    tipo: 'subcategoria',
  },
  {
    indice: 51,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 52,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 53,
    descripcion: 'Regalos',
    tipo: 'categoria',
  },
  {
    indice: 54,
    descripcion: 'Regalos',
    tipo: 'subcategoria',
  },
  {
    indice: 55,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 56,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 57,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 58,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 59,
    descripcion: 'Salud',
    tipo: 'categoria',
  },
  {
    indice: 60,
    descripcion: 'Doctores',
    tipo: 'subcategoria',
  },
  {
    indice: 61,
    descripcion: 'Maestra de apoyo',
    tipo: 'subcategoria',
  },
  {
    indice: 62,
    descripcion: 'Farmacia',
    tipo: 'subcategoria',
  },
  {
    indice: 63,
    descripcion: 'Psicólogos',
    tipo: 'subcategoria',
  },
  {
    indice: 64,
    descripcion: 'Lentes - Óptica',
    tipo: 'subcategoria',
  },
  {
    indice: 65,
    descripcion: 'Acompañante terapéutico',
    tipo: 'subcategoria',
  },
  {
    indice: 66,
    descripcion: 'Otro',
    tipo: 'subcategoria',
  },
  {
    indice: 67,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 68,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 69,
    descripcion: 'Hogar',
    tipo: 'categoria',
  },
  {
    indice: 70,
    descripcion: 'Aportes Claudia',
    tipo: 'subcategoria',
  },
  {
    indice: 71,
    descripcion: 'Sueldo Claudia',
    tipo: 'subcategoria',
  },
  {
    indice: 72,
    descripcion: 'Extras Claudia',
    tipo: 'subcategoria',
  },
  {
    indice: 73,
    descripcion: 'Muebles',
    tipo: 'subcategoria',
  },
  {
    indice: 74,
    descripcion: 'Jardin',
    tipo: 'subcategoria',
  },
  {
    indice: 75,
    descripcion: 'Cosas para la casa',
    tipo: 'subcategoria',
  },
  {
    indice: 76,
    descripcion: 'Mantenimiento',
    tipo: 'subcategoria',
  },
  {
    indice: 77,
    descripcion: 'Mejora',
    tipo: 'subcategoria',
  },
  {
    indice: 78,
    descripcion: 'Mudanza',
    tipo: 'subcategoria',
  },
  {
    indice: 79,
    descripcion: 'Otras',
    tipo: 'subcategoria',
  },
  {
    indice: 80,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 81,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 82,
    descripcion: 'Seguros',
    tipo: 'categoria',
  },
  {
    indice: 83,
    descripcion: 'Auto',
    tipo: 'subcategoria',
  },
  {
    indice: 84,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 85,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 86,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 87,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 88,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 89,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 90,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 91,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 92,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 93,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 94,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 95,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 96,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 97,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 98,
    descripcion: 'Tecnología',
    tipo: 'categoria',
  },
  {
    indice: 99,
    descripcion: 'Domains & hosting',
    tipo: 'subcategoria',
  },
  {
    indice: 100,
    descripcion: 'Servicios Online',
    tipo: 'subcategoria',
  },
  {
    indice: 101,
    descripcion: 'Hardware',
    tipo: 'subcategoria',
  },
  {
    indice: 102,
    descripcion: 'Software',
    tipo: 'subcategoria',
  },
  {
    indice: 103,
    descripcion: 'Tablet + funda',
    tipo: 'subcategoria',
  },
  {
    indice: 104,
    descripcion: 'Otros',
    tipo: 'subcategoria',
  },
  {
    indice: 105,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 106,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 107,
    descripcion: 'Transporte',
    tipo: 'categoria',
  },

  {
    indice: 108,
    descripcion: 'Nafta',
    tipo: 'subcategoria',
  },
  {
    indice: 109,
    descripcion: 'Patente auto',
    tipo: 'subcategoria',
  },
  {
    indice: 110,
    descripcion: 'Taller',
    tipo: 'subcategoria',
  },
  {
    indice: 111,
    descripcion: 'VTV',
    tipo: 'subcategoria',
  },
  {
    indice: 112,
    descripcion: 'Cosas para el auto',
    tipo: 'subcategoria',
  },
  {
    indice: 113,
    descripcion: 'Taxi',
    tipo: 'subcategoria',
  },
  {
    indice: 114,
    descripcion: 'Transporte Publico',
    tipo: 'subcategoria',
  },
  {
    indice: 115,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 116,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 117,
    descripcion: 'Viajes',
    tipo: 'categoria',
  },
  {
    indice: 118,
    descripcion: 'Avion',
    tipo: 'subcategoria',
  },
  {
    indice: 119,
    descripcion: 'Hoteles',
    tipo: 'subcategoria',
  },
  {
    indice: 120,
    descripcion: 'Comida',
    tipo: 'subcategoria',
  },
  {
    indice: 121,
    descripcion: 'Transporte',
    tipo: 'subcategoria',
  },
  {
    indice: 122,
    descripcion: 'Entretenimiento',
    tipo: 'subcategoria',
  },
  {
    indice: 123,
    descripcion: 'Otro',
    tipo: 'subcategoria',
  },
  {
    indice: 124,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 125,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 126,
    descripcion: 'Servicios',
    tipo: 'categoria',
  },
  {
    indice: 127,
    descripcion: 'Aguas de Santiago',
    tipo: 'subcategoria',
  },
  {
    indice: 128,
    descripcion: 'Cablevision',
    tipo: 'subcategoria',
  },
  {
    indice: 129,
    descripcion: 'Contadora',
    tipo: 'subcategoria',
  },
  {
    indice: 130,
    descripcion: 'Personal',
    tipo: 'subcategoria',
  },
  {
    indice: 131,
    descripcion: 'Edese',
    tipo: 'subcategoria',
  },
  {
    indice: 132,
    descripcion: 'Gasnor',
    tipo: 'subcategoria',
  },
  {
    indice: 133,
    descripcion: 'Santiago - Inmobiliario municipal',
    tipo: 'subcategoria',
  },
  {
    indice: 134,
    descripcion: 'Santiago - Rentas provincial',
    tipo: 'subcategoria',
  },
  {
    indice: 135,
    descripcion: 'Dto. Tuc-Cór - SAT',
    tipo: 'subcategoria',
  },
  {
    indice: 136,
    descripcion: 'Dto. Tuc-Cór - Gasnor',
    tipo: 'subcategoria',
  },
  {
    indice: 137,
    descripcion: 'Dto. Tuc-Cór - Edet',
    tipo: 'subcategoria',
  },
  {
    indice: 138,
    descripcion: 'Dto. Tuc-Cór - DGR',
    tipo: 'subcategoria',
  },
  {
    indice: 139,
    descripcion: 'Dto. Tuc-Cór - CISI',
    tipo: 'subcategoria',
  },
  {
    indice: 140,
    descripcion: 'Dto. Tuc-Mar - DGR',
    tipo: 'subcategoria',
  },
  {
    indice: 141,
    descripcion: 'Bahía - ABSA',
    tipo: 'subcategoria',
  },
  {
    indice: 142,
    descripcion: 'Bahía - Municipal',
    tipo: 'subcategoria',
  },
  {
    indice: 143,
    descripcion: 'Bahía - ARBA',
    tipo: 'subcategoria',
  },
  {
    indice: 144,
    descripcion: 'Monotributo Nati',
    tipo: 'subcategoria',
  },
  {
    indice: 145,
    descripcion: 'Patente',
    tipo: 'subcategoria',
  },
  {
    indice: 146,
    descripcion: 'Placehodler',
    tipo: 'subcategoria',
  },
  {
    indice: 147,
    descripcion: 'Other',
    tipo: 'subcategoria',
  },
  {
    indice: 148,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 149,
    descripcion: 'XXXX',
    tipo: 'XXXX',
  },
  {
    indice: 150,
    descripcion: 'Other',
    tipo: 'categoria',
  },
  {
    indice: 151,
    descripcion: 'Cripto',
    tipo: 'subcategoria',
  },
  {
    indice: 152,
    descripcion: 'Emilio',
    tipo: 'subcategoria',
  },
  {
    indice: 153,
    descripcion: 'Otros',
    tipo: 'subcategoria',
  },
];

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

export interface ImportarMovimientosResult {
  lineasInvalidas: {
    linea: string;
    razon: string;
  }[];
  exitoso: boolean;
  error?: string;
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
  tipo: 'categoria' | 'subcategoria';
}

export const ConceptoExcelGastosEstimados: ConceptoExcelGastosEstimadoFila[] = [
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
    descripcion: 'Educación',
    tipo: 'categoria',
  },
  {
    indice: 10,
    descripcion: 'Cursos',
    tipo: 'subcategoria',
  },
  {
    indice: 11,
    descripcion: 'Colegio',
    tipo: 'subcategoria',
  },
  {
    indice: 12,
    descripcion: 'Materiales escuela',
    tipo: 'subcategoria',
  },
  {
    indice: 13,
    descripcion: 'Otros',
    tipo: 'subcategoria',
  },
  {
    indice: 14,
    descripcion: 'Entretenimiento',
    tipo: 'categoria',
  },
  {
    indice: 15,
    descripcion: 'Lawn Tennis',
    tipo: 'subcategoria',
  },
  {
    indice: 16,
    descripcion: 'TIC',
    tipo: 'subcategoria',
  },
  {
    indice: 17,
    descripcion: 'Readers & Digest',
    tipo: 'subcategoria',
  },
  {
    indice: 18,
    descripcion: 'HBO Max',
    tipo: 'subcategoria',
  },
  {
    indice: 19,
    descripcion: 'Netflix',
    tipo: 'subcategoria',
  },
  {
    indice: 20,
    descripcion: 'Disney+',
    tipo: 'subcategoria',
  },
  {
    indice: 21,
    descripcion: 'Libros',
    tipo: 'subcategoria',
  },
  {
    indice: 22,
    descripcion: 'Deporte',
    tipo: 'subcategoria',
  },
  {
    indice: 23,
    descripcion: 'Teatro',
    tipo: 'subcategoria',
  },
  {
    indice: 24,
    descripcion: 'Spotify',
    tipo: 'subcategoria',
  },
  {
    indice: 25,
    descripcion: 'Otro',
    tipo: 'subcategoria',
  },
  {
    indice: 26,
    descripcion: 'Diario',
    tipo: 'categoria',
  },
  {
    indice: 27,
    descripcion: 'Comida',
    tipo: 'subcategoria',
  },
  {
    indice: 28,
    descripcion: 'Restaurants',
    tipo: 'subcategoria',
  },
  {
    indice: 29,
    descripcion: 'Productos personales',
    tipo: 'subcategoria',
  },
  {
    indice: 30,
    descripcion: 'Ropa',
    tipo: 'subcategoria',
  },
  {
    indice: 31,
    descripcion: 'Supermercado',
    tipo: 'subcategoria',
  },
  {
    indice: 32,
    descripcion: 'Peluqueria/Belleza',
    tipo: 'subcategoria',
  },
  {
    indice: 33,
    descripcion: 'Alcohol',
    tipo: 'subcategoria',
  },
  {
    indice: 34,
    descripcion: 'Gaseosas',
    tipo: 'subcategoria',
  },
  {
    indice: 35,
    descripcion: 'Otras',
    tipo: 'subcategoria',
  },
  {
    indice: 36,
    descripcion: 'Regalos',
    tipo: 'categoria',
  },
  {
    indice: 37,
    descripcion: 'Regalos',
    tipo: 'subcategoria',
  },
  {
    indice: 38,
    descripcion: 'Salud',
    tipo: 'categoria',
  },
  {
    indice: 39,
    descripcion: 'Doctores',
    tipo: 'subcategoria',
  },
  {
    indice: 40,
    descripcion: 'Maestra de apoyo',
    tipo: 'subcategoria',
  },
  {
    indice: 41,
    descripcion: 'Farmacia',
    tipo: 'subcategoria',
  },
  {
    indice: 42,
    descripcion: 'Psicologos',
    tipo: 'subcategoria',
  },
  {
    indice: 43,
    descripcion: 'Lentes - Óptica',
    tipo: 'subcategoria',
  },
  {
    indice: 44,
    descripcion: 'Acompañante terapéutico',
    tipo: 'subcategoria',
  },
  {
    indice: 45,
    descripcion: 'Otro',
    tipo: 'subcategoria',
  },
  {
    indice: 46,
    descripcion: 'Hogar',
    tipo: 'categoria',
  },
  {
    indice: 47,
    descripcion: 'Aportes Claudia',
    tipo: 'subcategoria',
  },
  {
    indice: 48,
    descripcion: 'Sueldo Claudia',
    tipo: 'subcategoria',
  },
  {
    indice: 49,
    descripcion: 'Extras Claudia',
    tipo: 'subcategoria',
  },
  {
    indice: 50,
    descripcion: 'Muebles',
    tipo: 'subcategoria',
  },
  {
    indice: 51,
    descripcion: 'Jardin',
    tipo: 'subcategoria',
  },
  {
    indice: 52,
    descripcion: 'Cosas para la casa',
    tipo: 'subcategoria',
  },
  {
    indice: 53,
    descripcion: 'Mantenimiento',
    tipo: 'subcategoria',
  },
  {
    indice: 54,
    descripcion: 'Mejora',
    tipo: 'subcategoria',
  },
  {
    indice: 55,
    descripcion: 'Mudanza',
    tipo: 'subcategoria',
  },
  {
    indice: 56,
    descripcion: 'Otras',
    tipo: 'subcategoria',
  },
  {
    indice: 57,
    descripcion: 'Seguros',
    tipo: 'categoria',
  },
  {
    indice: 58,
    descripcion: 'Auto',
    tipo: 'subcategoria',
  },
  {
    indice: 59,
    descripcion: 'Tecnología',
    tipo: 'categoria',
  },
  {
    indice: 60,
    descripcion: 'Domains & hosting',
    tipo: 'subcategoria',
  },
  {
    indice: 61,
    descripcion: 'Servicios Online',
    tipo: 'subcategoria',
  },
  {
    indice: 62,
    descripcion: 'Hardware',
    tipo: 'subcategoria',
  },
  {
    indice: 63,
    descripcion: 'Software',
    tipo: 'subcategoria',
  },
  {
    indice: 64,
    descripcion: 'Tablet + funda',
    tipo: 'subcategoria',
  },
  {
    indice: 65,
    descripcion: 'Otros',
    tipo: 'subcategoria',
  },
  {
    indice: 66,
    descripcion: 'Transporte',
    tipo: 'categoria',
  },
  {
    indice: 67,
    descripcion: 'Nafta',
    tipo: 'subcategoria',
  },
  {
    indice: 68,
    descripcion: 'Patente auto',
    tipo: 'subcategoria',
  },
  {
    indice: 69,
    descripcion: 'Taller',
    tipo: 'subcategoria',
  },
  {
    indice: 70,
    descripcion: 'VTV',
    tipo: 'subcategoria',
  },
  {
    indice: 71,
    descripcion: 'Cosas para el auto',
    tipo: 'subcategoria',
  },
  {
    indice: 72,
    descripcion: 'Taxi',
    tipo: 'subcategoria',
  },
  {
    indice: 73,
    descripcion: 'Transporte Publico',
    tipo: 'subcategoria',
  },
  {
    indice: 74,
    descripcion: 'Viajes',
    tipo: 'categoria',
  },
  {
    indice: 75,
    descripcion: 'Avion',
    tipo: 'subcategoria',
  },
  {
    indice: 76,
    descripcion: 'Hotels',
    tipo: 'subcategoria',
  },
  {
    indice: 77,
    descripcion: 'Comida',
    tipo: 'subcategoria',
  },
  {
    indice: 78,
    descripcion: 'Transporte',
    tipo: 'subcategoria',
  },
  {
    indice: 79,
    descripcion: 'Entretenimiento',
    tipo: 'subcategoria',
  },
  {
    indice: 80,
    descripcion: 'Otro',
    tipo: 'subcategoria',
  },
  {
    indice: 81,
    descripcion: 'Servicios',
    tipo: 'categoria',
  },
  {
    indice: 82,
    descripcion: 'Servicios',
    tipo: 'subcategoria',
  },
  {
    indice: 83,
    descripcion: 'Cablevision',
    tipo: 'subcategoria',
  },
  {
    indice: 84,
    descripcion: 'Contadora',
    tipo: 'subcategoria',
  },
  {
    indice: 85,
    descripcion: 'Personal',
    tipo: 'subcategoria',
  },
  {
    indice: 86,
    descripcion: 'Edese',
    tipo: 'subcategoria',
  },
  {
    indice: 87,
    descripcion: 'Gasnor',
    tipo: 'subcategoria',
  },
  {
    indice: 88,
    descripcion: 'Santiago - Inmobiliario municipal',
    tipo: 'subcategoria',
  },
  {
    indice: 89,
    descripcion: 'Santiago - Rentas provincial',
    tipo: 'subcategoria',
  },
  {
    indice: 90,
    descripcion: 'Dto. Tuc-Cór - SAT',
    tipo: 'subcategoria',
  },
  {
    indice: 91,
    descripcion: 'Dto. Tuc-Cór - Gasnor',
    tipo: 'subcategoria',
  },
  {
    indice: 92,
    descripcion: 'Dto. Tuc-Cór - Edet',
    tipo: 'subcategoria',
  },
  {
    indice: 93,
    descripcion: 'Dto. Tuc-Cór - DGR',
    tipo: 'subcategoria',
  },
  {
    indice: 94,
    descripcion: 'Dto. Tuc-Cór - CISI',
    tipo: 'subcategoria',
  },
  {
    indice: 95,
    descripcion: 'Dto. Tuc-Mar - DGR',
    tipo: 'subcategoria',
  },
  {
    indice: 96,
    descripcion: 'Bahía - ABSA',
    tipo: 'subcategoria',
  },
  {
    indice: 97,
    descripcion: 'Bahía - Municipal',
    tipo: 'subcategoria',
  },
  {
    indice: 98,
    descripcion: 'Bahía - ARBA',
    tipo: 'subcategoria',
  },
  {
    indice: 99,
    descripcion: 'Monotributo Nati',
    tipo: 'subcategoria',
  },
  {
    indice: 100,
    descripcion: 'Patente',
    tipo: 'subcategoria',
  },
  {
    indice: 101,
    descripcion: 'Placehodler',
    tipo: 'subcategoria',
  },
  {
    indice: 102,
    descripcion: 'Other',
    tipo: 'subcategoria',
  },
  {
    indice: 103,
    descripcion: 'Other',
    tipo: 'categoria',
  },
  {
    indice: 104,
    descripcion: 'Cripto',
    tipo: 'subcategoria',
  },
  {
    indice: 105,
    descripcion: 'Emilio',
    tipo: 'subcategoria',
  },
  {
    indice: 106,
    descripcion: 'Otros',
    tipo: 'subcategoria',
  },
];

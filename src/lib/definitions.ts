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

export type EstadoUIMovimiento = 'deleted' | 'updated' | 'added';

export type MovimientoPayloadMobile = {
  id: string;
  comentarios?: string;
  fecha: Date;
  categoria: string;
  concepto: CategoriaUIMovimiento;
  tipoDeGasto: TipoDeMovimientoGasto;
  monto: number;
  state?: EstadoUIMovimiento;
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

export type ResultadoAPICrear = ResultadoAPI & {
  idsCreados: string[];
};

export interface ResultadoCrearMovimiento {
  id?: string;
  error?: string;
}

export type TipoDeImportacion = 'Gastos del mes' | 'Presupuesto del mes' | 'Horas sueño Tomi';

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

export const years = [2025, 2024, 2023, 2022];

export interface ConceptoExcelASubcategoria {
  subcategoriaId: string;
  detalleSubcategoriaId?: string;
  sinComentarios?: boolean;
}

export interface ConceptoExcelGastosEstimadoFila {
  indice: number;
  descripcion: string;
  tipo: 'categoria' | 'subcategoria' | 'XXXX';
  monto?: number;
  subcategoriaId?: string;
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
    subcategoriaId: '84edcca4-f102-4a99-83e0-8a8cad82b6fd',
  },
  {
    indice: 2,
    descripcion: 'Medicamentos',
    tipo: 'subcategoria',
    subcategoriaId: '0ca9dfa2-7850-4459-b833-6ceb0ff36ac8',
  },
  {
    indice: 3,
    descripcion: 'Higiene',
    tipo: 'subcategoria',
    subcategoriaId: '9c90e9f1-7262-4f0a-a0ba-e88876b731be',
  },
  {
    indice: 4,
    descripcion: 'Ropa',
    tipo: 'subcategoria',
    subcategoriaId: 'fc49d0cb-51ee-4628-a019-40240edadbde',
  },
  {
    indice: 5,
    descripcion: 'Colegio-Extras',
    tipo: 'subcategoria',
    subcategoriaId: 'aed07cba-f0e0-4953-9087-f1b7390e5535',
  },
  {
    indice: 6,
    descripcion: 'Juguetes',
    tipo: 'subcategoria',
    subcategoriaId: '9b5875af-913d-4138-b02c-a15c20614a19',
  },
  {
    indice: 7,
    descripcion: 'Deportes y juegos',
    tipo: 'subcategoria',
    subcategoriaId: '284fc189-3879-4876-b7ca-7e7ffddff12b',
  },
  {
    indice: 8,
    descripcion: 'Otros',
    tipo: 'subcategoria',
    subcategoriaId: 'ce16188d-8926-4115-9678-f899ab692337',
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
    subcategoriaId: '41b3e23f-1e9b-4c6f-94f2-a3d3821bb24f',
  },
  {
    indice: 22,
    descripcion: 'Colegio',
    tipo: 'subcategoria',
    subcategoriaId: 'a5618f61-d2f2-4c54-be97-77521e0e905f',
  },
  {
    indice: 23,
    descripcion: 'Materiales escuela',
    tipo: 'subcategoria',
    subcategoriaId: '482a3d6d-b067-4181-99bf-9201f6ae2732',
  },
  {
    indice: 24,
    descripcion: 'Otros',
    tipo: 'subcategoria',
    subcategoriaId: '550703ab-3245-4c66-a6e2-edeb80053cbd',
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
    descripcion: 'Entretenimiento',
    tipo: 'categoria',
  },
  {
    indice: 28,
    descripcion: 'Lawn Tennis',
    tipo: 'subcategoria',
    subcategoriaId: '6f5f4346-fc38-489e-a4ff-59d0a0c9804b',
  },
  {
    indice: 29,
    descripcion: 'TIC',
    tipo: 'subcategoria',
    subcategoriaId: '76689e72-971b-4755-8e3c-a2eab25a64f2',
  },
  {
    indice: 30,
    descripcion: 'Readers & Digest',
    tipo: 'subcategoria',
    subcategoriaId: '3d5cd77d-653c-491d-a944-3b6a33770c90',
  },
  {
    indice: 31,
    descripcion: 'HBO Max',
    tipo: 'subcategoria',
    subcategoriaId: 'e96cdf6c-1d0b-4fcf-92bd-e7e23df359fa',
  },
  {
    indice: 32,
    descripcion: 'Netflix',
    tipo: 'subcategoria',
    subcategoriaId: '66911a27-4e5f-445e-b124-c981817265e0',
  },
  {
    indice: 33,
    descripcion: 'Disney+',
    tipo: 'subcategoria',
    subcategoriaId: '54254233-02c4-42c1-a467-e275a4143b9a',
  },
  {
    indice: 34,
    descripcion: 'Libros',
    tipo: 'subcategoria',
    subcategoriaId: 'cf5595ac-9079-4345-90de-ccbb5b3b49b3',
  },
  {
    indice: 35,
    descripcion: 'Deporte',
    tipo: 'subcategoria',
    subcategoriaId: '1ed7e69b-aa38-405d-b4fd-cb87dcfdbde9',
  },
  {
    indice: 36,
    descripcion: 'Teatro',
    tipo: 'subcategoria',
    subcategoriaId: '317a66ed-af0e-4b84-a77e-efbb31c33948',
  },
  {
    indice: 37,
    descripcion: 'Spotify',
    tipo: 'subcategoria',
    subcategoriaId: 'cd31d1d9-7b6b-485e-b967-583c955927da',
  },
  {
    indice: 38,
    descripcion: 'Otro',
    tipo: 'subcategoria',
    subcategoriaId: 'ba13ec69-b60a-4a19-ad03-867cda161f90',
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
    subcategoriaId: '3990f166-fbd5-4227-9480-40064c290689',
  },
  {
    indice: 43,
    descripcion: 'Restaurants',
    tipo: 'subcategoria',
    subcategoriaId: '668eeba2-9d52-4ed3-a46d-337d539e94f3',
  },
  {
    indice: 44,
    descripcion: 'Productos personales',
    tipo: 'subcategoria',
    subcategoriaId: '75eab0ce-6248-402d-96e9-2356e3bbcc96',
  },
  {
    indice: 45,
    descripcion: 'Ropa',
    tipo: 'subcategoria',
    subcategoriaId: '3f69985d-ac48-407d-b36d-0c05022697ed',
  },
  {
    indice: 46,
    descripcion: 'Supermercado',
    tipo: 'subcategoria',
    subcategoriaId: 'ede87023-cf7a-4375-bad0-1739e31bf470',
  },
  {
    indice: 47,
    descripcion: 'Peluqueria/Belleza',
    tipo: 'subcategoria',
    subcategoriaId: 'a544c67b-969b-486c-a859-6e1087da9858',
  },
  {
    indice: 48,
    descripcion: 'Alcohol',
    tipo: 'subcategoria',
    subcategoriaId: 'c4fb8b43-6697-4bc3-84c1-ee0fa34ae3af',
  },
  {
    indice: 49,
    descripcion: 'Gaseosas',
    tipo: 'subcategoria',
    subcategoriaId: 'b2031fc3-be75-4a91-b584-f22436e70a14',
  },
  {
    indice: 50,
    descripcion: 'Otras',
    tipo: 'subcategoria',
    subcategoriaId: '40427b72-ded3-44a5-b166-11f03617f7f9',
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
    subcategoriaId: '9ca0e67d-db40-4435-85b0-46cf5d607b6a',
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
    subcategoriaId: 'daafa406-1687-4c56-9d2c-3fe7cd5b8269',
  },
  {
    indice: 61,
    descripcion: 'Maestra de apoyo',
    tipo: 'subcategoria',
    subcategoriaId: '2dd77fcd-8478-44d7-9c46-bb53f3e3425c',
  },
  {
    indice: 62,
    descripcion: 'Farmacia',
    tipo: 'subcategoria',
    subcategoriaId: '612c7227-3a3e-43e8-ad67-f45fda448582',
  },
  {
    indice: 63,
    descripcion: 'Psicólogos',
    tipo: 'subcategoria',
    subcategoriaId: 'b6e5694b-f329-4464-8b80-e60306f0fb86',
  },
  {
    indice: 64,
    descripcion: 'Lentes - Óptica',
    tipo: 'subcategoria',
    subcategoriaId: '4996faa8-daa5-460c-9377-0e5e92de3bfa',
  },
  {
    indice: 65,
    descripcion: 'Acompañante terapéutico',
    tipo: 'subcategoria',
    subcategoriaId: 'e2079bb3-6264-4e72-a77f-02751847930d',
  },
  {
    indice: 66,
    descripcion: 'Otro',
    tipo: 'subcategoria',
    subcategoriaId: 'f2f450ed-4695-4f3c-aab5-4c9c11de45f7',
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
    subcategoriaId: '4ff1671a-6bfc-4dff-82c0-3e7b88359d3a',
  },
  {
    indice: 71,
    descripcion: 'Sueldo Claudia',
    tipo: 'subcategoria',
    subcategoriaId: '666a77ac-2035-41bf-a830-f7fd10513d5c',
  },
  {
    indice: 72,
    descripcion: 'Extras Claudia',
    tipo: 'subcategoria',
    subcategoriaId: 'e8362bf6-66f8-469e-a203-218fd52c9fb6',
  },
  {
    indice: 73,
    descripcion: 'Muebles',
    tipo: 'subcategoria',
    subcategoriaId: 'b690f34a-169c-4d90-8ea0-51ad89272ae1',
  },
  {
    indice: 74,
    descripcion: 'Jardin',
    tipo: 'subcategoria',
    subcategoriaId: 'dc548e98-3516-4a6f-a536-4a9a6443fbcb',
  },
  {
    indice: 75,
    descripcion: 'Cosas para la casa',
    tipo: 'subcategoria',
    subcategoriaId: '314ee9b4-3488-44be-a681-21dfa859a61c',
  },
  {
    indice: 76,
    descripcion: 'Mantenimiento',
    tipo: 'subcategoria',
    subcategoriaId: '7263dbb5-b54a-4e18-93f4-96ae29396fda',
  },
  {
    indice: 77,
    descripcion: 'Mejora',
    tipo: 'subcategoria',
    subcategoriaId: '8a962fce-890e-4cc8-8065-6eeb0b7db638',
  },
  {
    indice: 78,
    descripcion: 'Mudanza',
    tipo: 'subcategoria',
    subcategoriaId: 'a69b9d11-1812-4354-96e6-e72708f19363',
  },
  {
    indice: 79,
    descripcion: 'Otras',
    tipo: 'subcategoria',
    subcategoriaId: 'e4fe4945-4e89-445b-bac0-eb907cdc3245',
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
    subcategoriaId: '495b62c6-921b-4c3f-9ab3-3fde8f9b88e2',
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
    subcategoriaId: '50e1ce59-a52e-4185-a487-acf84a584717',
  },
  {
    indice: 102,
    descripcion: 'Software',
    tipo: 'subcategoria',
    subcategoriaId: 'd55541b0-3398-47fe-8a22-75621960099d',
  },
  {
    indice: 103,
    descripcion: 'Tablet + funda',
    tipo: 'subcategoria',
    subcategoriaId: '50e1ce59-a52e-4185-a487-acf84a584717', //Uso la misma que hardware
  },
  {
    indice: 104,
    descripcion: 'Otros',
    tipo: 'subcategoria',
    subcategoriaId: '4f2a831f-f22d-4199-8715-b54de7765d38',
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
    subcategoriaId: '0a931bf6-9b13-4855-a586-a57dae0705c7',
  },
  {
    indice: 109,
    descripcion: 'Patente auto',
    tipo: 'subcategoria',
    subcategoriaId: 'fee680c3-a6c9-4f38-932d-33de0781a04c',
  },
  {
    indice: 110,
    descripcion: 'Taller',
    tipo: 'subcategoria',
    subcategoriaId: '84d3ca73-d9fa-430b-b309-908e268af033',
  },
  {
    indice: 111,
    descripcion: 'VTV',
    tipo: 'subcategoria',
    subcategoriaId: '7fa07d7f-c0ad-4376-9c4a-fec6a906c878',
  },
  {
    indice: 112,
    descripcion: 'Cosas para el auto',
    tipo: 'subcategoria',
    subcategoriaId: '68b2a8e9-4da3-4b2e-9628-0d0eeb629792',
  },
  {
    indice: 113,
    descripcion: 'Taxi',
    tipo: 'subcategoria',
    subcategoriaId: '2f98436d-4f72-4bdd-adf9-6c89507e4439',
  },
  {
    indice: 114,
    descripcion: 'Transporte Publico',
    tipo: 'subcategoria',
    subcategoriaId: 'df112432-ff89-4bf0-8b9a-dda0983b4429',
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
    subcategoriaId: '9ce40e92-3a81-4373-b2db-9f7a74556917',
  },
  {
    indice: 119,
    descripcion: 'Hoteles',
    tipo: 'subcategoria',
    subcategoriaId: '80827210-6ab0-4325-9979-73ffd73f703f',
  },
  {
    indice: 120,
    descripcion: 'Comida',
    tipo: 'subcategoria',
    subcategoriaId: '03e1f603-5e2d-43d5-83ba-08030f8df5ab',
  },
  {
    indice: 121,
    descripcion: 'Transporte',
    tipo: 'subcategoria',
    subcategoriaId: '79a56cbf-78e7-4300-9519-26769b1ef66a',
  },
  {
    indice: 122,
    descripcion: 'Entretenimiento',
    tipo: 'subcategoria',
    subcategoriaId: 'c4ac890e-5ba0-4c11-967e-1b2ecf68e0d4',
  },
  {
    indice: 123,
    descripcion: 'Otro',
    tipo: 'subcategoria',
    subcategoriaId: 'bbd9280e-b1bf-4899-8145-58a7d7c561ed',
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
    subcategoriaId: '8b326350-cbe9-4633-9bfd-f67ed9a8c638',
  },
  {
    indice: 128,
    descripcion: 'Cablevision',
    tipo: 'subcategoria',
    subcategoriaId: '2df913d3-c627-4ac6-b6fb-210afa9aa8ea',
  },
  {
    indice: 129,
    descripcion: 'Contadora',
    tipo: 'subcategoria',
    subcategoriaId: '3351b34b-b8e0-45ce-bea8-acec4fa8e49b',
  },
  {
    indice: 130,
    descripcion: 'Personal',
    tipo: 'subcategoria',
    subcategoriaId: '2a16dabd-0600-4767-a713-d1bb6ba627fb',
  },
  {
    indice: 131,
    descripcion: 'Edese',
    tipo: 'subcategoria',
    subcategoriaId: '44d7d98e-8ce8-4a93-868a-2d7bd51f8cdf',
  },
  {
    indice: 132,
    descripcion: 'Gasnor',
    tipo: 'subcategoria',
    subcategoriaId: '77d6eb72-e3a8-4417-9ce8-ba59123c69f3',
  },
  {
    indice: 133,
    descripcion: 'Santiago - Inmobiliario municipal',
    tipo: 'subcategoria',
    subcategoriaId: '752ae6bf-b486-4033-b92f-ffef9e4a271c',
  },
  {
    indice: 134,
    descripcion: 'Santiago - Rentas provincial',
    tipo: 'subcategoria',
    subcategoriaId: 'b7c53d13-1af1-4de4-8315-61f47bee318f',
  },
  {
    indice: 135,
    descripcion: 'Dto. Tuc-Cór - SAT',
    tipo: 'subcategoria',
    subcategoriaId: 'cf9994c2-5a8d-4f30-8797-e6ff9fa2654c',
  },
  {
    indice: 136,
    descripcion: 'Dto. Tuc-Cór - Gasnor',
    tipo: 'subcategoria',
    subcategoriaId: '671e440e-5c4a-4a15-806d-441f38f9b24c',
  },
  {
    indice: 137,
    descripcion: 'Dto. Tuc-Cór - Edet',
    tipo: 'subcategoria',
    subcategoriaId: 'b66eb6bc-4bc9-49db-bdaa-9d2b79c2e2e0',
  },
  {
    indice: 138,
    descripcion: 'Dto. Tuc-Cór - DGR',
    tipo: 'subcategoria',
    subcategoriaId: '41c4e23d-55f6-4e9b-ae53-046e5ad1096c',
  },
  {
    indice: 139,
    descripcion: 'Dto. Tuc-Cór - CISI',
    tipo: 'subcategoria',
    subcategoriaId: 'dbf160e0-cd11-4dfa-ab1b-dc4d3b59ed61',
  },
  {
    indice: 140,
    descripcion: 'Dto. Tuc-Mar - DGR',
    tipo: 'subcategoria',
    subcategoriaId: '41c4e23d-55f6-4e9b-ae53-046e5ad1096c',
  },
  {
    indice: 141,
    descripcion: 'Bahía - ABSA',
    tipo: 'subcategoria',
    subcategoriaId: '4092d83a-5170-4616-bb47-f00ae27da710',
  },
  {
    indice: 142,
    descripcion: 'Bahía - Municipal',
    tipo: 'subcategoria',
    subcategoriaId: '15be16e1-fb76-4a13-bdda-2bb589ee8b10',
  },
  {
    indice: 143,
    descripcion: 'Bahía - ARBA',
    tipo: 'subcategoria',
    subcategoriaId: '886b95de-5739-4a7f-ab37-4365a751224a',
  },
  {
    indice: 144,
    descripcion: 'Monotributo Nati',
    tipo: 'subcategoria',
    subcategoriaId: '46916604-b612-43fd-bf9c-61d83e178a34',
  },
  {
    indice: 145,
    descripcion: 'Patente',
    tipo: 'subcategoria',
    subcategoriaId: '8d18954a-a5de-40be-8515-5bcca231bb9c',
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
    subcategoriaId: '976cdbe2-71ba-4a3e-b66b-52d191f15b15',
  },
  {
    indice: 152,
    descripcion: 'Emilio',
    tipo: 'subcategoria',
    subcategoriaId: 'bb814ac0-ae30-481c-9164-71868798d737',
  },
  {
    indice: 153,
    descripcion: 'Otros',
    tipo: 'subcategoria',
    subcategoriaId: '5be3d25e-4f79-4416-bd9b-f7f0b485d9c3',
  },
];

export type GastoEstimadoItemDelMes = {
  estimado: number;
  real: number;
  gastoEstimadoDBId?: string;
  modificado?: boolean;
};

export type GastoEstimadoDB = {
  id?: string;
  subcategoriaId: string;
  monto: number;
  mes: number;
  anio: number;
};

export type GastoEstimadoAnual = {
  id: string;
  dbId: string | null;
  categoriaId?: string;
  descripcion: string;
  Enero?: GastoEstimadoItemDelMes;
  Febrero?: GastoEstimadoItemDelMes;
  Marzo?: GastoEstimadoItemDelMes;
  Abril?: GastoEstimadoItemDelMes;
  Mayo?: GastoEstimadoItemDelMes;
  Junio?: GastoEstimadoItemDelMes;
  Julio?: GastoEstimadoItemDelMes;
  Agosto?: GastoEstimadoItemDelMes;
  Septiembre?: GastoEstimadoItemDelMes;
  Octubre?: GastoEstimadoItemDelMes;
  Noviembre?: GastoEstimadoItemDelMes;
  Diciembre?: GastoEstimadoItemDelMes;
  [keyof: string]: number | string | Date | undefined | GastoEstimadoItemDelMes | null;
};

export type GastoEstimadoAnualUI = GastoEstimadoAnual & { colapsado?: boolean };

export type GastoEstimadoAnualGrupo = {
  groupId: string;
  esCategoria: boolean;
  elementos: GastoEstimadoAnual[];
};

export interface InfoFilaMovimientoGrupo {
  monto?: number;
  concepto?: CategoriaUIMovimiento;
  comentario?: string;
  id: string;
  esRestoDelMonto: boolean;
}

export interface GrupoMovimiento {
  dia: number;
  establecimiento?: string;
  tipoDePago?: TipoDeMovimientoGasto;
  totalMonto?: number;
  filas: InfoFilaMovimientoGrupo[];
}

export interface VencimientoUI {
  id: string;
  subcategoria: {
    id: string;
    descripcion: string;
  };
  fecha: Date;
  monto: number;
  esAnual: boolean;
  comentarios: string;
  estricto?: boolean;
  fechaConfirmada?: boolean;
  pago?: {
    id: string;
    monto: number;
    fecha: Date;
  };
}

export type TipoEventoSuenio = 'Despierto' | 'Dormido';

export interface EventoSuenio {
  id: string;
  hora: string;
  comentarios?: string;
  tipo: TipoEventoSuenio;
  tipoDeActualizacion?: 'nuevo' | 'modificado' | 'eliminado';
}

export interface AgendaTomiDia {
  id: string;
  fecha: Date;
  comentarios?: string;
  eventos: EventoSuenio[];
  esNuevo?: boolean;
}

export type ImportarSuenioTomiEvento = {
  tiempo: string;
  tipo: string;
};

export type ImportarSuenioTomiDia = {
  id: string;
  eventos: ImportarSuenioTomiEvento[];
};

export interface AnioYMes {
  anio: number;
  mes: string;
}

export interface SuenioTomiPorPeriodo {
  fecha: Date;
  horasDeSuenio: number;
}

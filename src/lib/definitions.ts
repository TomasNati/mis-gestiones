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

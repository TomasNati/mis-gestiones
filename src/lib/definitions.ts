export enum TipoDeGasto {
  Fijo = 'FIJO',
  Variable = 'VARIABLE',
}

export enum TipoDeMovimientoGasto {
  Credito = 'Crédito',
  Debito = 'Débito',
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
  comentarios?: string;
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

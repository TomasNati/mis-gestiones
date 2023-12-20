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

export type MovimientoGasto = {
  id: string;
  comentarios?: string;
  fecha: Date;
  subcategoria: Subcategoria;
  detalleSubcategoria?: DetalleSubcategoria;
  tipoDeGasto: TipoDeMovimientoGasto;
  monto: number;
};

export type MovimientoUI = {
  id?: string;
  comentarios?: string;
  fecha: Date;
  subcategoriaId: string;
  detalleSubcategoriaId?: string;
  tipoDeGasto: TipoDeMovimientoGasto;
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

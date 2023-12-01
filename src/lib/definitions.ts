export enum TipoDeGasto {
  Fijo = 'FIJO',
  Variable = 'VARIABLE',
}

export enum TipoDeMovimientoGasto {
  Credito = 'CREDITO',
  Debito = 'DEBITO',
  Efectivo = 'EFECTIVO',
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

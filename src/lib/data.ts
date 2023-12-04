// import { sql } from '@vercel/postgres';
import { Categoria, DetalleSubcategoria, Subcategoria } from './definitions';
import {
  categorias,
  detalleSubcategorias,
  subcategorias,
  movimientos,
} from './placeholder-data';

export const obtenerCategorias = (): Categoria[] => {
  // noStore();
  // try {
  //   const data = await sql<Categoria>`
  //   select * from  misgestiones.finanzas_categoria order by nombre asc`;

  //   const categorias = data.rows.map((categoria) => ({
  //     ...categoria,
  //   }));
  //   return categorias;
  // } catch (error) {
  //   console.error('Database Error:', error);
  //   throw new Error('Failed to fetch the latest invoices.');
  // }

  return categorias;
};

export const obtenerSubCategorias = (): Subcategoria[] => {
  return subcategorias;
};

export const obtenerDetalleSubCategorias = (): DetalleSubcategoria[] => {
  return detalleSubcategorias;
};

export const obtenerUltimosMovimientos = () => {
  return movimientos;
};

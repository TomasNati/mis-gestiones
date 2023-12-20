// import { sql } from '@vercel/postgres';
import { Categoria, CategoriaUIMovimiento, DetalleSubcategoria, MovimientoGasto, Subcategoria } from './definitions';
import { categorias, detalleSubcategorias, subcategorias, movimientos } from './placeholder-data';

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

export const obtenerSubCategorias = async (): Promise<Subcategoria[]> => {
  return Promise.resolve(subcategorias);
};

export const obtenerDetalleSubCategorias = async (): Promise<DetalleSubcategoria[]> => {
  return Promise.resolve(detalleSubcategorias);
};

export const obtenerCategoriasDeMovimientos = async (): Promise<CategoriaUIMovimiento[]> => {
  const [subcategorias, detalleSubcategorias] = await Promise.all([
    obtenerSubCategorias(),
    obtenerDetalleSubCategorias(),
  ]);

  const categoriasUIMovimiento: CategoriaUIMovimiento[] = [];

  subcategorias
    .filter(
      (subcategoria) =>
        !detalleSubcategorias.find((detalleSubcategoria) => detalleSubcategoria.subcategoria.id === subcategoria.id),
    )
    .forEach((subcategoria) => {
      categoriasUIMovimiento.push({
        id: subcategoria.id,
        nombre: subcategoria.nombre,
        subcategoriaId: subcategoria.id,
        categoriaNombre: subcategoria.categoria.nombre,
      });
    });

  detalleSubcategorias.forEach((detalleSubcategoria) => {
    categoriasUIMovimiento.push({
      id: detalleSubcategoria.id,
      nombre: `(${detalleSubcategoria.subcategoria.nombre}) ${detalleSubcategoria.nombre}`,
      subcategoriaId: detalleSubcategoria.subcategoria.id,
      detalleSubcategoriaId: detalleSubcategoria.id,
      categoriaNombre: detalleSubcategoria.subcategoria.categoria.nombre,
    });
  });

  return Promise.resolve(categoriasUIMovimiento);
};

export const obtenerUltimosMovimientos = () => {
  return movimientos;
};

export const obtenerMovimientosDelMes = async (fecha: Date): Promise<MovimientoGasto[]> => {
  console.log('fecha', fecha);
  return Promise.resolve(movimientos);
};

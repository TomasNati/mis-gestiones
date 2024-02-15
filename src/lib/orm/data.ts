import { db } from './database';
import { CategoriaDB, categorias } from './tables';

//DB test
//  const categorias = await obtenerCategorias();
// console.log(categorias);

export const obtenerCategorias = async (): Promise<CategoriaDB[]> => {
  const selectResult = await db.select().from(categorias);
  return selectResult;
};

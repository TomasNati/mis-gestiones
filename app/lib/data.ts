import { sql } from '@vercel/postgres';
import { Categoria } from './definitions';



export async function obtenerCategorias() {
    //noStore();
    try {
      const data = await sql<Categoria>`
      select * from  misgestiones.finanzas_categoria order by nombre asc`;
  
      const categorias = data.rows.map((categoria) => ({
        ...categoria,
      }));
      return categorias;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch the latest invoices.');
    }
  }

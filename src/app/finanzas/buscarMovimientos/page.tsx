'use client';

import {
  BuscarMovimientosPayload,
  BuscarMovimientosResponse,
  Categoria,
  CategoriaUIMovimiento,
} from '@/lib/definitions';
import { obtenerCategorias, obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { FiltrosMovimientos } from "@/components/FiltrosMovimientos";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { buscarMovimientos } from '@/lib/api';

const sortByNombre = (a: { nombre: string }, b: { nombre: string }) => {
  if (a.nombre < b.nombre) {
    return -1;
  } else if (a.nombre > b.nombre) {
    return 1;
  } else {
    return 0;
  }   
};

const BuscarMovimientos = () => {
  const [subcategorias, setSubcategorias] = useState<CategoriaUIMovimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [movimientosResponse, setMovimientosResponse] = useState<BuscarMovimientosResponse | null>(null);

  useEffect(() => {
      const fetchSubcategoriasAndCategorias = async () => {
        const promises = [obtenerCategoriasDeMovimientos(), obtenerCategorias()];
        const [subcategorias, categorias] = await Promise.all(promises);
        
        (subcategorias as CategoriaUIMovimiento[]).sort((a, b) => {
          if (a.categoriaNombre < b.categoriaNombre) {
            return -1;
          }
          if (a.categoriaNombre > b.categoriaNombre) {
            return 1;
          }
          return 0;
        });

        categorias.sort(sortByNombre);
        setSubcategorias(subcategorias as CategoriaUIMovimiento[]);
        setCategorias(categorias);
      };
  
      fetchSubcategoriasAndCategorias();
    }, []);

  const handleBuscar = async (payload: BuscarMovimientosPayload) => {
    try {
      const response = await buscarMovimientos(payload);
      setMovimientosResponse(response);
    } catch (err: any) {
      console.error('Error searching:', err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h2>Buscar Movimientos</h2>
      <FiltrosMovimientos subcategorias={subcategorias} categorias={categorias} onBuscar={handleBuscar} />
      {movimientosResponse && (
        <div>
          <h3>Resultados:</h3>
          {movimientosResponse.movimientos.length === 0 ? (
            <p>No se encontraron movimientos.</p>
          ) : (
            <div>
              <div>
                <strong>Total:</strong> {movimientosResponse.total} &nbsp;|&nbsp;
                <strong>Page:</strong> {movimientosResponse.page_number} &nbsp;|&nbsp;
                <strong>Page size:</strong> {movimientosResponse.page_size}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '4px' }}>Fecha</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '4px' }}>Monto</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '4px' }}>Tipo de Gasto</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '4px' }}>Subcategoría</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '4px' }}>Categoría</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '4px' }}>Comentarios</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosResponse.movimientos.map((mov) => (
                    <tr key={mov.id}>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>
                        {new Date(mov.fecha).toLocaleString()}
                      </td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>${mov.monto}</td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>{mov.tipoDeGasto}</td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>
                        {mov.subcategoria?.nombre || mov.subcategoria?.id}
                      </td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>
                        {mov.subcategoria?.categoria?.nombre || mov.subcategoria?.categoria?.id}
                      </td>
                      <td style={{ padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>{mov.comentarios || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </LocalizationProvider>
  );

}

export default BuscarMovimientos;

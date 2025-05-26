'use client';

import { BuscarVencimientosPayload, Subcategoria, TipoDeGasto, VencimientoUI } from '@/lib/definitions';
import { formatDate } from '@/lib/helpers';
import { obtenerSubCategorias, obtenerVencimientos } from '@/lib/orm/data';
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { FilterComponent } from '@/components/vencimientos/Filtros/Filtros';
import { ButtonBar } from '@/components/vencimientos/ButtonBar/ButtonBar';
import { AgregarEditarModal } from '@/components/vencimientos/AgregarEditarModal/AgregarEditarModal';
import { persistirVencimiento } from '@/lib/orm/actions';

const Vencimientos = () => {
  const [vencimientos, setVencimientos] = useState<VencimientoUI[]>([]);
  const [tiposDeVencimientos, setTiposDeVencimientos] = useState<Subcategoria[]>([]);
  const [showAgregarEditarModal, setShowAgregarEditarModal] = useState(false);

  
  useEffect(() => {
    const fetchTiposDeVencimientos = async () => {
      const subcategorias = await obtenerSubCategorias(TipoDeGasto.Fijo);
      //sort subcategorias by categoria
      subcategorias.sort((a, b) => {
        if (a.nombre < b.nombre) {
          return -1;
        }
        if (a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });
      setTiposDeVencimientos(subcategorias);
    };
    fetchTiposDeVencimientos();
  }, []);

  const toggleOpenAgregarEditar = () => setShowAgregarEditarModal(!showAgregarEditarModal);

  const handleGuardarMovimiento = async (vencimiento: VencimientoUI) => {
    const result = await persistirVencimiento(vencimiento);
    console.log('Resultado de persistir vencimiento:', result);
    setShowAgregarEditarModal(false);
  };

  const handleBuscarVencimientos = async (payload: BuscarVencimientosPayload) => {
    const vencimientosObtenidos = await obtenerVencimientos(payload);
    setVencimientos(vencimientosObtenidos);
  };

  const mostrarInformacion = true;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <FilterComponent tiposDeVencimientos={tiposDeVencimientos} onBuscar={handleBuscarVencimientos} />
        <ButtonBar onAdd={toggleOpenAgregarEditar} />
        {mostrarInformacion && (
          <Box sx={{ height: '100%' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell>Descripción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vencimientos.map(({ fecha, subcategoria, id }) => (
                    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{formatDate(fecha)}</TableCell>
                      <TableCell>{subcategoria.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {showAgregarEditarModal ? (
          <AgregarEditarModal
            tiposDeVencimiento={tiposDeVencimientos}
            onClose={toggleOpenAgregarEditar}
            onGuardar={handleGuardarMovimiento}
            open={showAgregarEditarModal}
          />
        ) : null}
      </Box>
    </LocalizationProvider>
  );
};
export default Vencimientos;

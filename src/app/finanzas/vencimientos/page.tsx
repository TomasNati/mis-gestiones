'use client';

import { BuscarVencimientosPayload, Subcategoria, TipoDeGasto, VencimientoUI } from '@/lib/definitions';
import { formatDate, transformNumberToCurrenty } from '@/lib/helpers';
import { obtenerSubCategorias, obtenerVencimientos } from '@/lib/orm/data';
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { FilterComponent } from '@/components/vencimientos/Filtros/Filtros';
import { ButtonBar } from '@/components/vencimientos/ButtonBar/ButtonBar';
import { AgregarEditarModal } from '@/components/vencimientos/AgregarEditarModal/AgregarEditarModal';
import { persistirVencimiento } from '@/lib/orm/actions';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'subcategoria',
    headerName: 'Subcategoría',
    width: 250,
    valueGetter: (row: { descripcion: string }) => row.descripcion,
  },
  {
    field: 'fecha',
    headerName: 'Fecha',
    width: 150,
    valueGetter: (fecha: Date) => formatDate(fecha, false, { timeZone: 'UTC' }),
  },
  {
    field: 'monto',
    headerName: 'Monto',
    width: 150,
    type: 'number',
    valueGetter: (monto: number) => transformNumberToCurrenty(monto),
  },
  {
    field: 'esAnual',
    headerName: 'Es Anual',
    width: 100,
    type: 'boolean',
    valueGetter: (esAnual: boolean) => esAnual,
  },
  {
    field: 'estricto',
    headerName: 'Estricto',
    width: 100,
    type: 'boolean',
    valueGetter: (estricto: boolean) => estricto,
  },
];

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
    console.log('Vencimientos obtenidos:', vencimientosObtenidos);
    setVencimientos(vencimientosObtenidos);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <FilterComponent tiposDeVencimientos={tiposDeVencimientos} onBuscar={handleBuscarVencimientos} />
        <ButtonBar onAdd={toggleOpenAgregarEditar} />
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={vencimientos}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            pageSizeOptions={[50, 100, 200]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
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

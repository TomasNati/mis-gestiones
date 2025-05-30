'use client';

import { BuscarVencimientosPayload, Subcategoria, TipoDeGasto, VencimientoUI } from '@/lib/definitions';
import { obtenerSubCategorias, obtenerVencimientos } from '@/lib/orm/data';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { FilterComponent } from '@/components/vencimientos/Filtros/Filtros';
import { AgregarEditarModal } from '@/components/vencimientos/AgregarEditarModal/AgregarEditarModal';
import { persistirVencimiento } from '@/lib/orm/actions';
import { Box } from '@mui/material';
import { VencimientosGrilla } from '@/components/vencimientos/VencimientoGrilla/VencimientoGrilla';

const Vencimientos = () => {
  const [vencimientos, setVencimientos] = useState<VencimientoUI[]>([]);
  const [tiposDeVencimientos, setTiposDeVencimientos] = useState<Subcategoria[]>([]);
  const [showAgregarEditarModal, setShowAgregarEditarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const vencimientosObtenidos = await obtenerVencimientos(payload);
    console.log('Vencimientos obtenidos:', vencimientosObtenidos);
    setVencimientos(vencimientosObtenidos);
    setIsLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display={'flex'} flexDirection="column" gap={2} padding={2}>
        <FilterComponent tiposDeVencimientos={tiposDeVencimientos} onBuscar={handleBuscarVencimientos} />
        <VencimientosGrilla
          vencimientos={vencimientos}
          isLoading={isLoading}
          onEdit={toggleOpenAgregarEditar}
          onDelete={() => {}}
          onAdd={toggleOpenAgregarEditar}
          onCopy={() => {}}
        />
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

'use client';
import { styles } from './AgregarMovimiento.styles';
import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { crearMovimientos } from '@/lib/actions';
import { obtenerCategoriasDeMovimientos } from '@/lib/data';
import { CategoriaUIMovimiento, MovimientoUI } from '@/lib/definitions';
import { Add } from '@mui/icons-material';
import { FilaMovimiento } from './FilaMovimiento';
import { useRouter } from 'next/navigation';

const movimientoVacio: MovimientoUI = {
  fecha: new Date(),
  monto: 0,
  subcategoriaId: '',
  valido: false,
  filaId: 0,
};

const nuevosMovimientosDefault = [1, 2, 3, 4, 5].map((id) => ({ ...movimientoVacio, filaId: id }));

const AgregarMovimientos = () => {
  const [nuevosMovimientos, setNuevosMovimientos] = useState(nuevosMovimientosDefault);
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);
  const [agregarMovimientos, setAgregarMovimientos] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const fetchConceptos = async () => {
      const categoriasMovimiento = await obtenerCategoriasDeMovimientos();
      //sort subcategorias by categoria
      categoriasMovimiento.sort((a, b) => {
        if (a.categoriaNombre < b.categoriaNombre) {
          return -1;
        }
        if (a.categoriaNombre > b.categoriaNombre) {
          return 1;
        }
        return 0;
      });
      setCategoriasMovimiento(categoriasMovimiento);
    };
    fetchConceptos();
  }, []);

  useEffect(() => {
    const agregarMovimientosNuevos = async () => {
      const movimientosValidos = nuevosMovimientos.filter((n) => n.valido);
      if (agregarMovimientos && movimientosValidos.length > 0) {
        const resultado = await crearMovimientos(movimientosValidos);
        console.log(resultado);
        setAgregarMovimientos(false);
        push('/finanzas/movimientosDelMes');
      }
    };
    agregarMovimientosNuevos();
  }, [agregarMovimientos]);

  const onNuevaFila = () => {
    const maxNumber = nuevosMovimientos.length == 0 ? 0 : Math.max(...nuevosMovimientos.map((n) => n.filaId));
    setNuevosMovimientos([...nuevosMovimientos, { ...movimientoVacio, filaId: maxNumber + 1 }]);
  };

  const onEliminarFila = (filaId: number) => {
    setNuevosMovimientos(nuevosMovimientos.filter((n) => n.filaId !== filaId));
  };

  const onFilaActualizada = (movimiento: MovimientoUI) => {
    const movimientoAActualizar = nuevosMovimientos.find((n) => n.filaId === movimiento.filaId);
    if (!movimientoAActualizar) return;
    Object.assign(movimientoAActualizar, movimiento);
    setNuevosMovimientos(nuevosMovimientos);
  };

  return (
    <Box sx={styles.container}>
      <IconButton onClick={() => onNuevaFila()} sx={styles.iconButton} color="secondary">
        <Add />
      </IconButton>
      {nuevosMovimientos.map((movimiento) => (
        <FilaMovimiento
          key={movimiento.filaId}
          movimientoVacio={movimiento}
          eliminarFila={onEliminarFila}
          categoriasMovimiento={categoriasMovimiento}
          filaActualizada={onFilaActualizada}
        />
      ))}
      <Button variant="contained" color="secondary" onClick={() => setAgregarMovimientos(true)}>
        Agregar
      </Button>
    </Box>
  );
};

export { AgregarMovimientos };

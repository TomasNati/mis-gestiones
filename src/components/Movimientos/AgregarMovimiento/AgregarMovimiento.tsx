'use client';
import { styles } from './AgregarMovimiento.styles';
import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';

import { crearMovimiento } from '@/lib/actions';
import { obtenerCategoriasDeMovimientos } from '@/lib/data';
import { CategoriaUIMovimiento } from '@/lib/definitions';
import { Add } from '@mui/icons-material';
import { FilaMovimiento } from './FilaMovimiento';

const AgregarMovimientos = () => {
  const [nuevosMovimientos, setNuevosMovimientos] = useState([1, 2, 3, 4, 5]);
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);

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

  const onNuevaFila = () => {
    const maxNumber = nuevosMovimientos.length == 0 ? 0 : Math.max(...nuevosMovimientos);
    setNuevosMovimientos([...nuevosMovimientos, maxNumber + 1]);
  };

  const onEliminarFila = (id: number) => {
    setNuevosMovimientos(nuevosMovimientos.filter((n) => n !== id));
  };

  return (
    <Box sx={styles.container}>
      <IconButton onClick={() => onNuevaFila()} sx={styles.iconButton} color="secondary">
        <Add />
      </IconButton>
      {nuevosMovimientos.map((id) => (
        <FilaMovimiento key={id} id={id} eliminarFila={onEliminarFila} categoriasMovimiento={categoriasMovimiento} />
      ))}
      <Button variant="contained" color="secondary">
        Agregar
      </Button>
    </Box>
  );
};

export { AgregarMovimientos };

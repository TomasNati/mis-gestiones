'use client';
import { styles } from './AgregarMovimiento.styles';
import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, IconButton, Snackbar } from '@mui/material';
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

type ConfiguracionNotificacion = {
  open: boolean;
  severity: 'success' | 'info' | 'warning' | 'error';
  mensaje: string;
};

const AgregarMovimientos = () => {
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });
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
        if (!resultado.exitoso) {
          setConfigNotificacion({
            open: true,
            severity: 'error',
            mensaje: resultado.errores.join('\n'),
          });
        } else {
          push('/finanzas/movimientosDelMes');
        }
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

  const onOcultarMensaje = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setConfigNotificacion({ ...configNotificacion, open: false });
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
      <Snackbar
        open={configNotificacion.open}
        autoHideDuration={6000}
        onClose={onOcultarMensaje}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={onOcultarMensaje}
          severity={configNotificacion.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {configNotificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export { AgregarMovimientos };

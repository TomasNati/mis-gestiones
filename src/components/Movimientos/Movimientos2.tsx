import { CategoriaUIMovimiento, MovimientoGastoGrilla, TipoDeMovimientoGasto } from '@/lib/definitions';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridEditSingleSelectCellProps,
  GridRenderCellParams,
  GridSingleSelectColDef,
  GridValueFormatterParams,
  useGridApiContext,
  GridEditCellProps,
} from '@mui/x-data-grid';
import { TipoDePagoEdicion, TipoDePagoVista } from './editores/TipoDePago/TipoDePago';
import { Concepto } from './editores/Concepto/Concepto';
import { useEffect, useState } from 'react';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';

const TipoDePagoEditInputCell = (props: GridRenderCellParams<any, TipoDeMovimientoGasto>) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (newValue: TipoDeMovimientoGasto) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      <TipoDePagoEdicion onTipoDePagoChange={handleChange} tipoDepagoInicial={value as TipoDeMovimientoGasto} />
    </Box>
  );
};

// const ConceptoEditInputCell = (props: GridEditSingleSelectCellProps) => {
//   const { id, value, field } = props;
//   const apiRef = useGridApiContext();

//   const handleChange = (newValue: CategoriaUIMovimiento) => {
//     apiRef.current.setEditCellValue({ id, field, value: newValue });
//   };

//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
//       <Concepto
//         onConceptoModificado={handleChange}
//         conceptoInicial={value}
//         categoriasMovimiento={props.colDef.valueOptions as CategoriaUIMovimiento[]}
//       />
//     </Box>
//   );
// };

const renderTipoDePagoEditInputCell: GridColDef['renderCell'] = (params) => {
  return <TipoDePagoEditInputCell {...params} />;
};

// const renderConceptoEditInputCell: GridSingleSelectColDef['renderCell'] = (params) => {
//   console.log(params);
//   return <ConceptoEditInputCell {...params} categoriasMovimiento={params.colDef.valueOptions} />;
// };

// function CustomTypeEditComponent(props: GridEditSingleSelectCellProps) {
//   const apiRef = useGridApiContext();

//    const handleChange = (newValue: CategoriaUIMovimiento) => {
//      apiRef.current.setEditCellValue({
//       id: props.id,
//       field: props.field,
//       value: newValue
//     });
//    };

//   return <GridEditSingleSelectCell onValueChange={handleValueChange} {...props} />;
// }

const renderTipoDePago = (params: GridRenderCellParams<any, TipoDeMovimientoGasto>) => {
  return <TipoDePagoVista tipoDePago={params.value as TipoDeMovimientoGasto} />;
};

const Movimientos2 = ({ movimientos }: { movimientos: MovimientoGastoGrilla[] }) => {
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

  const columns: GridColDef[] = [
    {
      field: 'fecha',
      headerName: 'Fecha',
      type: 'date',
      valueFormatter: (params: GridValueFormatterParams<Date>) => params.value.getDate(),
      width: 100,
      editable: true,
    },
    /*
    // valueOptions: categoriasMovimiento,
    type: 'singleSelect',
    */
    {
      field: 'concepto',
      headerName: 'Concepto',
      width: 250,
      renderEditCell: (params: GridEditCellProps) => (
        <Concepto
          categoriasMovimiento={categoriasMovimiento}
          conceptoInicial={params.value}
          onConceptoModificado={(nuevoConcepto) =>
            params.api?.setEditCellValue({ id: params.id, field: params.field, value: nuevoConcepto })
          }
        />
      ),
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<CategoriaUIMovimiento>) => params.value.nombre,
    },
    {
      field: 'tipoDeGasto',
      headerName: 'Tipo De Pago',
      width: 130,
      renderEditCell: renderTipoDePagoEditInputCell,
      renderCell: renderTipoDePago,
      editable: true,
    },
    {
      field: 'monto',
      headerName: 'Monto',
      type: 'number',
      editable: true,
      width: 120,
      valueFormatter: (params) => params.value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
    },
    {
      field: 'comentarios',
      headerName: 'Detalle',
      editable: true,
      flex: 1,
    },
  ];

  const onMovimientoActualizado = (movimiento: MovimientoGastoGrilla) => {
    console.log('Movimiento actualizado', movimiento);
    return movimiento;
  };

  const handleProcesarMovimientoUpdateError = (params: any) => {
    console.error('Error al actualizar el movimiento', params);
  };

  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 253px)',
          },
        }}
        rows={movimientos}
        columns={columns}
        density="compact"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[100]}
        checkboxSelection
        disableRowSelectionOnClick
        editMode="row"
        processRowUpdate={(updatedRow, _originalrow) => onMovimientoActualizado(updatedRow)}
        onProcessRowUpdateError={handleProcesarMovimientoUpdateError}
      />
    </Box>
  );
};

export { Movimientos2 };

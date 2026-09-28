# comprobantes-pago
Repositorio para guardar comprobantes de pago
Objetivo: Permitir subir y descargar comprobantes de pago asociados a un vencimiento. Los archivos se almacenarán en un repositorio de github.

# Diseño
## Subir comprobantes de pago

1. En la tabla que guarda los pagos hechos para vencimientos, agregar un campo 'path' que guarde la ruta del archivo del comprobante de pago.
   Indica la subcarpeta principal donde estarán todos los comprobantes, como `edese` o `departamento-marcos-paz/EDET`
2. Crear una nueva tabla: `finanzas_comprobante_pago`, que guarde los comprobantes de pago asociados a un vencimiento. Campos:
   - id
   - vencimiento_id (FK a la tabla vencimiento)
   - subpath (string) #Camino del archivo dentro del path principal. Por ejemplo: `2024/06-comprobante.pdf` 
   - active (boolean)

Revisar esto:

2. La UI permitirá elegir uno o más archivo al momento de registrar el pago de un vencimiento, y opcionalmente agregar un comentario para su nombre
   >> No se debería permitir subrir un archivo si no se ha registrado el pago del vencimiento.
   >> Max size para los archivos: configurable por variable de ambiente `MAX_UPLOAD_BYTES` (en bytes), con default **2MB (2000000)** y tope duro de **4MB (4000000)**: si se configura un valor mayor, se usa 4MB. El límite se aplica también a la descarga, y la UI lo toma del backend para validar antes de subir.
3. Por cada archivo elegido, 
    * Sea path = vencimiento.subcategoria.comprobantes_path
    * subpath = `{año}/{mes}{-comentario}.{extensión}` 
      > el sufijo con el comentario no se agrega si se sube un solo archivo, y el comentario está vacío

    a. Se subirá el archivo al `path/subpath` generado
    b. se generará un registro en la tabla `finanzas_comprobante_pago` con el subpath generado y el vencimiento asociado.


## Descargar comprobantes de pago
1. En la grilla de vencimientos
  a. Si hay un solo comprobante de pago, se mostrará un ícono de descarga al lado del vencimiento.
  b. Si hay más de un comprobante de pago, se mostrará un ícono para abrir un modal que muestre la lista de comprobantes de pago asociados al vencimiento, con la opción de descargar cada uno.
2. En la edición:
   a. Para cada comprobante, se podrá:
      * Descargar el archivo
      * Eliminar el comprobante (y el registro en la tabla `finanzas_comprobante_pago`).
      * Agregar/modificar el comentario. Esto debería cambiar el nombre del archivo en el storage, y actualizar el subpath en la tabla `finanzas_comprobante_pago`.
      * Subir nuevos comprobantes

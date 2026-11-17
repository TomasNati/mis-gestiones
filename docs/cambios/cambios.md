# Cambios para Inversiones

> **Estado:** base de datos, backend y admin listos. Queda pendiente el frontend. El detalle por paso está en `estado.md`.

## Objetivos

a. Agregar a los Instrumentos un nuevo campo: `nombreCorto`. Se usará en la UI en los lugares donde actualmente se muestra el código.

b. Permitir filtrar inversiones históricas por `instrumento.moneda`.

## Pasos

### a. Base de datos ✅

Crear script para la nueva columna. Es obligatoria. Inicializar con el valor actual de `codigo`.

**Estado:** ejecutados `05_instrumento_nombre_corto.sql` y `06_instrumento_nombre_corto_not_null.sql`. La columna `nombre_corto` existe y es `NOT NULL`.

### b. mis-gestiones-backend ✅

1. Extender los endpoints de creación y edición para manejar el nuevo campo.
2. Extender los endpoints que buscan y retornan instrumentos para retornar el nuevo campo. Cualquier endpoint que retorna `instrumento.nombre` debe retornar también `instrumento.nombreCorto`.
3. Modificar el endpoint `/api/inversiones/inversiones-historico` para poder recibir `instrumento.moneda` como otro parámetro opcional.

**Estado:** listo. Los esquemas exponen `nombreCorto` (aceptan también `nombre_corto`), la creación/edición persisten el valor y el histórico filtra por moneda.

### c. mis-gestiones-admin ✅

1. Modificar la grilla de instrumento para mostrar el nombre corto.
2. Modificar el modal de creación/edición para manejar el nuevo campo.

**Estado:** listo. La grilla incluye la columna "Nombre corto" (mantiene "Código") y el modal permite cargarlo y enviarlo al backend.

### d. mis-gestiones

1. Modificar la pantalla de Inversiones para mostrar `instrumento.nombreCorto` donde se mostraba `instrumento.codigo`. La búsqueda de precios tiene que continuar usando el código; este cambio es solo visual.
2. En los filtros de la grilla, poder filtrar por tipo de moneda.
3. Cuando se aplican los filtros al gráfico *Evolución del total*, pasar también el tipo de moneda.

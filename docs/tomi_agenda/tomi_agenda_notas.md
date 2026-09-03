# Tomi Agenda — Notas

> Cuando agregue o modifique filas, que los gráficos de arriba se actualicen bien.
>
> Mejorar los comentarios agregando eventos (Cambio medicación - Crisis - etc). Que eso se pueda ver fácilmente, y que permita buscar por tipo de evento.

## Objetivo

`tomiagenda_eventosuenio` permite agregar comentarios. Me interesa poder categorizarlos, para poder verlos y buscarlos en el futuro.

## Pasos

1. ✅ **Definir tabla para los tipos de notas: `tomiagenda_tiposnota`:** `id`, `tipo: varchar(255)`, `active: boolean`
   - a. La razón de tener una tabla aparte es mostrar en la UI, en un dropdown, los tipos de nota disponibles, pero permitir escribir nuevos, y que se guarden en esta tabla. El dropdown también debería poder borrar lógicamente elementos.
   - b. Los registros eliminados lógicamente se mostrarían en edición (con otro color), pero no podrían usarse para generar notas nuevas.
   - c. Valores iniciales:
     - `General`
     - `Orina`
     - `Cambio de medicación`
     - `Crisis`
     - `Malhumor`

2. **Backfill script:**
   - a. ✅ Buscar eventos sueños con comentarios y generar una `_nota` con tipo `General` y `_nota.comentario: eventosuenio.comentario`, asociada al `tomiagenda_dia` del evento sueño (`eventosuenio.dia`).
   - b. También poner `eventosuenio.comentario = null`. Esto lo ejecutaré en una segunda etapa, cuando confirme que `_nota` tiene los datos bien cargados.

3. ✅ **Definir tabla para las notas: `tomiagenda_nota`:**
   - a. `id`, `active`
   - b. `tiposnota_id`
   - c. `dia_id` → FK a `tomiagenda_dia`
   - d. `comentarios`
   

## Cambios de UI

4. **El tooltip actual que muestra `eventosuenio.comentario` debería mejorarse:**
   - a. Mostrar una línea por cada `_nota` asociado: primeras dos letras del tipo de nota + comentario. Por ejemplo: `"[Ge] Se levantó solo"`. El prefijo para el tipo de nota debería estar recuadrado y con un color diferente para cada tipo. Hardcodear colores para los valores iniciales de tipos de nota. Si luego un tipo de nota no tiene un color asignado por defecto, se le asigna uno al azar. Después mejoraré eso.
   - b. El modal de Evento Sueño tiene que permitir agregar múltiples Notas. Cada una, por defecto con tipo `General` y un textbox para comentarios. Se pueden agregar notas de diferentes tipos, incluso múltiples notas para el mismo tipo.

## Paso Final
5. Actualizar `mis-gestiones\docs\ECOSYSTEM_OVERVIEW.md` con los cambios a nivel de base de datos y UI. Esto es para que quede documentado y no se pierda el conocimiento.

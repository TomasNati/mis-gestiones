import { InferSelectModel } from 'drizzle-orm';
import { text, uuid, varchar, boolean, pgSchema, numeric, timestamp, time } from 'drizzle-orm/pg-core';
import { generateUUID } from '../helpers';

export const misgestiones = pgSchema('misgestiones');

export const categorias = misgestiones.table('finanzas_categoria', {
  id: uuid('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  comentarios: text('comentarios'),
  active: boolean('active').notNull().default(true),
});

export type CategoriaDB = InferSelectModel<typeof categorias>;

export const subcategorias = misgestiones.table('finanzas_subcategoria', {
  id: uuid('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  comentarios: text('comentarios'),
  categoria: uuid('categoria')
    .references(() => categorias.id)
    .notNull(),
  tipoDeGasto: varchar('tipodegasto', { length: 255 }).notNull(),
  active: boolean('active').notNull().default(true),
});

export type SubcategoriaDB = InferSelectModel<typeof subcategorias>;

export const detalleSubcategorias = misgestiones.table('finanzas_detallesubcategoria', {
  id: uuid('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  subcategoria: uuid('subcategoria')
    .references(() => subcategorias.id)
    .notNull(),
  comentarios: text('comentarios'),
  active: boolean('active').notNull().default(true),
});

export type DetalleSubcategoriaDB = InferSelectModel<typeof detalleSubcategorias>;

export const movimientosGasto = misgestiones.table('finanzas_movimientogasto', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  fecha: timestamp('fecha', { withTimezone: false }).notNull(),
  subcategoria: uuid('subcategoria')
    .references(() => subcategorias.id)
    .notNull(),
  detallesubcategoria: uuid('detallesubcategoria').references(() => detalleSubcategorias.id),
  tipodepago: varchar('tipodepago', { length: 255 }).notNull(),
  monto: numeric('monto', { precision: 12, scale: 2 }).notNull(),
  comentarios: text('comentarios'),
  active: boolean('active').notNull().default(true),
});

export type MovimientoGastoDB = InferSelectModel<typeof movimientosGasto>;

export const vencimiento = misgestiones.table('finanzas_vencimiento', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  subcategoria: uuid('subcategoria')
    .references(() => subcategorias.id)
    .notNull(),
  fecha: timestamp('fecha', { withTimezone: false }).notNull(),
  monto: numeric('monto', { precision: 12, scale: 2 }).notNull(),
  esAnual: boolean('esanual').notNull().default(false),
  comentarios: text('comentarios'),
  active: boolean('active').notNull().default(true),
  estricto: boolean('estricto').default(false),
  fechaConfirmada: boolean('fechaconfirmada').default(false),
  //if exists, indicates that the vencimiento was paid
  pago: uuid('pago').references(() => movimientosGasto.id),
});
export type VencimientoDB = InferSelectModel<typeof vencimiento>;
export type VencimientoAInsertarDB = Omit<VencimientoDB, 'id' | 'active'>;

export const gastoEstimado = misgestiones.table('finanzas_gastoestimado', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  subcategoria: uuid('subcategoria')
    .references(() => subcategorias.id)
    .notNull(),
  fecha: timestamp('fecha', { withTimezone: false }).notNull(),
  monto: numeric('monto', { precision: 12, scale: 2 }).notNull(),
  comentarios: text('comentarios'),
  active: boolean('active').notNull().default(true),
});

export type GastoEstimadoDB = InferSelectModel<typeof gastoEstimado>;
export type GastoEstimadoAInsertarDB = Omit<GastoEstimadoDB, 'id' | 'active'>;

export const tomiAgendaDia = misgestiones.table('tomiagenda_dia', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  fecha: timestamp('fecha', { withTimezone: false }).notNull(),
  comentarios: text('comentarios'),
  active: boolean('active').notNull().default(true),
});
export type TomiAgendaDiaDB = InferSelectModel<typeof tomiAgendaDia>;

export const tomiAgendaEventoSuenio = misgestiones.table('tomiagenda_eventosuenio', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  dia: uuid('dia')
    .references(() => tomiAgendaDia.id)
    .notNull(),
  hora: time('hora', { withTimezone: false }).notNull(),
  tipo: varchar('tipo', { length: 255 }).notNull(),
  comentarios: text('comentarios'),
  active: boolean('active').notNull().default(true),
});
export type TomiAgendaEventoSuenioDB = InferSelectModel<typeof tomiAgendaEventoSuenio>;

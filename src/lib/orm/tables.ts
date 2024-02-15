import { InferSelectModel } from 'drizzle-orm';
import { text, uuid, varchar, boolean, pgSchema, numeric, timestamp } from 'drizzle-orm/pg-core';

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
  id: uuid('id').primaryKey(),
  fecha: timestamp('fecha', { withTimezone: true }).notNull(),
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

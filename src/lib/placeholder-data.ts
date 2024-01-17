import {
  Categoria,
  DetalleSubcategoria,
  MovimientoGasto,
  Subcategoria,
  TipoDeGasto,
  TipoDeMovimientoGasto,
} from './definitions';

export const categorias: Categoria[] = [
  {
    nombre: 'Educación',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6A',
  },
  {
    nombre: 'Hijos',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B',
  },
  {
    nombre: 'Entretenimiento',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C',
  },
  {
    nombre: 'Diario',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D',
  },
  {
    nombre: 'Regalos',
    id: '3F2504E0-4F89-11D3-9A0C-0305E82C3301',
  },
  {
    nombre: 'Salud',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E',
  },
  {
    nombre: 'Hogar',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F',
  },
  {
    nombre: 'Seguros',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60',
  },
  {
    nombre: 'Tecnologia',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D61',
  },
  {
    nombre: 'Transporte',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62',
  },
  {
    nombre: 'Viajes',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63',
  },
  {
    nombre: 'Servicios',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64',
  },
  {
    nombre: 'Other',
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D65',
  },
];

export const subcategorias: Subcategoria[] = [
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6A',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Actividades',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Medicamentos',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Higiene',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Ropa',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Colegio-Extras',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Juguetes',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Deportes y juegos',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D61',
    categoria: categorias[1], // Hijos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otros',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62',
    categoria: categorias[0], // Educación
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Cursos',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63',
    categoria: categorias[0], // Educación
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Colegio',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64',
    categoria: categorias[0], // Educación
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Materiales escuela',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D65',
    categoria: categorias[0], // Educación
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otros',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D66',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Lawn Tennis',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D67',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'TIC',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D68',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Readers & Digest',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D69',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'HBO Max',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E970',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Netflix',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F1F1E970',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Disney+',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F2F1E970',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Libros',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F3F1E970',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Deporte',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F4F1E970',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Teatro',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F5F1E970',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Spotify',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F6F1E970',
    categoria: categorias[2], // Entretenimiento
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otros',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F7F1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Comida',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F8F1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Restaurants',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F9F1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Productos personales',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Ropa',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Supermercado',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FCF1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Peluqueria/Belleza',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FDF1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Alcohol',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FEF1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Gaseosas',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FFF1E970',
    categoria: categorias[3], // Diario
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otras',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E971',
    categoria: categorias[4], // Regalos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Regalos',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E972',
    categoria: categorias[4], // Regalos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Donaciones',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E973',
    categoria: categorias[4], // Regalos
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otras',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E974',
    categoria: categorias[5], // Salud
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Doctores',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E975',
    categoria: categorias[5], // Salud
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Maestra de apoyo',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E976',
    categoria: categorias[5], // Salud
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Farmacia',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E977',
    categoria: categorias[5], // Salud
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Psicologos',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E978',
    categoria: categorias[5], // Salud
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Lentes - Óptica',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E979',
    categoria: categorias[5], // Salud
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Terapia ocupacional',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E979',
    categoria: categorias[5], // Salud
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otro',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Aportes Claudia',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F1F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Sueldo Claudia',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F2F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Extras Claudia',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F3F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Muebles',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F4F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Jardin',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F5F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Cosas para la casa',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F6F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Mantenimiento',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F7F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Mejora',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F8F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Mudanza',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F9F1E97A',
    categoria: categorias[6], // Hogar
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otras',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E97B',
    categoria: categorias[7], // Seguros
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Auto',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E97B',
    categoria: categorias[7], // Seguros
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Salud',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E97B',
    categoria: categorias[7], // Seguros
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Hogar',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FCF1E97B',
    categoria: categorias[7], // Seguros
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Vida',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FDF1E97B',
    categoria: categorias[7], // Seguros
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otro',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E97C',
    categoria: categorias[8], // Tecnologia
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Hardware',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E97C',
    categoria: categorias[8], // Tecnologia
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Software',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E97C',
    categoria: categorias[8], // Tecnologia
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otros',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E97D',
    categoria: categorias[9], // Transporte
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Nafta',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E97D',
    categoria: categorias[9], // Transporte
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Patente auto',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E97D',
    categoria: categorias[9], // Transporte
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Taller',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FCF1E97D',
    categoria: categorias[9], // Transporte
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'VTV',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FDF1E97D',
    categoria: categorias[9], // Transporte
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Cosas para el auto',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FEF1E97D',
    categoria: categorias[9], // Transporte
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Taxi',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FFF1E97D',
    categoria: categorias[9], // Transporte
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Transporte Publico',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E97E',
    categoria: categorias[10], // Viajes
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Avion',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E97E',
    categoria: categorias[10], // Viajes
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Hoteles',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E97E',
    categoria: categorias[10], // Viajes
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Comida',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FCF1E97E',
    categoria: categorias[10], // Viajes
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Transporte',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FDF1E97E',
    categoria: categorias[10], // Viajes
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Entretenimiento',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FEF1E97E',
    categoria: categorias[10], // Viajes
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otros',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E97F',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Aguas de Santiago',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E97F',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Cablevision',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E97F',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Contadora',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FCF1E97F',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Personal',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FDF1E97F',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Edese',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FEF1E97F',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Gasnor',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FFF1E97F',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Santiago - Inmobiliario municipal',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E980',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Santiago - Rentas provincial',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E980',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Dto. Tuc-Cór - SAT',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E980',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Dto. Tuc-Cór - Gasnor',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FCF1E980',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Dto. Tuc-Cór - Edet',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FDF1E980',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Dto. Tuc-Cór - DGR',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FEF1E980',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Dto. Tuc-Cór - CISI',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FFF1E980',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Dto. Tuc-Mar - DGR',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E981',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Bahía - ABSA',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E981',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Bahía - Municipal',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E981',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Bahía - ARBA',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FCF1E981',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Fijo,
    nombre: 'Monotributo Nati',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FDF1E981',
    categoria: categorias[11], // Servicios
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Other',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E982',
    categoria: categorias[12], // Other
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Cripto',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FAF1E982',
    categoria: categorias[12], // Other
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Emilio',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2FBF1E982',
    categoria: categorias[12], // Other
    tipoDeGasto: TipoDeGasto.Variable,
    nombre: 'Otros',
  },
];

export const detalleSubcategorias: DetalleSubcategoria[] = [
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E982',
    subcategoria: subcategorias[4],
    nombre: 'Kiosco',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F1F1E982',
    subcategoria: subcategorias[4],
    nombre: 'Extras',
  },
];

export const movimientos: MovimientoGasto[] = [
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E982',
    fecha: new Date(2023, 11, 2),
    monto: 19880.36,
    subcategoria: subcategorias.find((c) => c.nombre == 'Comida') || subcategorias[0],
    tipoDeGasto: TipoDeMovimientoGasto.Debito,
    comentarios: 'Vea',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E983',
    fecha: new Date(2023, 11, 2),
    monto: 1738.6,
    subcategoria: subcategorias.find((c) => c.nombre == 'Gaseosas') || subcategorias[0],
    tipoDeGasto: TipoDeMovimientoGasto.Debito,
    comentarios: 'Vea',
  },
  {
    id: 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E984',
    fecha: new Date(2023, 11, 1),
    monto: 5090.03,
    subcategoria: subcategorias.find((c) => c.nombre == 'Aguas de Santiago') || subcategorias[0],
    tipoDeGasto: TipoDeMovimientoGasto.Debito,
  },
];

/*
scripts usados para insertar datos en la base de datos

INSERT INTO misgestiones.finanzas_categoria (id, nombre) VALUES 
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6A', 'Educación'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B', 'Hijos'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C', 'Entretenimiento'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D', 'Diario'),
  ('3F2504E0-4F89-11D3-9A0C-0305E82C3301', 'Regalos'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E', 'Salud'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F', 'Hogar'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60', 'Seguros'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D61', 'Tecnologia'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62', 'Transporte'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63', 'Viajes'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64', 'Servicios'),
  ('B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D65', 'Other');


  INSERT INTO misgestiones.finanzas_subcategoria (nombre, tipodegasto, categoria) VALUES
 ('Actividades', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Medicamentos', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Higiene', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Ropa', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Colegio-Extras', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Juguetes', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Deportes y juegos', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Otros', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6B'),
 ('Cursos', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6A'),
 ('Colegio', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6A'),
 ('Materiales escuela', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6A'),
 ('Otros', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6A'),
 ('Lawn Tennis', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('TIC', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Readers & Digest', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('HBO Max', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Netflix', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Disney+', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Libros', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Deporte', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Teatro', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Spotify', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Otros', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6C'),
 ('Comida', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Restaurants', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Productos personales', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Ropa', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Supermercado', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Peluqueria/Belleza', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Alcohol', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Gaseosas', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Otras', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6D'),
 ('Regalos', 'VARIABLE', '3F2504E0-4F89-11D3-9A0C-0305E82C3301'),
 ('Donaciones', 'VARIABLE', '3F2504E0-4F89-11D3-9A0C-0305E82C3301'),
 ('Otras', 'VARIABLE', '3F2504E0-4F89-11D3-9A0C-0305E82C3301'),
 ('Doctores', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E'),
 ('Maestra de apoyo', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E'),
 ('Farmacia', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E'),
 ('Psicologos', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E'),
 ('Lentes - Óptica', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E'),
 ('Terapia ocupacional', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E'),
 ('Otro', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6E'),
 ('Aportes Claudia', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Sueldo Claudia', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Extras Claudia', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Muebles', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Jardin', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Cosas para la casa', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Mantenimiento', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Mejora', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Mudanza', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Otras', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D6F'),
 ('Auto', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60'),
 ('Salud', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60'),
 ('Hogar', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60'),
 ('Vida', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60'),
 ('Otro', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D60'),
 ('Hardware', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D61'),
 ('Software', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D61'),
 ('Otros', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D61'),
 ('Nafta', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62'),
 ('Patente auto', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62'),
 ('Taller', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62'),
 ('VTV', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62'),
 ('Cosas para el auto', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62'),
 ('Taxi', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62'),
 ('Transporte Publico', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D62'),
 ('Avion', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63'),
 ('Hoteles', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63'),
 ('Comida', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63'),
 ('Transporte', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63'),
 ('Entretenimiento', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63'),
 ('Otros', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D63'),
 ('Aguas de Santiago', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Cablevision', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Contadora', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Personal', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Edese', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Gasnor', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Santiago - Inmobiliario municipal', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Santiago - Rentas provincial', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Dto. Tuc-Cór - SAT', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Dto. Tuc-Cór - Gasnor', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Dto. Tuc-Cór - Edet', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Dto. Tuc-Cór - DGR', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Dto. Tuc-Cór - CISI', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Dto. Tuc-Mar - DGR', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Bahía - ABSA', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Bahía - Municipal', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Bahía - ARBA', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Monotributo Nati', 'FIJO', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Other', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D64'),
 ('Cripto', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D65'),
 ('Emilio', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D65'),
 ('Otros', 'VARIABLE', 'B734C8E2-6D78-4A8F-9C36-AD2F0F1E9D65')


INSERT INTO misgestiones.finanzas_detallesubcategoria (nombre, subcategoria) VALUES
  ('Kiosco', 'aed07cba-f0e0-4953-9087-f1b7390e5535'),
  ('Extras', 'aed07cba-f0e0-4953-9087-f1b7390e5535')
 
*/

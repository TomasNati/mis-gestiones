# Tipos de queries (TanStack React Query)

## `useQuery` return type

```typescript
UseQueryResult<TData, TError>
```

### `instrumentosQuery` (src/app/inversiones/page.tsx:39)

```typescript
const instrumentosQuery = useQuery({
  queryKey: ['instrumentos'],
  queryFn: obtenerInstrumentos,  // returns Promise<Instrumento[]>
});
```

**Type:** `UseQueryResult<Instrumento[], Error>`

| Propiedad  | Tipo                    | Descripción                          |
|------------|-------------------------|--------------------------------------|
| `data`     | `Instrumento[]`         | Datos de la query (array vacío si undefined) |
| `error`    | `Error \| null`         | Error de la query, si lo hay         |
| `isLoading`| `boolean`               | True mientras carga por primera vez  |
| `isError`  | `boolean`               | True si hubo error                   |
| `isSuccess`| `boolean`               | True si se completó sin error         |
| `isPending`| `boolean`               | True si no hay datos (incluye loading)|
| `refetch`  | `() => Promise<...>`    | Refuerza la query manualmente        |

### `obtenerInstrumentos` (src/lib/api.ts:35)

```typescript
export const obtenerInstrumentos = async () => {
  const response = await apiClient.get<Instrumento[]>('/inversiones/instrumentos', {
    params: { limit_precios: 50 },
  });
  return response.data;  // Instrumento[]
};
```

`apiClient.get<Instrumento[]>()` tipa la respuesta como `AxiosResponse<Instrumento[]>`, y se retorna `response.data` que es `Instrumento[]`.

### Patrón común en el proyecto

```typescript
const instrumentos = instrumentosQuery.data ?? [];  // page.tsx:107
```

Se usa el operador `?? []` para evitar undefined y usar array vacío como default.

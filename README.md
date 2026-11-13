# BioCaquetá — Taller práctico de backend

Proyecto desarrollado con ES Modules (`import`/`export`), Express, Mongoose, MongoDB Atlas y Express-Handlebars.

## Inicio rápido

1. Abrir esta carpeta en VS Code.
2. Ejecutar `npm install`.
3. 
4. En Atlas, en **Network Access**, permitir acceso desde cualquier IP (`0.0.0.0/0`) y crear un usuario de base de datos.
5. Ejecutar `npm run dev`.
6. Abrir `http://localhost:3000`.

## API

- `GET /api/avistamientos`
- `GET /api/avistamientos?categoria=Ave`
- `POST /api/avistamientos`
- `PUT /api/avistamientos/:id`
- `DELETE /api/avistamientos/:id`
- `POST /api/avistamientos/update/:id` (formularios HTML)
- `POST /api/avistamientos/delete/:id` (formularios HTML)

### JSON de prueba para POST

```json
{
  "nombreComun": "Danta amazónica",
  "nombreCientifico": "Tapirus terrestris",
  "categoria": "Mamífero",
  "zona": "El Caraño",
  "estadoConservacion": "Vulnerable",
  "investigador": "Estudiante de Ingeniería de Sistemas"
}
```

### JSON de prueba para PUT

```json
{
  "zona": "Río Hacha",
  "estadoConservacion": "En peligro"
}
```

## Datos

- Base: `biocaqueta_db`
- Colección: `avistamientos`
- `.lean()` en rutas de vistas para Handlebars.

> Nota: Las credenciales las crea cada estudiante en Atlas. No se incluyen en la descarga.

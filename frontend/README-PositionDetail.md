# Position Detail - Tablero Kanban

## Descripción

La interfaz de detalle de posición es un tablero Kanban que permite visualizar y gestionar los candidatos de una posición específica. Los candidatos se muestran como tarjetas en diferentes columnas que representan las fases del proceso de contratación.

## Características

### 🎯 Funcionalidades principales
- **Visualización de candidatos**: Muestra todos los candidatos organizados por fase del proceso
- **Drag & Drop**: Permite mover candidatos entre fases arrastrando sus tarjetas
- **Información detallada**: Cada candidato muestra su nombre completo y puntuación media
- **Diseño responsive**: Se adapta a dispositivos móviles y de escritorio

### 🎨 Elementos de la interfaz
- **Header con navegación**: Título de la posición y botón para volver al listado
- **Columnas del proceso**: Cada fase del proceso de contratación se muestra como una columna
- **Tarjetas de candidatos**: Información del candidato con indicadores visuales de puntuación
- **Contadores**: Cada columna muestra el número de candidatos en esa fase

### 📱 Diseño responsive
- **Móvil**: Las columnas se apilan verticalmente ocupando todo el ancho
- **Escritorio**: Las columnas se muestran horizontalmente para mejor visualización

## API Endpoints utilizados

### GET /positions/:id/interviewFlow
Obtiene la información del proceso de contratación para una posición específica.

**Respuesta:**
```json
{
  "positionName": "Senior backend engineer",
  "interviewFlow": {
    "id": 1,
    "description": "Standard development interview process",
    "interviewSteps": [
      {
        "id": 1,
        "name": "Initial Screening",
        "orderIndex": 1
      }
    ]
  }
}
```

### GET /positions/:id/candidates
Obtiene todos los candidatos en proceso para una posición específica.

**Respuesta:**
```json
[
  {
    "fullName": "Jane Smith",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 4
  }
]
```

### PUT /candidates/:id/stage
Actualiza la etapa del candidato movido.

**Request:**
```json
{
  "applicationId": "1",
  "currentInterviewStep": "3"
}
```

## Uso

### Navegación
1. Desde el listado de posiciones, hacer clic en "Ver proceso"
2. Se navega a `/position/:id` donde se muestra el tablero Kanban
3. Usar el botón "Volver" para regresar al listado

### Gestión de candidatos
1. **Ver candidatos**: Los candidatos se muestran automáticamente en sus fases correspondientes
2. **Mover candidatos**: Arrastrar una tarjeta de candidato a otra columna
3. **Confirmación**: Se muestra un mensaje de éxito cuando se mueve un candidato
4. **Rollback automático**: Si falla la API, el candidato vuelve a su posición original

## Estructura de archivos

```
frontend/src/components/
├── PositionDetail.tsx          # Componente principal del tablero
├── PositionDetail.css          # Estilos del tablero Kanban
└── Positions.tsx               # Listado de posiciones (actualizado)

frontend/src/services/
└── positionService.js          # Servicios para llamadas a la API
```

## Estados del componente

- **Loading**: Muestra un spinner mientras se cargan los datos
- **Error**: Muestra un mensaje de error con opción de reintentar
- **Success**: Muestra un mensaje de éxito al mover candidatos
- **Empty**: Muestra un mensaje cuando no hay candidatos en una fase

## Personalización

### Colores de puntuación
- **Verde (success)**: Puntuación ≥ 4
- **Amarillo (warning)**: Puntuación 2-3
- **Rojo (danger)**: Puntuación < 2
- **Gris (secondary)**: Sin puntuación (N/A)

### Estilos CSS
Los estilos se pueden personalizar editando `PositionDetail.css`:
- Colores de las columnas
- Efectos de hover y drag & drop
- Diseño responsive
- Animaciones y transiciones

## Consideraciones técnicas

- **Fallback a datos mock**: Si falla la API, se usan datos de ejemplo
- **Actualización optimista**: La UI se actualiza inmediatamente, con rollback en caso de error
- **Manejo de errores**: Errores de red y de API se manejan graciosamente
- **Performance**: Solo se re-renderizan los componentes necesarios

## Estado de implementación

✅ **Completado:**
- Componente principal del tablero Kanban
- Estilos CSS responsive y profesionales
- Funcionalidad de drag & drop nativa
- Integración con servicios de API
- Manejo de estados (loading, error, success)
- Navegación entre vistas
- Fallback a datos mock

🔄 **En desarrollo:**
- Pruebas de integración con el backend real
- Optimizaciones de rendimiento

📋 **Próximos pasos:**
- Configurar variables de entorno para URLs de API
- Implementar autenticación si es necesaria
- Agregar más validaciones de datos
- Implementar cache de datos

# API Integration Guide

## Configuración del Backend

### Endpoints Disponibles

El backend tiene los siguientes endpoints implementados:

#### Posiciones
- `GET /position/:id/candidates` - Obtiene candidatos por posición
- `GET /position/:id/interviewflow` - Obtiene el flujo de entrevistas por posición

#### Candidatos
- `PUT /candidates/:id` - Actualiza la etapa del candidato

### Configuración del Servidor

El backend está configurado para ejecutarse en:
- **Puerto**: 3010
- **URL**: `http://localhost:3010`
- **CORS**: Habilitado para `http://localhost:3000`

## Configuración del Frontend

### Archivo de Configuración

El archivo `src/config/apiConfig.js` contiene toda la configuración de la API:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3010',
  ENDPOINTS: {
    POSITIONS: {
      CANDIDATES: (id) => `/position/${id}/candidates`,
      INTERVIEW_FLOW: (id) => `/position/${id}/interviewflow`,
    },
    CANDIDATES: {
      UPDATE_STAGE: (id) => `/candidates/${id}`,
    }
  },
  FEATURES: {
    USE_REAL_API: true, // Cambiar a false para usar datos mock
  }
};
```

### Variables de Entorno

Puedes configurar la URL de la API usando variables de entorno:

```bash
# .env
REACT_APP_API_URL=http://localhost:3010
```

## Uso de la API

### 1. Obtener Flujo de Entrevistas

```javascript
import { positionService } from '../services/positionService';

try {
  const interviewFlow = await positionService.getInterviewFlow(positionId);
  console.log(interviewFlow);
} catch (error) {
  console.error('Error:', error);
}
```

**Respuesta esperada:**
```json
{
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
```

### 2. Obtener Candidatos por Posición

```javascript
try {
  const candidates = await positionService.getCandidates(positionId);
  console.log(candidates);
} catch (error) {
  console.error('Error:', error);
}
```

**Respuesta esperada:**
```json
[
  {
    "fullName": "Jane Smith",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 4
  }
]
```

### 3. Actualizar Etapa del Candidato

```javascript
try {
  const result = await positionService.updateCandidateStage(
    candidateId, 
    newInterviewStepId
  );
  console.log(result);
} catch (error) {
  console.error('Error:', error);
}
```

**Request body:**
```json
{
  "applicationId": 1,
  "currentInterviewStep": 3
}
```

## Fallback a Datos Mock

Si la API no está disponible, el sistema automáticamente usa datos mock:

- **Datos de posición**: Senior Backend Engineer con 3 fases
- **Candidatos**: 3 candidatos de ejemplo en diferentes fases
- **Funcionalidad**: Drag & drop funciona completamente offline

## Solución de Problemas

### Error: "Cannot GET /positions/1/candidates"

**Causa**: URL incorrecta (plural vs singular)
**Solución**: El endpoint correcto es `/position/1/candidates` (singular)

### Error: "Connection refused"

**Causa**: Backend no está ejecutándose
**Solución**: 
1. Verificar que el backend esté ejecutándose en el puerto 3010
2. Verificar la configuración de CORS
3. Usar datos mock temporalmente

### Error: "CORS policy"

**Causa**: Configuración de CORS incorrecta
**Solución**: El backend ya tiene CORS configurado para `localhost:3000`

## Desarrollo

### Habilitar/Deshabilitar API Real

Para usar solo datos mock durante el desarrollo:

```javascript
// En src/config/apiConfig.js
FEATURES: {
  USE_REAL_API: false, // Cambiar a false
}
```

### Agregar Nuevos Endpoints

1. Agregar el endpoint en `apiConfig.js`
2. Implementar la función en el servicio correspondiente
3. Usar en el componente

### Testing

Los endpoints se pueden probar con:

```bash
# Obtener candidatos
curl http://localhost:3010/position/1/candidates

# Obtener flujo de entrevistas
curl http://localhost:3010/position/1/interviewflow

# Actualizar etapa del candidato
curl -X PUT http://localhost:3010/candidates/1 \
  -H "Content-Type: application/json" \
  -d '{"applicationId": 1, "currentInterviewStep": 3}'
```

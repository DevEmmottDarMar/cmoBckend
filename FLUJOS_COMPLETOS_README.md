# 🔄 Flujos Completos - Project EQU

## 📋 Descripción
Colección completa de Postman organizada en flujos separados para probar toda la funcionalidad del sistema de gestión de permisos y trabajos.

## 🚀 Configuración Inicial

### Variables de Colección
- `base_url`: `http://localhost:3001`
- `admin_token`: Token JWT del administrador
- `tecnico_token`: Token JWT del técnico
- `supervisor_token`: Token JWT del supervisor
- `admin_id`: ID del usuario administrador
- `tecnico_id`: ID del usuario técnico
- `supervisor_id`: ID del usuario supervisor
- `trabajo_id`: ID del trabajo creado
- `permiso_id`: ID del permiso actual
- `permiso_altura_id`: ID del permiso de altura
- `permiso_altura_imagen_id`: ID del permiso de altura para imagen
- `permiso_enganche_id`: ID del permiso de enganche
- `permiso_cierre_id`: ID del permiso de cierre

## 📂 Estructura de Flujos

### 🔐 FLUJO 1: Autenticación de Usuarios
**Propósito**: Login de todos los usuarios del sistema
**Incluye**:
- Login Admin
- Login Técnico  
- Login Supervisor
- Verificar usuarios del sistema

**Prerrequisitos**: Servidor corriendo en puerto 3001
**Ejecutar**: Primero siempre

### 🏗️ FLUJO 2: Supervisor Crea Trabajo
**Propósito**: Crear un nuevo trabajo y asignarlo a un técnico
**Incluye**:
- Crear trabajo con supervisor
- Ver trabajo creado

**Prerrequisitos**: FLUJO 1 completado
**Ejecutar**: Después del FLUJO 1

### 👤 FLUJO 3: Técnico Ve Sus Trabajos
**Propósito**: Verificar que el técnico puede ver sus trabajos asignados
**Incluye**:
- Listar trabajos del técnico

**Prerrequisitos**: FLUJO 2 completado
**Ejecutar**: Después del FLUJO 2

### 📊 FLUJO 4: Ver Todos los Trabajos
**Propósito**: Listar todos los trabajos del sistema
**Incluye**:
- Listar todos los trabajos

**Prerrequisitos**: FLUJO 2 completado
**Ejecutar**: Después del FLUJO 2

### 🎭 FLUJO 5: Gestión de Roles
**Propósito**: Verificar roles del sistema
**Incluye**:
- Listar roles

**Prerrequisitos**: FLUJO 1 completado
**Ejecutar**: Después del FLUJO 1

### 🔐 FLUJO 6: Gestión de Permisos
**Propósito**: Verificar tipos de permisos disponibles
**Incluye**:
- Listar tipos de permiso

**Prerrequisitos**: FLUJO 1 completado
**Ejecutar**: Después del FLUJO 1

### 📋 FLUJO 7: Técnico Solicita Permiso de Altura
**Propósito**: Solicitar el primer permiso (altura) con URL de imagen
**Incluye**:
- Obtener permisos del trabajo
- Solicitar permiso de altura con imagenUrl
- Ver mis permisos como técnico

**Prerrequisitos**: FLUJO 2 completado
**Ejecutar**: Después del FLUJO 2

### ✅ FLUJO 8: Supervisor Aprueba Permiso de Altura
**Propósito**: Aprobar el permiso de altura solicitado
**Incluye**:
- Ver permisos pendientes
- Aprobar permiso de altura
- Ver permiso aprobado

**Prerrequisitos**: FLUJO 7 completado
**Ejecutar**: Después del FLUJO 7



### 🔌 FLUJO 10: Técnico Solicita Permiso de Enganche
**Propósito**: Solicitar el segundo permiso (enganche) después de aprobar altura
**Incluye**:
- Obtener permisos del trabajo
- Solicitar permiso de enganche

**Prerrequisitos**: FLUJO 8 completado (altura aprobada)
**Ejecutar**: Después del FLUJO 8

### ✅ FLUJO 11: Supervisor Aprueba Permiso de Enganche
**Propósito**: Aprobar el permiso de enganche solicitado
**Incluye**:
- Ver permisos pendientes
- Aprobar permiso de enganche

**Prerrequisitos**: FLUJO 10 completado
**Ejecutar**: Después del FLUJO 10

### 🔒 FLUJO 12: Técnico Solicita Permiso de Cierre (Final)
**Propósito**: Solicitar el tercer permiso (cierre) para finalizar el trabajo
**Incluye**:
- Obtener permisos del trabajo
- Solicitar permiso de cierre

**Prerrequisitos**: FLUJO 11 completado
**Ejecutar**: Después del FLUJO 11

### ✅ FLUJO 13: Supervisor Aprueba Permiso de Cierre (Final)
**Propósito**: Aprobar el permiso de cierre para finalizar el trabajo
**Incluye**:
- Ver permisos pendientes
- Aprobar permiso de cierre
- Resumen final del flujo completo

**Prerrequisitos**: FLUJO 12 completado
**Ejecutar**: Después del FLUJO 12

## 🔄 Orden de Ejecución Recomendado

### 🎯 FLUJO COMPLETO (Recomendado):
1. **FLUJO 1** → Autenticación
2. **FLUJO 2** → Crear trabajo
3. **FLUJO 7** → Solicitar altura con imagen real
4. **FLUJO 8** → Aprobar altura
5. **FLUJO 10** → Solicitar enganche
6. **FLUJO 11** → Aprobar enganche
7. **FLUJO 12** → Solicitar cierre
8. **FLUJO 13** → Aprobar cierre

### Flujo Básico (Sin aprobaciones):
1. **FLUJO 1** → Autenticación
2. **FLUJO 2** → Crear trabajo
3. **FLUJO 7** → Solicitar altura
4. **FLUJO 10** → Solicitar enganche
5. **FLUJO 12** → Solicitar cierre

## 📝 Notas Importantes

### Secuencia de Permisos
Los permisos deben solicitarse en orden secuencial:
1. **Altura** (orden 1) - Primero
2. **Enganche** (orden 2) - Segundo
3. **Cierre** (orden 3) - Tercero

### Manejo de Imágenes
- **FLUJO 7**: Usa `imagenUrl` (URL externa)
- **FLUJO 9**: Usa `formdata` (imagen real)
- Las imágenes se almacenan en la entidad `Imagen` separada

### Variables Automáticas
Las siguientes variables se configuran automáticamente:
- `permiso_altura_id`: ID del permiso de altura
- `permiso_altura_imagen_id`: ID del permiso de altura para imagen
- `permiso_enganche_id`: ID del permiso de enganche
- `permiso_cierre_id`: ID del permiso de cierre

## 🎯 Casos de Uso

### 🏆 Caso 1: FLUJO COMPLETO (Recomendado)
Ejecutar flujos: 1 → 2 → 7 → 8 → 10 → 11 → 12 → 13
- Incluye todas las solicitudes y aprobaciones
- Flujo completo de trabajo desde inicio hasta fin

### Caso 2: Solo Solicitudes (Sin Aprobaciones)
Ejecutar flujos: 1 → 2 → 7 → 10 → 12
- Solo solicitudes de permisos
- Para pruebas rápidas

### Caso 3: Solo Verificación
Ejecutar flujos: 1 → 3 → 4 → 5 → 6
- Solo consultas y listados
- Para verificar estado del sistema

## ⚠️ Consideraciones

1. **Rate Limiting**: El servidor tiene throttling, esperar entre requests
2. **Tokens**: Los tokens se guardan automáticamente en variables
3. **IDs**: Los IDs se obtienen dinámicamente de las respuestas
4. **Secuencia**: Respetar el orden de los permisos (altura → enganche → cierre)
5. **Imágenes**: Preparar archivos de imagen para FLUJO 9

## 🔧 Troubleshooting

### Error 429 (Too Many Requests)
- Esperar unos segundos entre requests
- Es comportamiento normal del throttling

### Error 400 (Bad Request)
- Verificar que las variables estén configuradas
- Revisar el formato de los datos enviados

### Error 401 (Unauthorized)
- Verificar que los tokens estén válidos
- Rehacer el FLUJO 1 para obtener nuevos tokens 
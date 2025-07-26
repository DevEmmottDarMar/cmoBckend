# 🚀 Guía de Postman - Project EQU API

## 📋 Descripción

Esta colección de Postman incluye todos los endpoints de la API de Project EQU con autenticación JWT, usuarios, roles y mappers organizados.

## 🔧 Configuración Inicial

### 1. Importar la Colección

1. Abre Postman
2. Haz clic en "Import"
3. Selecciona el archivo `postman_collection.json`
4. La colección se importará automáticamente

### 2. Configurar Variables

La colección incluye variables preconfiguradas:

- `base_url`: `http://localhost:3000` (cambiar si es necesario)
- `auth_token`: Se llena automáticamente al hacer login

## 🔐 Autenticación

### Credenciales de Prueba

```
Admin:     admin1@demo.com / 123456
Técnico:   tecnico1@demo.com / 123456
Supervisor: supervisor1@demo.com / 123456
```

### Flujo de Login

1. Ejecuta cualquier endpoint de login (Admin, Técnico, Supervisor)
2. El token JWT se guarda automáticamente en la variable `auth_token`
3. Los siguientes requests usarán automáticamente el token

## 📊 Endpoints Disponibles

### 🔐 Autenticación

- **Login - Admin**: `POST /auth/login`
- **Login - Técnico**: `POST /auth/login`
- **Login - Supervisor**: `POST /auth/login`

### 👥 Usuarios

- **Listar Usuarios - Formato Nuevo**: `GET /users`
- **Listar Usuarios - Formato Legacy**: `GET /users?format=legacy`
- **Listar Usuarios - Formato Completo**: `GET /users?format=full`
- **Crear Usuario**: `POST /users`
- **Obtener Usuario por ID**: `GET /users/{id}`
- **Actualizar Usuario**: `PATCH /users/{id}`
- **Eliminar Usuario**: `DELETE /users/{id}`

### 🎭 Roles

- **Listar Roles - Formato Simple**: `GET /roles?format=simple`
- **Listar Roles - Formato Legacy**: `GET /roles?format=legacy`
- **Listar Roles - Formato Completo**: `GET /roles?format=full`
- **Crear Rol - Admin**: `POST /roles`
- **Crear Rol - Técnico**: `POST /roles`
- **Crear Rol - Supervisor**: `POST /roles`
- **Obtener Rol por ID**: `GET /roles/{id}`
- **Actualizar Rol**: `PATCH /roles/{id}`
- **Eliminar Rol**: `DELETE /roles/{id}`

## 🔄 Flujos de Prueba

### Flujo Completo - Crear Rol y Usuario

1. Ejecuta "🔄 Flujo Completo - Crear Rol y Usuario"
2. Automáticamente crea un rol y luego un usuario con ese rol
3. Los IDs se guardan en variables para uso posterior

### Flujo - Login y Obtener Datos

1. Ejecuta "🔄 Flujo - Login y Obtener Datos"
2. Hace login y automáticamente obtiene usuarios y roles con autenticación

## 📊 Pruebas de Mappers

### Comparar Formatos - Usuarios

Ejecuta este endpoint para ver las diferencias entre:

- **Formato Nuevo**: Sin roleId, datos limpios
- **Formato Legacy**: Con roleId, compatible con versiones anteriores
- **Formato Completo**: Con toda la información disponible

### Comparar Formatos - Roles

Ejecuta este endpoint para ver las diferencias entre:

- **Formato Simple**: Solo información básica del rol
- **Formato Legacy**: Con objeto users vacío
- **Formato Completo**: Con toda la información del rol

## 🎯 Formatos de Respuesta

### Formato Nuevo (por defecto)

```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": "uuid",
      "email": "user@demo.com",
      "name": "Usuario",
      "phone": "+1234567890",
      "createdAt": "2025-07-23T...",
      "updatedAt": "2025-07-23T..."
    }
  ],
  "timestamp": "2025-07-23T...",
  "path": "/users"
}
```

### Formato Legacy

```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": "uuid",
      "email": "user@demo.com",
      "name": "Usuario",
      "phone": "+1234567890",
      "roleId": "role-uuid",
      "createdAt": "2025-07-23T...",
      "updatedAt": "2025-07-23T..."
    }
  ],
  "timestamp": "2025-07-23T...",
  "path": "/users"
}
```

## 🚀 Cómo Usar

### 1. Inicio Rápido

1. Asegúrate de que el servidor esté corriendo en `http://localhost:3000`
2. Ejecuta "Login - Admin" para obtener un token
3. Prueba "Listar Usuarios - Formato Nuevo"

### 2. Pruebas de Mappers

1. Ejecuta "📊 Comparar Formatos - Usuarios"
2. Revisa la consola de Postman para ver las diferencias
3. Repite con "📊 Comparar Formatos - Roles"

### 3. Flujos Completos

1. Ejecuta "🔄 Flujo Completo - Crear Rol y Usuario"
2. Verifica que se crearon tanto el rol como el usuario
3. Prueba "🔄 Flujo - Login y Obtener Datos"

## 🔧 Personalización

### Cambiar URL Base

1. Ve a la colección
2. Haz clic en "Variables"
3. Cambia `base_url` a tu servidor

### Agregar Nuevos Usuarios

1. Copia "Crear Usuario"
2. Modifica el body con los nuevos datos
3. Ejecuta el request

### Probar Diferentes Roles

1. Usa los diferentes endpoints de login
2. Cada uno guarda el token automáticamente
3. Prueba los endpoints protegidos

## 📝 Notas Importantes

- ✅ Los tokens se guardan automáticamente
- ✅ Los mappers funcionan con query parameters
- ✅ Compatibilidad total con versiones anteriores
- ✅ Respuestas estructuradas y consistentes
- ✅ Scripts automáticos para flujos complejos

## 🐛 Troubleshooting

### Error 401 Unauthorized

- Ejecuta un login primero
- Verifica que el token se guardó correctamente

### Error 404 Not Found

- Verifica que el servidor esté corriendo
- Confirma la URL base en las variables

### Error 500 Internal Server Error

- Revisa los logs del servidor
- Verifica que la base de datos esté conectada

¡Listo para probar! 🎉

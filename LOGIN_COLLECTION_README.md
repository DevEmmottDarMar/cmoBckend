# 🔐 Colección de Login - Project EQU API

## 📋 Descripción

Esta es una colección simple de Postman específicamente diseñada para probar el login de los tres usuarios del sistema Project EQU.

## 🚀 Instalación Rápida

### 1. Importar la Colección

1. Abre Postman
2. Haz clic en **"Import"**
3. Selecciona el archivo `login_collection.json`
4. La colección se importará automáticamente

### 2. Configurar Variables

La colección incluye variables preconfiguradas:

- `base_url`: `http://localhost:3001` (cambiar si tu servidor corre en otro puerto)
- `admin_token`: Se llena automáticamente al hacer login del admin
- `tecnico_token`: Se llena automáticamente al hacer login del técnico
- `supervisor_token`: Se llena automáticamente al hacer login del supervisor

## 👥 Usuarios de Prueba

### Credenciales Disponibles

```
🔐 Admin:     admin1@demo.com / 123456
🔧 Técnico:   tecnico1@demo.com / 123456
👨‍💼 Supervisor: supervisor1@demo.com / 123456
```

## 📊 Endpoints Incluidos

### 🔐 Login Individual

1. **Login - Admin**: Prueba el login del administrador
2. **Login - Técnico**: Prueba el login del técnico
3. **Login - Supervisor**: Prueba el login del supervisor

### 🔄 Login Automático

4. **Login Todos los Usuarios**: Ejecuta automáticamente el login de los tres usuarios

### 📋 Información del Sistema

5. **Información de Usuarios**: Obtiene la lista de usuarios disponibles

### 🏗️ Gestión de Trabajos

6. **➕ Crear Trabajo - Supervisor**: El supervisor crea un nuevo trabajo
7. **📋 Listar Todos los Trabajos**: Obtiene todos los trabajos del sistema
8. **👁️ Obtener Trabajo por ID**: Obtiene detalles de un trabajo específico
9. **👤 Mis Trabajos - Técnico**: El técnico ve sus trabajos asignados

### 🔄 Flujos Completos

10. **🔄 Flujo Completo - Supervisor Crea Trabajo**: Flujo completo de creación de trabajo

## 🎯 Cómo Usar

### Opción 1: Login Individual

1. Asegúrate de que el servidor esté corriendo en `http://localhost:3001`
2. Ejecuta cualquiera de los endpoints de login individual
3. Revisa la consola de Postman para ver el resultado
4. El token se guarda automáticamente en las variables

### Opción 2: Login Automático (Recomendado)

1. Ejecuta **"🔄 Login Todos los Usuarios"**
2. Este endpoint automáticamente:
   - Hace login de los tres usuarios
   - Guarda los tokens en variables
   - Muestra un resumen en la consola

### Opción 3: Ver Usuarios Disponibles

1. Ejecuta **"📋 Información de Usuarios"**
2. Revisa la consola para ver todos los usuarios del sistema

### Opción 4: Flujo de Trabajos (Recomendado)

1. Ejecuta **"🔄 Login Todos los Usuarios"** para obtener todos los tokens
2. Ejecuta **"🔄 Flujo Completo - Supervisor Crea Trabajo"** para crear un trabajo
3. Ejecuta **"👤 Mis Trabajos - Técnico"** para ver el trabajo asignado
4. Ejecuta **"📋 Listar Todos los Trabajos"** para ver todos los trabajos

## 🔧 Personalización

### Cambiar URL del Servidor

1. Ve a la colección
2. Haz clic en **"Variables"**
3. Cambia `base_url` a tu servidor (ej: `http://localhost:3001`)

### Ver Tokens Guardados

1. Ve a la colección
2. Haz clic en **"Variables"**
3. Verás los tokens guardados en:
   - `admin_token`
   - `tecnico_token`
   - `supervisor_token`

### Ver IDs Guardados

1. Ve a la colección
2. Haz clic en **"Variables"**
3. Verás los IDs guardados en:
   - `tecnico_id` - ID del técnico para asignaciones
   - `trabajo_id` - ID del trabajo creado
   - `trabajo_creado_id` - ID del trabajo del flujo completo

## 📝 Respuestas Esperadas

### Login Exitoso (200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin1@demo.com",
    "name": "Administrador",
    "phone": "+1234567890",
    "createdAt": "2025-01-27T...",
    "updatedAt": "2025-01-27T..."
  }
}
```

### Error de Login (401)

```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
```

## 🐛 Troubleshooting

### Error 404 Not Found

- Verifica que el servidor esté corriendo
- Confirma la URL base en las variables de la colección

### Error 401 Unauthorized

- Verifica que las credenciales sean correctas
- Asegúrate de que los usuarios existan en la base de datos

### Error 500 Internal Server Error

- Revisa los logs del servidor
- Verifica que la base de datos esté conectada

### Tokens No Se Guardan

- Revisa la consola de Postman para errores
- Verifica que el script de test se ejecute correctamente

### Error al Crear Trabajo

- Verifica que el supervisor tenga permisos
- Confirma que el técnico existe en el sistema
- Revisa que el token del supervisor sea válido

## 🎉 Resultados Esperados

Al ejecutar **"🔄 Login Todos los Usuarios"**, deberías ver en la consola:

```
🚀 Iniciando login de todos los usuarios...
✅ Login exitoso admin1@demo.com: Administrador
✅ Login exitoso tecnico1@demo.com: Técnico
✅ Login exitoso supervisor1@demo.com: Supervisor
📊 Resumen de logins:
   Admin: ✅
   Técnico: ✅
   Supervisor: ✅
🎉 ¡Todos los logins exitosos!
```

Al ejecutar **"🔄 Flujo Completo - Supervisor Crea Trabajo"**, deberías ver:

```
🚀 Iniciando flujo completo: Supervisor crea trabajo...
✅ Trabajo creado exitosamente por el supervisor
   📋 Título: Mantenimiento de transformador en sector sur
   🆔 ID: uuid-del-trabajo
   👤 Técnico asignado: Usuario Tecnico
   📊 Estado: pendiente
   🔐 Permisos automáticos creados: 3
   📋 Permisos creados automáticamente:
      1. Permiso de Altura - pendiente
      2. Permiso de Enganche - pendiente
      3. Permiso de Cierre - pendiente
🎉 Flujo completado exitosamente
💡 El técnico ahora puede ver este trabajo en "Mis Trabajos"
```

## 📞 Soporte

Si tienes problemas:

1. Verifica que el servidor esté corriendo
2. Revisa los logs del servidor
3. Confirma que las credenciales sean correctas
4. Verifica la URL base en las variables

¡Listo para probar! 🚀 
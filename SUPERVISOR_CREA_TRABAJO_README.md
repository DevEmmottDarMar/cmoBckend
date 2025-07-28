# 👨‍💼 Supervisor Crea Trabajo - Collection

## 📋 Descripción

Esta es una colección simple y específica para probar el flujo completo donde el supervisor crea un trabajo y lo asigna a un técnico.

## 🚀 Instalación Rápida

### 1. Importar la Colección

1. Abre Postman
2. Haz clic en **"Import"**
3. Selecciona el archivo `supervisor_crea_trabajo_collection.json`
4. La colección se importará automáticamente

### 2. Configurar Variables

La colección incluye variables preconfiguradas:

- `base_url`: `http://localhost:3001`
- `supervisor_token`: Se llena automáticamente al hacer login
- `tecnico_id`: Se obtiene automáticamente de la lista de usuarios
- `trabajo_id`: Se guarda automáticamente al crear el trabajo

## 📊 Endpoints Incluidos

### 🔐 Autenticación

1. **🔐 Login Supervisor**: Login del supervisor (supervisor1@demo.com / 123456)

### 🔍 Preparación

2. **🔍 Obtener ID del Técnico**: Obtiene el ID del técnico para la asignación

### 🏗️ Creación de Trabajo

3. **➕ Crear Trabajo - Supervisor**: El supervisor crea un nuevo trabajo

### 📋 Verificación

4. **📋 Ver Trabajo Creado**: Obtiene los detalles del trabajo creado
5. **📊 Listar Todos los Trabajos**: Lista todos los trabajos del sistema

## 🎯 Cómo Usar con Postman Run

### Opción 1: Ejecutar Toda la Colección

1. Asegúrate de que el servidor esté corriendo en `http://localhost:3001`
2. En Postman, ve a la colección
3. Haz clic en **"Run collection"** (botón de play)
4. Selecciona todos los endpoints
5. Haz clic en **"Run"**

### Opción 2: Ejecutar Secuencialmente

1. Ejecuta **"🔐 Login Supervisor"**
2. Ejecuta **"🔍 Obtener ID del Técnico"**
3. Ejecuta **"➕ Crear Trabajo - Supervisor"**
4. Ejecuta **"📋 Ver Trabajo Creado"**
5. Ejecuta **"📊 Listar Todos los Trabajos"**

## 📝 Datos del Trabajo

El trabajo que se crea incluye:

```json
{
  "titulo": "Instalación de línea eléctrica en sector norte",
  "descripcion": "Instalación completa de línea eléctrica de media tensión en el sector norte de la ciudad. Incluye montaje de postes, tendido de cables y conexiones.",
  "observacion": "Requiere coordinación con el municipio y cierre de calles temporales",
  "tecnicoAsignadoId": "ID_DEL_TECNICO",
  "estado": "pendiente"
}
```

## 🎉 Resultados Esperados

### Login Supervisor
```
✅ Token Supervisor guardado: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
👤 Usuario: Usuario supervisor
📧 Email: supervisor1@demo.com
```

### Obtener ID del Técnico
```
✅ ID del técnico obtenido:
   👤 Nombre: Usuario Tecnico
   📧 Email: tecnico1@demo.com
   🆔 ID: a11e49a8-032a-4b5a-824a-d9c3be7f3a23
```

### Crear Trabajo
```
🔍 Verificando datos:
   Token Supervisor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ID Técnico: a11e49a8-032a-4b5a-824a-d9c3be7f3a23

✅ Trabajo creado exitosamente:
   📋 Título: Instalación de línea eléctrica en sector norte
   🆔 ID: uuid-del-trabajo
   👤 Técnico asignado: Usuario Tecnico
   📊 Estado: pendiente
   🔐 Permisos creados: 3

   📋 Permisos creados automáticamente:
      1. Permiso de Altura - pendiente
      2. Permiso de Enganche - pendiente
      3. Permiso de Cierre - pendiente

🎉 ¡Trabajo creado y asignado exitosamente!
```

## 🔧 Personalización

### Cambiar Datos del Trabajo

1. Ve al endpoint **"➕ Crear Trabajo - Supervisor"**
2. Modifica el body con los nuevos datos
3. Ejecuta el request

### Cambiar URL del Servidor

1. Ve a la colección
2. Haz clic en **"Variables"**
3. Cambia `base_url` a tu servidor

## 🐛 Troubleshooting

### Error 401 Unauthorized
- Verifica que el supervisor tenga permisos
- Confirma que el token sea válido

### Error 400 Bad Request
- Verifica que el `tecnicoAsignadoId` sea un UUID válido
- Confirma que el técnico existe en el sistema

### Error 404 Not Found
- Verifica que el servidor esté corriendo
- Confirma la URL base en las variables

## 📞 Soporte

Si tienes problemas:

1. Verifica que el servidor esté corriendo en el puerto 3001
2. Confirma que los usuarios existan en la base de datos
3. Revisa los logs del servidor
4. Verifica que el supervisor tenga permisos para crear trabajos

¡Listo para probar el flujo completo! 🚀 
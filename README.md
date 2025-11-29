# Ecommerce Backend - Entrega Final Backend II (CoderHouse)

Proyecto final del curso **Backend II - Diseño y Arquitectura Backend**.  
Implementa un backend de ecommerce con:

- Arquitectura por capas (DAO, Services, Controllers, DTOs)
- Manejo de roles y autorización
- Generación de tickets de compra
- Sistema de recuperación de contraseña
- Uso de JWT, cookies httpOnly y Passport
- Uso de Nodemailer
- WebSockets para productos en tiempo real

---

## 🧱 Stack Tecnológico

- Node.js + Express
- MongoDB Atlas + Mongoose
- Passport (Local + JWT)
- Nodemailer
- Socket.io
- Handlebars (vistas)

---

## 🚀 Puesta en marcha

1. Clonar el repositorio:
 ```bash  
git clone <URL_DEL_REPO>
cd <nombre-del-proyecto>
```

2. Instalar dependencias:
```bash
   npm install
```
   
3. Iniciar el servidor:
```bash

   npm run dev
```

4. Servidor disponible en:
```bash
   http://localhost:8080

```
---
## 🔐 Autenticación y Autorización

- Login + Registro con Passport Local

- JWT almacenado en cookie httpOnly

- Middleware authorization("admin") y authorization("user")

- Endpoint protegido /current retorna un UserDTO sin información sensible

### 📌 /api/sessions/current (DTO aplicado)
```bash
Ejemplo de respuesta:
{
  "user": {
    "id": "6651f8c9ad1f84f63e1f3d10",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@gmail.com",
    "age": 30,
    "role": "user",
    "cartId": "6651f8c9ad1f84f63e1f3d99"
  }
}

```
---
## 🛒 Carritos y Tickets

#### Compra del carrito:
```bash
POST /api/carts/:cid/purchase
```

##### Lógica:

- Recorre productos del carrito

- Valida stock por producto

- Compra parcial o completa

- Descuenta stock

- Genera un Ticket

- Retorna un TicketDTO

Ejemplo:
```bash
{
  "status": "success",
  "message": "Compra completa realizada con éxito.",
  "ticket": {
    "code": "ea510f50-2ab0-4d6e-a821-3ef8b5a7107c",
    "amount": 32000,
    "purchaser": "user@gmail.com",
    "purchase_datetime": "2025-02-12T23:15:00.000Z"
  }


```
---
## 🔁 Recuperación de Contraseña

#### 1️⃣ Solicitar recuperación
POST /api/sessions/forgot-password


Body:
```bash
{
  "email": "user@correo.com"
}

```

Genera token con expiración de 1 hora y envía link.

#### 2️⃣ Formulario:
GET /api/sessions/reset-password?token=...

#### 3️⃣ Confirmar nueva contraseña:
POST /api/sessions/reset-password


#### Reglas:

- No permite usar la misma contraseña anterior

- Token expira en 1 hora

- Contraseña se guarda hasheada

---
### 🧩 Arquitectura del Proyecto

````
src/
  app.js
  config/
  dao/
  dtos/
  services/
  controllers/
  middlewares/
  mail/
  routes/
  utils/
  views/
````

-  DAO → Acceso a datos
- Services → Lógica de negocio
- Controllers → Entradas HTTP
- DTOs → Limpieza de datos
- Middlewares → Autorización y autenticación

---
### 👤 Roles

###### ADMIN

- Crear / actualizar / eliminar productos

- Ver todos los carritos

###### USER

- Crear carrito

- Agregar productos al carrito

- Comprar y generar tickets


---




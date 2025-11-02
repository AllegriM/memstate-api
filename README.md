# memstate-api

[![npm version](https://badge.fury.io/js/memstate-api.svg)](https://badge.fury.io/js/memstate-api)

Memstate API es un servidor de mocking de API **stateful** (con estado) para Node.js, diseñado para desarrolladores frontend.

A diferencia de `json-server`, tus peticiones `POST`, `PUT` y `DELETE` **modifican la base de datos en memoria**. Lo que creas, existe. Lo que borras, desaparece. Es ideal para prototipar aplicaciones complejas de React, Vue, Next.js, etc., sin tener que esperar por el backend.

---

## El Problema

Las herramientas de mocking tradicionales tienen dos problemas:

1.  **Son "stateless" (sin estado):** `json-server` es genial, pero si haces un `POST` para crear un usuario, ese usuario no aparecerá en la siguiente petición `GET`.
2.  **Se ejecutan en el navegador:** `MirageJS` es increíblemente potente, pero se ejecuta en el _proceso del navegador_, lo que puede ser confuso, oculta las peticiones de la pestaña "Network" y no simula un servidor Node.js real.

## La Solución

`memstate-api` te da lo mejor de ambos mundos:

- **Stateful por Defecto:** Al igual que MirageJS, mantiene una base de datos en memoria.
- **Se ejecuta en Node.js:** Al igual que `json-server`, es un servidor real que puedes consultar desde cualquier lugar.
- **Configuración en 1 Minuto:** Define todos tus recursos y rutas en un simple archivo de configuración.

---

## Características Principales

- ⚡️ **Servidor Stateful:** Los cambios persisten en memoria mientras el servidor esté corriendo.
- 🚀 **Generación de API en 1 Minuto:** Usa `server.resource()` para crear 5 rutas CRUD (GET, GET por ID, POST, PUT, DELETE) con una sola línea de código.
- 🔧 **Rutas de Lógica Personalizada:** Crea endpoints complejos (como `/auth/login`) con `server.get()` o `server.post()` y accede a la base de datos (`db`) y la petición (`req`).
- 🛡️ **Hecho con TypeScript:** Proporciona autocompletado y tipos para tu archivo de configuración.

---

## Instalación

Instala el paquete como una dependencia de desarrollo:

```bash
npm install --save-dev memstate-api
```

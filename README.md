# React Paint App

App de dibujo colaborativo en tiempo real

## Prerequisitos
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Pusher](https://pusher.com)
- Una [cuenta de Pusher](https://pusher.com/signup) y las [credenciales de tu app de Pusher](http://dashboard.pusher.com/)

## Empezando
- Clona el proyecto e instala las dependencias.
- Crea un archivo `.env`. Modifica el archivo `.env` con lo siguiente:

```
PUSHER_APP_ID=app-id
PUSHER_APP_KEY=app-key
PUSHER_APP_SECRET=app-secret
```
> **Nota**: reemplaza los valores con tus credenciales de pusher.

- Ejecuta los siguientes comandos en sesiones de terminal separadas:

```
npm start
node server
```
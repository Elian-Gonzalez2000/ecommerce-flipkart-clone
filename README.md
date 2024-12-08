# Flipkart Ecommerce clone

- Link del cliente: [https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/](https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/)

- Link de la Admin App: [https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/admin-app/dist/#/signin](https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/admin-app/dist/#/signin)

# Flipkart Clone

Este es un clon funcional del e-commerce Flipkart, desarrollado con tecnologías modernas para brindar una experiencia de compra en línea fluida e interactiva.

![Vista de la aplicación](https://raw.githubusercontent.com/Elian-Gonzalez2000/ecommerce-flipkart-clone/refs/heads/main/banner-app.png)

**Aun no se ha completado la aplicacion, pero las funcionalidades basicas están listas. Pero aun sigue en desarrollo.**

## Características principales

- **Navegación por categorías**: Explora productos por secciones como móviles, electrónicos, moda, y más.
- **Carrito de compras**: Añade productos al carrito para una experiencia de compra fluida.
- **Sistema de autenticación**: Registro e inicio de sesión seguro para usuarios.
- **Panel de vendedor**: Permite a los vendedores gestionar sus productos.
- **Pasarela de pago**: Integración de simulación de pagos para completar órdenes.
- **Gestión de imágenes con Firebase**: Subida y manejo de imágenes optimizado.
- **Responsive Design**: Adaptada para dispositivos móviles y escritorios.

## Tecnologías utilizadas

- **Frontend**: React.js, Redux, React-Router, Bootstrap, Formik, Yup
- **Backend**: Node.js, Express.js.
- **Base de datos**: MongoDB, Mongoose como ORM
- **Manejo de imágenes**: Firebase Storage
- **Otros**: JWT para autenticación, Stripe para simulación de pagos, Nodemailer para envío de correos electrónicos.

## Flujo de funcionamiento

1. **Inicio**: Los usuarios pueden explorar productos destacados o navegar por categorías desde la página principal.
2. **Autenticación**: Los usuarios deben registrarse o iniciar sesión para realizar compras.
3. **Selección de productos**: Añade productos al carrito desde las páginas de detalles.
4. **Pago**: Completa las órdenes mediante la pasarela de pago simulada.
5. **Gestión de imágenes**: Las imágenes de productos se almacenan y recuperan de Firebase Storage.
6. **Panel de administración**: Los vendedores pueden gestionar inventarios y los usuarios pueden rastrear sus pedidos.

## Instalación y configuración

Sigue estos pasos para ejecutar la aplicación en tu máquina local:

**NOTA: La aplicacion es un monorepo, por lo que se debe ejecutar los servidores en el directorio raíz del proyecto, pero la instalación de las dependencias se realiza en cada directorio.**

### Prerrequisitos

- Node.js (versión 14 o superior)
- MongoDB instalado y ejecutándose localmente o en un servicio remoto.
- Cuenta en [Firebase](https://firebase.google.com/) configurada con Firebase Storage.
- Una cuenta de Stripe para la simulación de pagos.

### Clonar el repositorio

```bash
git clone https://github.com/Elian-Gonzalez2000/ecommerce-flipkart-clone.git
cd ecommerce-flipkart-clone
```

### Configuración de Firebase y la Admin App

1. Inicia sesión en Firebase Console.
2. Crea un nuevo proyecto y habilita Firebase Storage.
3. Descarga el archivo de configuración de Firebase (firebaseConfig) y agrega las credenciales en el frontend.

Ejemplo de configuración en el admin (admin-app/src/firebase/firebase.client.js):

```javascript
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
```

1. Instala las dependencias:

```bash
cd admin-app
npm install
```

2. Inicia la aplicación en modo desarrollo luego de configurar archivo firebase:

```bash
npm run dev:a
```

### Configuración del backend

1. Navega al directorio del servidor:

```bash
cd backend
```

2. Instala las dependencias:

```bash
npm install
```

3.  Crea un archivo .env en el directorio raíz del servidor con las siguientes variables:

```
PORT=3002
MONGO_DB_USER=MongoDB User
MONGO_DB_PASSWORD=MongoDB Password
MONGO_DB_DATABASE=MongoDB Database
JWT_SECRET=secret
SECRET_KEY_STRIPE=Stripe Secret Key
```

4.iniciar el servidor

```bash
cd ../
npm run dev:b
```

### Configuración del frontend

1. Navega al directorio del cliente:

```bash
cd client
```

2. Instala las dependencias:

```bash
npm install
```

3. Verifica de la url del servidor y de Stripe en el archivo urlConfig.js

```javascript
const ENVIRONMENT = "developer";
export const api =
  ENVIRONMENT === "developer"
    ? "http://localhost:3002/api"
    : "https://flipkart-rest-server-jvxd.onrender.com/api";
export const genericPublicUrl = (fileName) => {
  return `http://localhost:3002/public/${fileName}`;
};

export const PUBLIC_KEY_STRIPE = "Stripe Public Key";
```

4. iniciar el servidor desde la raiz del proyecto

```bash
npm run dev:c
```

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un error o tienes ideas para nuevas características, no dudes en abrir un issue o enviar un pull request.

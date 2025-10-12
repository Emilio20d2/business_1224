# BUSINESS Dashboard

Este proyecto es un panel de control de negocios (dashboard) construido con Next.js y Firebase, diseñado para visualizar y gestionar datos de ventas y operaciones de una tienda.

## Descripción

La aplicación permite a los usuarios:
-   Visualizar datos de ventas semanales desglosados por sección (Señora, Caballero, Niño).
-   Analizar métricas clave de rendimiento de la tienda, como tráfico y conversión.
-   Gestionar datos de operaciones, incluyendo logística, almacenes y pérdidas.
-   Editar y mantener listas de configuración para compradores, zonas comerciales, y más.
-   Autenticación de usuarios para proteger el acceso a los datos.

## Tecnologías Utilizadas

-   **Framework:** Next.js (con App Router)
-   **Base de Datos:** Firestore (Firebase)
-   **Autenticación:** Firebase Authentication
-   **UI:** React, ShadCN UI, Tailwind CSS
-   **Iconos:** Lucide React
-   **Gráficos:** Recharts

## Primeros Pasos

Para poner en marcha el proyecto, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Emilio20d2/business.git
    ```

2.  **Instalar dependencias:**
    ```bash
    cd business
    npm install
    ```

3.  **Configurar Firebase:**
    Asegúrate de que tu archivo `src/lib/firebase.ts` contiene la configuración correcta de tu proyecto de Firebase.

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación.

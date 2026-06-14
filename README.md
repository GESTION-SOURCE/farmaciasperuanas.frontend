# Reto Técnico - Frontend eCommerce (Inkafarma)

Este proyecto es una aplicación frontend desarrollada en **Angular (Standalone Components)** con **Server-Side Rendering (SSR)** habilitado y gestión reactiva del estado mediante **Angular Signals** y **RxJS**. Se usó Angular Material para componentes y se implementó un flujo completo de Listado de Productos y Detalle de Producto.

## Requisitos Previos

- **Node.js**: v18.19.0 o superior (Se recomienda v20.x).
- **Angular CLI**: v21 (El proyecto está inicializado con SSR).

## Instrucciones de Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run start
   ```
   Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

3. **Generar Build de Producción (con SSR/Prerender)**:
   ```bash
   npm run build
   ```

---

## Respuestas a las Preguntas de Arquitectura y Negocio

### 1. Decisiones de Escalabilidad
Se adoptó una arquitectura **Modular y Basada en Standalone Components**. La aplicación divide lógicamente las responsabilidades en:
- **Core (`/core`)**: Servicios Singleton (ej. `CartService`, `MockDataService`, `SeoService`, `AnalyticsService`) y Modelos estandarizados. Totalmente desacoplados de la UI.
- **Shared (`/shared`)**: Componentes "Dumb" puramente presentacionales y reutilizables (`ProductCardComponent`, `AccordionComponent`). Usan el patrón `@Input`/`@Output` para evitar estado local complejo.
- **Pages (`/pages`)**: Componentes "Smart" ruteados mediante **Lazy Loading**. La Product Detail Page (PDP) se carga independientemente dentro del contexto jerárquico. 

Esta estructura garantiza que, a medida que el negocio crezca y se agreguen nuevos módulos (ej. Checkout o Mi Perfil), el peso inicial de la aplicación se mantenga ligero y el código mantenible.

### 2. Optimización del LCP (Largest Contentful Paint)
Para asegurar que la métrica más importante de las Core Web Vitals se mantenga en márgenes óptimos:
- Se aprovechó el renderizado nativo en el servidor (SSR) para despachar el HTML pre-hidratado al navegador.
- La imagen principal de la galería de productos (`mainImage`) y las imágenes del listado se sirven dinámicamente y se utiliza CSS Grid moderno para evitar re-flujos pesados de redibujado (CLS).
- Angular Material se ha importado estrictamente por componentes (ej. `MatButtonModule`, `MatCardModule`), en vez de importar el paquete global entero, garantizando un "tree-shaking" que disminuye drásticamente el First Load JS payload.

### 3. Server-Side Rendering (SSR) y Prerendering
Se utilizó el soporte nativo de SSR en Angular (`@angular/ssr`). El principal desafío para el SEO en el eCommerce residía en que la ruta de la PDP (`/products/:id`) es dinámica e infinita. 
Para resolverlo, en `app.routes.server.ts`, se configuró explícitamente el `RenderMode.Server` para el segmento dinámico. Esto asegura que los metadatos dinámicos generados por el `SeoService` (como `<title>` y `<meta description>`) se inyecten desde el Node.js server antes de devolver el Response al cliente. Así, los crawlers de los motores de búsqueda acceden a un HTML completamente indexable con la información de precios, títulos e imágenes actualizadas.

### 4. Prevención de Duplicidad de Eventos en el DataLayer (SPA)
En una SPA, navegar de forma asíncrona entre vistas a menudo causa que los eventos se encolen incorrectamente.
- La prevención se logró creando un **`AnalyticsService`** como único punto de acceso y entrada para los eventos `dataLayer.push`.
- En la PDP, el evento `view_item` se despacha exclusivamente en el pipeline asíncrono exacto cuando la URL se resuelve correctamente mediante el operador reactivo de RxJS (`tap` dentro de `switchMap`).
- Además, en el `AnalyticsService`, implementamos el check de seguridad `isPlatformBrowser()` de `@angular/common`. Esto garantiza que los píxeles de marketing, dependientes del objeto DOM `window`, jamás se ejecuten durante el ciclo de vida del SSR del servidor de Node.js, bloqueando la polución de analíticas.

### 5. Elección de Gestión de Estado: Signals + RxJS
Se fusionaron ambas filosofías modernas sacando la mayor ventaja:
- **RxJS**: Excelente en el manejo asíncrono y control de tiempo. Lo utilizamos para la navegación (`ParamMap`), interceptaciones asíncronas y simulación del retardo de la red en los *Mocks*.
- **Angular Signals**: Utilizado en `CartService` para la gestión en memoria síncrona. Mediante primitivas (`signal` y `computed`) logramos un Reactivity Tree de altísima performance y mediante el primitivo `effect()` garantizamos la persistencia atómica hacia el `localStorage` en cada modificación del carrito. Reemplaza la pesadez de Redux (NGRX) en apps de escala intermedia/avanzada.

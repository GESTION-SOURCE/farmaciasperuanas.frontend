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

### 1. ¿Qué decisiones tomaste para mejorar la performance en esta página?
- **Server-Side Rendering (SSR)**: Se habilitó el renderizado en el servidor para despachar HTML pre-renderizado, mejorando notablemente el First Contentful Paint (FCP) y reduciendo el tiempo hasta que la página es visible.
- **Gestión de Estado Eficiente**: Uso de **Angular Signals** para un estado reactivo de alto rendimiento, evitando ciclos de detección de cambios innecesarios que penalizan la interacción.
- **Tree-Shaking**: Se importaron módulos específicos de Angular Material (ej. `MatButtonModule`) en lugar del paquete completo, lo que reduce drásticamente el tamaño final del bundle (First Load JS).
- **Lazy Loading**: La aplicación se estructuró con rutas en carga diferida (ej. Product Detail Page), cargando el JavaScript del módulo solo cuando el usuario navega hacia él.

### 2. ¿Cómo estructurarías esta solución para soportar múltiples marcas con diferentes estilos?
- **Sistema de Diseño basado en Tokens**: Utilizaría variables SCSS (CSS Custom Properties) para definir tokens visuales (colores primarios, tipografía, radios de borde).
- **Arquitectura Multitenant en UI**: Mantendría la lógica y estructura base intacta en `core` y `shared`, y aplicaría un **Theming** inyectado por configuración.
- En Angular, esto se puede manejar configurando diferentes `projects` o `configurations` en el archivo `angular.json`, cada uno apuntando a un archivo `theme.scss` específico por marca (ej. `theme-inkafarma.scss`, `theme-mifarma.scss`), permitiendo compilar versiones distintas del mismo código base.

### 3. Si esta página presenta problemas de LCP en producción, ¿cómo lo abordarías?
- **Auditoría con DevTools**: Identificaría primero cuál es el Largest Contentful Paint (suele ser la imagen principal del producto).
- **Optimización de la Imagen LCP**: 
  - Asegurar el uso de formatos modernos (WebP, AVIF).
  - Configurar atributos `priority` o usar `<link rel="preload" as="image">` para que el navegador descargue la imagen hero lo antes posible.
  - Implementar `srcset` y `sizes` para descargar una imagen de dimensiones adecuadas según el dispositivo.
- **Estrategias de Caché y CDN**: Asegurar que una Red de Distribución de Contenido (CDN) cachee el HTML generado por el SSR y los assets estáticos.
- **Evitar re-flujos**: Reservar el espacio exacto en el layout (CSS aspect-ratio) para las imágenes y evitar un CLS que penalice la métrica relacionada al layout.

### 4. ¿Cómo evitarías que eventos de Analytics se disparen múltiples veces en una SPA?
- **Servicio Centralizado (`AnalyticsService`)**: Encapsular el objeto `dataLayer` y controlar todos los flujos de eventos desde un único servicio Singleton.
- **Protección SSR**: Envolver el acceso a herramientas de tracking usando `isPlatformBrowser()` de Angular, asegurando que los scripts no se ejecuten desde el servidor durante el ciclo SSR.
- **Control Reactivo (RxJS)**: Al suscribirse a eventos del enrutador de Angular (ej. `NavigationEnd`), aplicaría operadores como `distinctUntilChanged()` y `filter` para asegurarme de que el evento de vista (ej. `view_item`) solo se despache si el usuario navega realmente a un nuevo producto.
- **Manejo de Estado Interno**: Registrar temporalmente (debouncing) el último evento enviado para evitar disparos duplicados frente a clics accidentales o re-renders de la interfaz.

### 5. ¿Qué consideraciones SEO tendrías en cuenta para esta página en un entorno real?
- **Mantenimiento del SSR**: Garantizar que el Server-Side Rendering funcione para las páginas críticas (PLP y PDP), de forma que los bots de Google lean la información de productos al instante, sin ejecutar JS.
- **Meta-tags Dinámicos**: Uso de `Title` y `Meta` services de Angular para actualizar el `<title>`, `<meta name="description">` y Open Graph tags dinámicamente basados en el producto cargado.
- **Datos Estructurados (Schema.org)**: Inyectar JSON-LD en el HTML de la PDP (tipo `Product`) para mostrar Rich Snippets en los resultados de búsqueda (estrellas, precio, disponibilidad).
- **Etiquetas Canónicas (Canonical URLs)**: Declarar dinámicamente un `<link rel="canonical">` apuntando a la URL base del producto, para que variaciones de parámetros (ej. `?size=big`) no diluyan la autoridad o causen contenido duplicado.
- **Optimización del Crawl Budget**: Generar y mantener un `sitemap.xml` dinámico y un `robots.txt` adecuado para priorizar las páginas de catálogo y omitir rutas privadas (como el checkout).

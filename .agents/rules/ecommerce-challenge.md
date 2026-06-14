---
trigger: always_on
---

# Stack & Architecture Constraints
- Framework: Angular (21) con SSR habilitado.
- Backend: NO usar un backend real. Implementar un Mock Data Service basado en un JSON con información de productos. Inyectar delays artificiales (RxJS) para simular estados de Loading y Error[cite: 1].
- Persistencia: El estado del carrito debe manejarse en memoria (Signals) y persistirse usando `localStorage`[cite: 1].
- usa las carpetas core(aqui van guards, interceptors, interfaces generales), modules(aquí van los modulos del sistema, ejem: productos) de ser necesario.
- Si cada componente usará interfaces, crea una carpeta interfaces al mismo nivel del componente que usará la interfaz y crea la interfaz (el nombre empezará con I mayúscula seguido del nombre: INombreInterfaz.interface.ts)

# Functional Scope
El flujo debe contemplar las siguientes vistas[cite: 1]:
1. Product List Page (PLP): Grilla de productos (imagen, nombre, precio, variante). Al hacer clic, navega a la PDP[cite: 1].
2. Product Detail Page (PDP) Principal: Galería, información del producto, selector de variantes y botón "Agregar al carrito".
3. PDP Secundaria: Descripción extendida (acordeón/tabs) y Carrusel de Cross-selling[cite: 1].
4. Carrito (Local): Registrar el producto seleccionado sin backend[cite: 1].

# UI / UX & Performance Rules
- USA SCSS para los estilos.
- Referencia de Diseño: Debes leer y basar toda la implementación visual estrictamente en el archivo local ubicado en `.agents/figma/FIGMA.jpg`. Utiliza esta imagen para definir la correcta jerarquía visual, consistencia en layout y spacing[cite: 1].
- Responsive Design: Adaptación a diferentes tamaños de pantalla, reorganizando el layout (no solo escalado) y priorizando contenido en mobile[cite: 1].
- Performance: Optimización de imágenes, Lazy Loading, render eficiente y enfoque en Core Web Vitals (priorizando el LCP).
- SEO Técnico: Uso de HTML semántico, jerarquía estricta de encabezados (h1, h2, etc.) y manejo de metadata considerando SSR.

# Analytics Tracking (Bonus)
- Simular un entorno mediante `dataLayer.push(...)`[cite: 1].
- Eventos requeridos: 
  - `view_item`: Disparar al visualizar la PDP[cite: 1].
  - `add_to_cart`: Disparar al agregar un producto[cite: 1].
- Desacoplamiento: Asegurar la correcta estructura del evento y el momento de disparo, evitando que los eventos de Analytics se disparen múltiples veces en la SPA.
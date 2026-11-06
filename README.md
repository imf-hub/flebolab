# FLEBO LAB IMF

Aplicación educativa profesional del Instituto Mexicano de Flebología. Tres laboratorios: FleboTwin (mecanismos), FleboDUS (cine ecográfico y fundamentos Doppler) y FleboVision (observación clínica). Versión 0.9 de revisión pública, 6 de noviembre de 2026.

## Ejecutar

Requiere Node.js 24 y npm. Desde esta carpeta:

```sh
npm ci
npm run check:content
npm test
npm run dev
```

`npm run build` genera una aplicación estática en `dist/`. `npm run preview` sirve el resultado de producción. El alojamiento debe devolver `index.html` en rutas de aplicación no correspondientes a archivos; no debe devolverlo para medios ausentes.

## Arquitectura

- `src/App.tsx`: portada y navegación.
- `src/labs/twin`: motor 0D independiente, Worker, escena 3D y curvas Plotly cargadas al entrar.
- `src/labs/dus`: explorador, cine indexado, comparación y demostraciones Doppler.
- `src/labs/vision`: biblioteca, OpenSeadragon, comparación y anotaciones.
- `src/pages`: recorridos, método, glosario, guía y créditos.
- `src/shared`: controles, anotaciones normalizadas, persistencia local y recuperación de errores.
- `src/data`: catálogos con IDs, fuentes, licencias, metadatos y relaciones.
- `public/media`: derivados de distribución; no contiene DICOM/RF originales ni cachés de descarga.
- `scripts`: validación de contenido y reproducción de preparación de medios.
- `docs`: arquitectura, evidencia técnica, revisión editorial y alcance de la versión.

React 19, TypeScript 5.9, Vite 7, Three.js, React Three Fiber 9, Drei 10, Plotly.js y OpenSeadragon. Las versiones exactas están fijadas por `package-lock.json`. La aplicación no necesita base de datos remota, autenticación ni secretos de ejecución. Anotaciones, favoritos y progreso se guardan únicamente en el navegador.

## Contenido distribuido

| Recurso | Cantidad y unidad |
|---|---|
| Escenarios Twin | 12 perfiles educativos |
| Anatomía | 12 estructuras izquierdas BodyParts3D |
| Cine de compresión | 72 clips /72 participantes /4 sitios |
| Inspección exacta | 12.830 cuadros en838atlas |
| Fotografía | 96vistas /71 carpetas de caso |
| Termografía | 12 parejas de vista |
| Waterloo | Un renderizado experimental publicado; sin matrices RF importadas |
| Recorridos /glosario | 12 /32 |
| Material visual | 18 láminas,6 animaciones,10 ilustraciones Servier |

Los números no indican prevalencia ni cobertura exhaustiva. Las etiquetas del proveedor no equivalen a una revisión diagnóstica independiente.

## Comprobaciones

- `npm test`: propiedades del modelo, conservación, repetibilidad y convergencia temporal.
- `npm run check:content`: IDs, cobertura, relaciones, archivos y continuidad de índices.
- `npm run build`: comprobación de tipos y compilación de producción.
- `.github/workflows/verify.yml`: los mismos controles en GitHub Actions.
- `docs/CLINICAL_MEDIA_VERIFICATION.json`: verificación de DICOM y derivados.
- `scripts/assets/validation-report.json`: validación Khronos de los13 GLB.

## Naturaleza y límites

El motor es una formulación educativa propia en unidades relativas. No está calibrado para una persona, no resuelve la mecánica de las valvas y no predice resultados de tratamientos. Las animaciones comparten reloj con sus curvas, pero la anatomía de referencia es un recurso independiente.

El tiempo de los cines ThrombUS+ se verificó desde DICOM. No se habilitan distancias ni velocidades hasta validar la calibración por región. El tiempo de reproducción del recurso Waterloo corresponde a su GIF publicado y no demuestra tiempo fisiológico de adquisición. La termografía no proporciona mediciones de temperatura validadas en este visor.

Quedan revisión médica independiente del producto integrado, pruebas con usuarios y dispositivos físicos, calibraciones avanzadas y mayor diversidad de medios. Consultar `docs/ESTADO_IMPLEMENTACION.md` para la trazabilidad con el plan maestro y los pendientes.

## Licencias y actualización

Cada medio conserva su autoría y licencia en el catálogo y en la página Créditos. BodyParts3D, Servier, TRICVI–C, ThrombUS+ y el recurso Waterloo seleccionado se distribuyen según CC BY 4.0 con atribución y transformaciones documentadas. Las bibliotecas conservan sus licencias. La documentación del código no concede derechos sobre figuras de artículos científicos enlazados.

Para actualizar: preparar archivos fuera de `public/`, verificar licencia y procedencia, generar derivados y metadatos, validar contenido y compilación, revisar la presentación integrada y publicar una versión nueva. No sobrescribir un recurso con otro caso manteniendo suID.

El subdominio propio se conectará posteriormente en Hostinger; no se han cambiado DNS.

## Revisión médica documental 0.9.1

La bibliografía se consulta en `/bibliografia`. Ocho referencias de UIP y sociedades flebológicas, cuatro guías vasculares y siete fuentes complementarias; quince DOI contrastados. Véase `docs/content/REVISION_INTEGRADA_0.9.1.md` y las tres matrices de auditoría. La revisión no equivale a aprobación clínica independiente.

El contenido canónico reside en `src/data/educational-content.json`; `python scripts/content/build_educational.py` regenera TypeScript y SVG sin descargar datos. Los registros clínicos se conservan en `clinical-uip.json`, `clinical-vascular.json` y `clinical-science.json`. `build_bibliography.py` usa los metadatos incluidos en `docs/content/bibliographic-metadata.json` y las utilidades de `citation-management` instaladas en `~/.codex/skills`; puede indicarse otra ubicación con `--citation-tools`. Su ejecución no forma parte de la compilación web ni requiere llamadas de red. Las descargas se distribuyen en `public/references`.

Las fuentes médicas se enlazan desde términos, lecciones, guías y recorridos; datos, licencias y herramientas siguen en `/fuentes` y `/creditos`. Las clases originales del banco no se reemplazan por nuevos diagnósticos de la aplicación.


## Versión pública

[Revisar FLEBO LAB0.9.1](https://flebolab-imf.ferver.chatgpt.site). [Acta inicial y pendientes](docs/ACTA_PUBLICACION_2026-11-06.md). [Revisión médica documental0.9.1](docs/content/REVISION_INTEGRADA_0.9.1.md). El subdominio en Hostinger se conectará después.

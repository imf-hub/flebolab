# Identidad visual — FLEBOLAB 0.10.1

6 de noviembre de 2026. Dirección solicitada por el usuario: **tema claro/blanco por defecto, rojo institucional y logotipos originales del Instituto Mexicano de Flebología**. La distribución y la interacción de los laboratorios se conservan.

## Implementación

- HTML declara data-theme="light", meta color-scheme light y theme-color blanco. CSS establece color-scheme light y fondo blanco, sin depender de la preferencia del dispositivo.
- Logotipo horizontal original en cabecera; sello original en pie y favicon. Ambos conservan color, proporción y archivo original; solo se ajusta su tamaño de presentación con CSS. El isotipo rojo y el texto negro corresponden a los originales institucionales.
- La paleta de marca usa rojo #bd292e, texto #202c36, texto secundario #5c6a75 y superficies blancas/gris muy claro. La paleta científica conserva colores distintos para profundo, superficial, conexión y colateral; cambiar marca no cambia la dirección o el significado del flujo.
- Plotly, el circuito SVG, Doppler y la anatomía 3D usan fondos y trazos legibles en claro. Los materiales y la iluminación 3D se adaptaron; se retiró bloom. La etiqueta de proyección Doppler se sitúa completa dentro de su SVG.
- Fotografías, termografías, cines, ecuaciones, valores, referencias y anotaciones de origen no se recolorean ni se invierten por el tema.

## Originales institucionales

Archivos existentes del proyecto institucional Atlas Anatómico Venoso IMF, aportados en el mismo espacio de trabajo. Las copias de distribución son idénticas byte por byte. Los logotipos institucionales no se presentan como recursos clínicos de licencia CC BY.

| Archivo en public/brand | Bytes | SHA-256 |
|---|---|---|
| imf-horizontal.png | 7176 | 113c44c6bfe0b8a931f0a756a3eb3ea7b8300f516043c3297fdcfe6c655aac3a |
| imf-sello.jpg | 170704 | e2e0cf733761de2901e1351e38ed16ab7bf4c0a5fca513e671d068105dd4ec89 |

## Verificación

La revisión de navegador comprobó fondo blanco y color-scheme light, carga de ambos originales, cabecera y pie, gráficos, 3D y observación de fotografías. Móvil 390×844 conserva el menú y no presenta desbordamiento global. Las comprobaciones automáticas de contenido, modelo y compilación se ejecutan antes de publicar en GitHub Pages. Esta revisión visual no modifica la base científica ni su estado de validación clínica.

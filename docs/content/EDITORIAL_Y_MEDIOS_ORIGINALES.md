# Contenido editorial de FLEBO LAB

Fecha: 6 de noviembre de 2026.

El módulo `src/data/educational.ts` contiene 26 recursos de referencia, 33 términos, diez demostraciones Doppler, doce recorridos, siete guías de observación, 18 láminas originales y seis animaciones SVG.

## Alcance de revisión

Se contrastaron fuentes primarias, guías de sociedades y el estándar DICOM. Esta es una revisión editorial y técnica de coherencia; no se atribuye a los autores de las fuentes un aval del producto ni se declara una validación clínica independiente.

Las guías de observación no asignan etiología o CEAP completa a partir de una imagen. Las etapas de los recorridos se enlazan temáticamente; no relacionan como un mismo paciente a sujetos de diferentes bancos. Las lecciones Doppler salvo DP09 son esquemas sintéticos identificados. DP09 exige un extracto experimental real para su vista de datos; sus controles son de reproducción.

## Medios originales

Las 18 láminas y seis animaciones en `public/media/plates` y `public/media/animations` son SVG vectoriales propios. Cada archivo tiene título, descripción accesible, naturaleza de esquema y referencias. No incluyen píxeles de pacientes ni figuras copiadas de artículos.

Las animaciones ilustran mecanismos sin valores cuantitativos de paciente. Su resultado es una pieza de apoyo, no el motor hemodinámico. Las series de la aplicación deben proceder del modelo implementado y mantener una naturaleza identificable.

## Reproducción

`python scripts/content/build_educational.py` regenera los contenidos y medios. El script no descarga ni ejecuta archivos externos y no modifica interfaz, dependencias o publicación.

## Observaciones de implementación

- Conservar `sourceIds` y ofrecer enlaces de consulta cerca del contenido.
- El umbral de reflujo depende del territorio y de la referencia; los comparadores usan estrictamente mayor que cuando esa es la condición citada.
- La frecuencia del cine, la velocidad de reproducción y el eje temporal espectral son referencias diferentes.
- Las unidades de calibración deben validarse por región.
- No sustituir la leyenda de una adquisición real por una paleta universal.
- La inspección final sobre los casos y mediciones concretos sigue siendo parte de la preparación de la versión pública.

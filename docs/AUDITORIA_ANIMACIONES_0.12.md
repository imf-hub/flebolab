# Aula visual 0.12 — implementación, cobertura y revisión

6 de noviembre de 2026 · GitHub Pages · interfaz blanca y roja IMF.

## Resultado y límite de esta entrega

31 explicaciones web complementarias, 124 tomas con guion y storyboard. Las 31 tienen reproducción visual, texto, pausa, salto y fuentes. Once incluyen audio continuo de Rocío, marcas reales y WebVTT: 615,55 segundos en total (10 min 15,55 s), 7,39 MB de MP3 para distribución. Las veinte restantes se identifican como guías visuales sin voz, con tiempos de lectura estimados. No se entregaron archivos MP4 ni un exportador de video.

La solicitud de voz TW12 falló en el transporte sin devolver audio, identificador del proveedor ni marcas. Su resultado y consumo de cuota son desconocidos. Se solicitó confirmación para continuar o reintentar; no se hizo ninguna retoma automática. Los guiones pendientes están completos y versionados. Véase `docs/narration/STATUS.json`.

## Correspondencia por pieza

Cada fila representa cuatro tomas. La transición citada identifica un cambio observable; las fuentes abren el documento de origen. El audio es un recurso producido, no una acreditación médica.

| ID | Concepto | Cambio y consecuencia observables | Fuentes | Modalidad |
|---|---|---|---|---|
| TW01 | La postura cambia el contexto | Presión y altura → Cambia una condición | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 59.92 s |
| TW02 | Del decúbito a la bipedestación | Lee el circuito → Contrasta la postura | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 55.77 s |
| TW03 | La bomba muscular en acción | Eyección → Relajación y relleno | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 59.38 s |
| TW04 | Qué cambia al reducir la bomba | Observa la onda → Perfil de contraste | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 56.06 s |
| TW05 | Apertura y coaptación valvular | Apertura → Coaptación | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 56.87 s |
| TW06 | Cómo se representa una fuga | Durante la eyección → Inversión calculada | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 57.00 s |
| TW07 | La conexión entre sistemas | Sigue el intercambio → Confirma en el circuito | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 57.60 s |
| TW08 | Una conexión menos conductora | Resultado del ciclo → Contraste controlado | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 50.70 s |
| TW09 | Resistencia a la salida | Lee la consecuencia → Comprueba los nodos | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 52.90 s |
| TW10 | Una vía colateral en la red | Distribución del flujo → Sin esa rama | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 53.81 s |
| TW11 | Presión exterior y volumen | Mira el volumen → Presión no es receta | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Voz · 55.54 s |
| TW12 | Mecanismos que interactúan | Observa un ciclo → Verifica el circuito | [uiphemodynamics](https://pubmed.ncbi.nlm.nih.gov/27013029/), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [keijsers2015](https://doi.org/10.1002/cnm.2714) | Visual sin voz |
| DP01 | Dirección del haz y del flujo | La proyección → Cambia el sentido relativo | [uipduplex1](https://doi.org/10.1016/j.ejvs.2005.07.019), [dopplerphysics](https://doi.org/10.1016/j.bjae.2020.01.003), [asa](https://www.sonographers.org/resources/clinical-resources/cvi-guideline) | Visual sin voz |
| DP02 | El mapa de color puede invertirse | Invierte la presentación → Movimiento en otro sentido | [uipduplex1](https://doi.org/10.1016/j.ejvs.2005.07.019), [asa](https://www.sonographers.org/resources/clinical-resources/cvi-guideline) | Visual sin voz |
| DP03 | Encuentra la línea base | Desplaza la línea base → Otra posición | [dicom](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html), [dopplerphysics](https://doi.org/10.1016/j.bjae.2020.01.003) | Visual sin voz |
| DP04 | Escala y fisiología son cosas distintas | Amplía la escala → Acerca el rango | [dicom](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html), [dopplerphysics](https://doi.org/10.1016/j.bjae.2020.01.003) | Visual sin voz |
| DP05 | El papel del ángulo Doppler | Hacia la perpendicular → Frecuencia de emisión | [uipduplex1](https://doi.org/10.1016/j.ejvs.2005.07.019), [dopplerphysics](https://doi.org/10.1016/j.bjae.2020.01.003), [asa](https://www.sonographers.org/resources/clinical-resources/cvi-guideline) | Visual sin voz |
| DP06 | Aliasing: un límite del muestreo | Aparece el plegamiento → Recupera el intervalo | [dopplerphysics](https://doi.org/10.1016/j.bjae.2020.01.003) | Visual sin voz |
| DP07 | Tiempo, evento y maniobra | El momento importa → Delimita el intervalo | [uipduplex1](https://doi.org/10.1016/j.ejvs.2005.07.019), [ksp2023](https://www.annphlebology.org/journal/view.html?uid=142&vmd=Full), [dicom](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html), [asa](https://www.sonographers.org/resources/clinical-resources/cvi-guideline) | Visual sin voz |
| DP08 | Variación temporal del flujo | Modulación menor → Otra periodicidad | [uipduplex1](https://doi.org/10.1016/j.ejvs.2005.07.019), [asa](https://www.sonographers.org/resources/clinical-resources/cvi-guideline) | Visual sin voz |
| DP09 | Flujo femoral en un cine experimental | Observa el movimiento → Límite de medición | waterloo | Visual sin voz |
| DP10 | Duración del flujo inverso | Compara intervalos → El territorio cambia el contexto | [uipduplex1](https://doi.org/10.1016/j.ejvs.2005.07.019), [uipduplex2](https://doi.org/10.1016/j.ejvs.2005.07.020), [svs2022](https://doi.org/10.1016/j.jvsv.2022.09.004), [svs2023](https://www.phlebology.ch/upload/pdf/dokumente/AVLS%20guidelines%2020230.pdf), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), [asa](https://www.sonographers.org/resources/clinical-resources/cvi-guideline) | Visual sin voz |
| CEAP-C0 | Sin signos visibles o palpables | Describe el recurso → Completa el contexto | [ceap2020](https://doi.org/10.1016/j.jvsv.2019.12.075), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), tricvi | Visual sin voz |
| CEAP-C1 | Telangiectasias o venas reticulares | Observación con límites → El contexto del tobillo | [ceap2020](https://doi.org/10.1016/j.jvsv.2019.12.075), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), tricvi | Visual sin voz |
| CEAP-C2 | Várices y recurrencia | Más allá del aspecto → Cuándo hablar de recurrencia | [ceap2020](https://doi.org/10.1016/j.jvsv.2019.12.075), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), tricvi | Visual sin voz |
| CEAP-C3 | Edema y contexto clínico | Observa sin concluir de más → Exploración necesaria | [ceap2020](https://doi.org/10.1016/j.jvsv.2019.12.075), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), tricvi | Visual sin voz |
| CEAP-C4 | Cambios cutáneos: las tres subclases | Pigmentación y eccema → Induración y atrofia blanca | [ceap2020](https://doi.org/10.1016/j.jvsv.2019.12.075), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), tricvi | Visual sin voz |
| CEAP-C5 | Úlcera venosa cicatrizada | Describe el área → Cicatrizada no es sin enfermedad | [ceap2020](https://doi.org/10.1016/j.jvsv.2019.12.075), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), tricvi | Visual sin voz |
| CEAP-C6 | Úlcera activa y recurrencia | Describe lo observable → Recurrencia documentada | [ceap2020](https://doi.org/10.1016/j.jvsv.2019.12.075), [esvs2022](https://findresearcher.sdu.dk/ws/files/206201181/1_s2.0_S1078588421009795_main.pdf), tricvi | Visual sin voz |
| AN01 | Anatomía por planos | Plano muscular → Territorios venosos | [uipnomenclature](https://doi.org/10.1067/mva.2002.125847), [uipduplex2](https://doi.org/10.1016/j.ejvs.2005.07.020), bodyparts3d | Visual sin voz |
| DC01 | Observar una compresión real | Sigue la maniobra → Pausa con propósito | [uipduplex1](https://doi.org/10.1016/j.ejvs.2005.07.019), [aium2026](https://www.aium.org/resources/practice-parameters/peripheral-venous), [esvsthrombosis2021](https://doi.org/10.1016/j.ejvs.2020.09.023), thrombus | Visual sin voz |

## Revisión médica documental

Se mantuvo la prioridad UIP/flebología, seguida de sociedades vasculares y fuentes complementarias. Se contrastaron el consenso UIP de hemodinámica, los consensos de dúplex/nomenclatura, CEAP 2020, KSP, SVS/AVF/AVLS, ESVS y documentación de los bancos. La bibliografía completa y las controversias conservan 19 referencias; las piezas declaran su selección particular.

- Twin usa el solver propio `imf-0d-relative-1.1`. No se modificaron sus ecuaciones. Los trazadores siguen transporte calculado; las superficies valvulares y la envoltura muscular son ilustrativas. La pared cortada contiene tres capas sin escala histológica; las inserciones no se desplazan al deformar las valvas.
- Se ajustaron las fases de coaptación TW05 e inversión TW06 con el resultado numérico real. La conexión perforante y la colateral tienen su propia curva y lectura; la presión exterior utiliza volumen y presión del compartimento superficial.
- Los principios Doppler separan cambio físico, proyección, inversión de mapa, desplazamiento de línea base, rango gráfico y aliasing. La curva sintética incluye cero, escala y tiempo. No es una adquisición clínica.
- DP10 conserva criterios segmentarios de SVS/AVF/AVLS 2023 §1.3.1 y acceso a UIP en primer lugar. Se explicita la diferencia de notación de perforantes entre Parte I (2022: ≥) y Parte II (2023: >), además de la variación ESVS que ya estaba documentada. Los valores de frontera requieren declarar el protocolo; no se emite un diagnóstico desde la curva.
- CEAP conserva C0–C6, C4a/b/c y los dominios del laboratorio. Los ejemplos C4 no reciben subclases automáticas. Para C5 se seleccionaron vistas 5 y 1 de C5/001; para C6, vistas 1 y 5 de C6/003, por mejor exposición del área. La interfaz dice que son dos vistas del mismo registro. Se conservan etiquetas del proveedor; esta selección visual no es adjudicación clínica por miembro.
- DC01 utiliza los 213 cuadros originales del clip de compresión seleccionado y su temporización DICOM. El ritmo docente y el tiempo de adquisición se identifican por separado. Waterloo conserva su renderizado publicado y no se presenta como una matriz de velocidades.

## Verificación técnica y visual

- 78 pruebas automatizadas: modelo y contratos previos, 31×4 tomas, fuentes resolubles, tiempos, texto, búsqueda temporal, signos de flujo, proyección, muestreo y geometría finita.
- `check:content` conserva el banco anterior y verifica también guiones, 31 vistas previas, archivos de audio, hashes, SSML y coincidencia de transcripción. Las once voces aceptadas pasaron FFprobe y verificación de marcas; no se cambió velocidad ni tono.
- Navegador local: se accionaron los 124 pasos a 1280×720 y se conservaron estados/capturas en `artifacts/qa-0.12`. No hubo desbordamiento del área de escritorio en el recorrido. Se inspeccionaron presentaciones de las 31 piezas y se corrigieron tamaño de ejes, lectura del circuito, etiquetas, fases valvulares y salto del video experimental.
- Se observó reproducción completa de TW05 y TW06 en la interfaz, con final, cambio de tomas y retorno a pausa. Se comprobó el salto experimental a 3,66 s y el retorno a cuadros originales de compresión. Esto no acredita una escucha humana integral.
- Pantalla emulada 390×844: rutas Twin, Doppler, CEAP, anatomía y cine; controles de reproducción antes de la escena y fijos durante el desplazamiento. Las fotografías conservan proporciones y se apilan en pantalla estrecha. No son pruebas en un teléfono físico.

## Qué sigue pendiente

1. Confirmación tras el fallo para completar veinte narraciones; escucha integral, pronunciación y ajuste editorial posterior.
2. Aprobación médica independiente del producto integrado y registro de los revisores. La revisión documental y los tests no equivalen a validación clínica.
3. Pruebas con médicos y dispositivos físicos, auditoría amplia de accesibilidad y perfilado de rendimiento en equipos de recursos limitados.
4. Mayor diversidad anatómica y clínica; espectros reales de reflujo calibrados, datos RF cuantitativos Waterloo y calibración regional antes de habilitar distancias.
5. Exportación MP4 reproducible si se solicita; esta entrega es interactiva web.
6. Conexión DNS del subdominio Hostinger en la fase posterior acordada.

## Reproducibilidad

El código editable está en `src/learning`, las mejoras de escena en `src/labs/twin`, los guiones en `scripts/build-guided-lessons.py`, la procedencia de voz en `docs/narration` y los derivados publicados en `public/media`. Se conservaron los originales del proyecto Flebo Animaciones. La guía de mantenimiento está en [GUIA_PRODUCCION_ANIMACIONES.md](GUIA_PRODUCCION_ANIMACIONES.md).

## Corrección 0.12.1: disponibilidad del recurso

La revisión pública detectó intervalos sin indicación durante la primera descarga de fotografías, anatomía y video. Se añadieron estados de carga/error y la reproducción inicial espera al recurso visual. Twin espera escena y curva; la anatomía espera la geometría; Vision espera ambas imágenes; el cine espera el primer cuadro y Waterloo un cuadro decodificado, incluso a tiempo cero. El cine anticipa el siguiente atlas sin inventar fotogramas.

Se comprobaron en navegador las 31 piezas con su botón de reproducción habilitado después de cargar; el video experimental conserva el salto a 3,66 s. La corrección no modifica guiones, parámetros médicos, imágenes originales ni el número de voces. El informe HTTP comprueba 119 recursos y rangos de audio; los informes públicos y capturas finales se conservan con la entrega local.

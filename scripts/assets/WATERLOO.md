# Extracto público experimental UW-FemVeinRF

**Disponible:** cine y figura renderizados por los autores. **No importado:** RF, HDF5 ni matrices numéricas de velocidad.

## Entrega

| Recurso | Ruta pública | Tamaño |
|---|---|---|
| Cine H.264/MP4 | `/media/waterloo/uw-femvein-acq0.mp4` | 4,683,689 bytes |
| Portada, cuadro de índice 54 | `/media/waterloo/uw-femvein-acq0-poster.png` | 280,559 bytes |
| Figura de reconstrucción original | `/media/waterloo/uw-femvein-reconstruction.png` | 351,975 bytes |
| Licencia | `/media/waterloo/LICENSE-CC-BY-4.0.txt` | Texto oficial CC BY 4.0 |

Registro completo: `src/data/waterloo.json`. El manifest fija la fuente al commit `5eae31257f55391129c5aadb178659948448da5d` de `open-h/Open-H-RF`, incluye autoría, SHA-256, cambios técnicos, ejes y límites de interpretación.

## Procedencia y alcance

El README oficial de UW-FemVeinRF enlaza el archivo `assets/Acq0.gif` como cine de `data/Acq0.hdf5` generado a partir de los campos proporcionados. Se descargó únicamente ese GIF de 15,173,953 bytes, la figura `reconstruct_output.png` de 351,975 bytes y los documentos de procedencia. El GIF queda en la caché excluida de Git. No se descargó ningún archivo RF ni se accedió al corpus de 941.96 GB.

Fuentes originales:

- [Ficha del conjunto](https://github.com/open-h/Open-H-RF/blob/5eae31257f55391129c5aadb178659948448da5d/datasets/waterloo-femoralvein/README.md).
- [GIF publicado](https://github.com/open-h/Open-H-RF/blob/5eae31257f55391129c5aadb178659948448da5d/datasets/waterloo-femoralvein/assets/Acq0.gif).
- [Figura original](https://github.com/open-h/Open-H-RF/blob/5eae31257f55391129c5aadb178659948448da5d/datasets/waterloo-femoralvein/assets/reconstruct_output.png).
- [Script oficial de reconstrucción](https://github.com/open-h/Open-H-RF/blob/5eae31257f55391129c5aadb178659948448da5d/datasets/waterloo-femoralvein/reconstruct.py).

El dataset declara licencia **CC BY 4.0** en su ficha. El código `reconstruct.py` declara por separado Apache-2.0; no confundir la licencia del código con la de los datos. Atribución recomendada:

> UW-FemVeinRF, VORTEX / LITMUS, University of Waterloo, publicado en Open-H-RF. Nahas, Cohen, Zafiris, Ling, Yu y Au (2026). CC BY 4.0. FLEBOLAB: transcodificación del GIF original a MP4 y selección de un cuadro como portada; figura PNG sin modificaciones.

## Calibración y límites

El GIF contiene **61 cuadros**, todos con una demora codificada de **100 ms**, por lo que la reproducción dura **6.1 s** a **10 fps**. Esa es la temporización de la animación publicada, **no una tasa de adquisición ni una duración fisiológica demostradas**. Los primeros cuadros muestran B-mode y los cuadros 48–60 incluyen vectores coloreados; se verificaron visualmente cuadros de ambos segmentos. El poster muestra el cuadro 54.

La conversión conserva todos los cuadros y su velocidad de reproducción. Usa H.264, CRF 20, `yuv420p`, sin audio ni recorte; añade una columna de relleno para pasar de 761 a 762 píxeles de ancho. Se declara la compresión con pérdidas. No se añadieron vectores, curvas ni anotaciones.

La figura PNG tiene ejes espaciales en milímetros. El script oficial describe un grid de x = −19 a 19 mm y z = 10 a 60 mm, 381 × 501 puntos, así como campos vectoriales expresados en m/s en los HDF5. El video renderizado no incluye ejes ni una leyenda cuantitativa verificada. Esas descripciones **no habilitan mediciones en el raster**. No se recuperaron velocidades de los colores ni se generó una curva experimental.

La ficha documenta un protocolo de flexión plantar isométrica con carga de 8 kg e inclinación cefálica de 40°. No se consultaron metadatos individuales de Acq0. La aprobación ética ORE #46018 y los consentimientos para compartir datos son declaraciones de los autores en la ficha, conservadas como procedencia.

Uso previsto: reconocer la diferencia entre B-mode y un campo de flujo vectorial estimado; explorar el aspecto de un recurso experimental real; estudiar su procedencia y sus límites. No usar el archivo para medir reflujo, diámetros, caudal, velocidad o tiempos fisiológicos. La ficha advierte ruido Doppler, vistas subóptimas y sensibilidad del dealiasing al ruido con baja potencia.

**Pendiente para cumplir una comparación cuantitativa con datos experimentales:** importar matrices vectoriales o una serie temporal real, con muestreo temporal y ROI documentados, validación de unidades y extracción reproducible. Este recurso aporta el medio experimental real, no esa señal numérica.

## Verificación técnica

- El SHA-1 Git calculado del GIF descargado es `c40d7c1ef9541e11d5f3008eb242732a447736e2`, igual al blob del repositorio oficial.
- El SHA-256 del GIF es `c82f220cada475b0fb384c1b34b173cf18ccf7bb45e5b28d81879edb4aa279e8`.
- `ffprobe` verificó H.264, 762 × 1002, 61 cuadros y 6.1 s; una decodificación completa con `ffmpeg` terminó sin errores.
- Los hashes de los tres medios publicados coinciden con el manifest.
- Se inspeccionaron el B-mode, un cuadro con overlay y la figura con ejes.

Reproducción:

```powershell
python .\scripts\assets\prepare_waterloo.py
```

Requiere Python, Pillow y FFmpeg. Los documentos y originales se guardan en `scripts/assets/.cache/waterloo`, excluida de Git por el `.gitignore` local.

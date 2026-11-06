# Auditoría numérica del dominio de FleboTwin

Fecha: 6 de noviembre de 2026. Modelo final examinado: `imf-0d-relative-1.1`.

## Resultado de la revisión de la versión 1.1

Se examinaron 384 combinaciones de frontera y 1000 combinaciones interiores reproducibles del dominio permitido. No se observaron volúmenes nulos o negativos, resultados no finitos ni casos sin convergencia. Los doce escenarios nominales también convergieron.

| Comprobación | Resultado |
| --- | --- |
| Menor volumen de los cuatro compartimentos, incluyendo el calentamiento | 3,65245027598 unidades relativas |
| Máxima diferencia absoluta entre salida media y entrada constante 0,7 | 0,000382685197, aproximadamente 0,055 % de la entrada |
| Intervalo observado de salida media | 0,699617314803–0,700095623925 |
| Máximo error global de conservación observado | 1,0374 × 10⁻⁹ |
| Máximo residual relativo al terminar el calentamiento | 0,00000962065247, inferior a 0,00001 |
| Mayor tiempo de calentamiento observado | 950 s del modelo |
| Casos sin convergencia entre las 1384 combinaciones | 0 |
| Casos con valores no finitos | 0 |
| Casos con volumen menor o igual a cero | 0 |

La combinación con menor volumen fue: postura 0°, bomba 1,6, conductancia inversa 0, resistencia de salida 1, presión exterior 1,5, conexión perforante 1,6, colateral activa y período 2 s. Al reducir el paso solicitado de 0,01 a 0,005, el mínimo fue 3,65532786162. La diferencia es pequeña y el estado permanece positivo.

El caso que más tardó en converger combinó postura 90°, bomba 1,6, conductancia inversa 0, resistencia 8, presión exterior 0, perforante 0, sin colateral y período 10 s. Convergió tras 95 ciclos, equivalentes a 950 s.

Se repitieron cuatro combinaciones críticas con la mitad de paso: menor volumen, mayor desviación de salida media, mayor residual y mayor tiempo de calentamiento. Los resultados permanecieron finitos, positivos y convergentes. Las diferencias de presión media fueron inferiores al 1 %. Se comprobaron además solicitudes de paso cero, negativo, infinito, NaN, demasiado pequeño y demasiado grande; el límite defensivo de la versión 1.1 produjo resultados finitos.

Estos resultados respaldan conservar provisionalmente el límite de presión exterior en **1,5**. El barrido es evidencia numérica sobre las combinaciones examinadas; no es una demostración matemática de positividad en todo punto del dominio continuo ni una validación clínica.

## Dominio examinado

| Parámetro | Intervalo de la versión 1.1 |
| --- | --- |
| Postura | 0–90° |
| Activación de bomba | 0–1,6 |
| Conductancia inversa | 0–1 |
| Multiplicador de resistencia de salida | 1–8 |
| Presión exterior | 0–1,5 |
| Multiplicador de conexión perforante | 0–1,6 |
| Colateral | Desactivada / activada |
| Período | 2–10 s del modelo |
| Paso solicitado | Normal 0,01; comprobación crítica 0,005. El programa limita a 0,001–0,02 y ajusta a un número entero de pasos por ciclo. |

Las 384 combinaciones de frontera incluyen los extremos de todos los parámetros continuos, ambos estados de colateral y un valor adicional de conductancia inversa 0,02. Los mil puntos interiores usan un generador determinista con semilla 11062026. El período interior se toma en incrementos de 0,5 s, como en la interfaz.

## Hallazgos de la versión 1.0 que motivaron las correcciones

La copia examinada inicialmente fue `imf-0d-relative-1.0`, SHA256 `7e6e8902ed39d7227126d39c941568166913c61e1d774f5fda31b27f5f7f03ed`.

1. **Volumen negativo en un compartimento que no se exportaba.** Con postura 0°, bomba 1,6, fuga 0, resistencia 1, presión exterior 2,5, perforante 1,6, colateral activa y período 10 s, el volumen superficial distal alcanzaba −1,28839175273. Al dividir el paso por dos persistía en −1,28605786212. El error global de conservación seguía alrededor de 10⁻¹¹: conservar el balance no garantizaba admisibilidad de cada compartimento. Ningún escenario nominal TW01–TW12 tuvo volumen negativo.
2. **Doce ciclos no garantizaban régimen periódico.** TW02 acumulaba aproximadamente +3,38992 de volumen en su ventana y TW09 +5,29567. El extremo vertical con resistencia 8, perforante 0 y sin colateral acumulaba +6,06022. Repetir esas ventanas reiniciaba un estado diferente. El calentamiento adaptativo de la versión 1.1 comprueba el cierre de los cuatro estados durante tres ciclos consecutivos.
3. **Integración de un intervalo adicional.** La versión 1.0 añadía el flujo del punto final a la integral aunque ya no avanzaba el estado. En un TW02 totalmente asentado daba salida media 0,70059218555 frente a 0,70000000000 al integrar solo los intervalos avanzados. La versión 1.1 conserva el punto final para representación y restringe las integrales a los intervalos efectivos.

El barrido inicial abarcó 256 vértices y 1500 puntos interiores. Un barrido focalizado encontró volumen negativo desde presión exterior 2,3 en algunas combinaciones horizontales. A 2,2 quedaba un margen de solo 0,20996 en el peor vértice; a 2,0, de 1,20885. Estos valores no se proponen como nuevos límites: el límite conservador elegido es 1,5.

La copia 1.0 con presión exterior limitada a 1,5 se comprobó además en 384 combinaciones de frontera con 120 ciclos de calentamiento y 500 interiores con 60 ciclos: no produjo volúmenes negativos y su mínimo fue 3,65227191949. La auditoría final sobre el código real 1.1 confirma el resultado con calentamiento adaptativo.

## Supuestos que debe conservar la explicación científica

- **Es una red genérica en unidades relativas.** No está ajustada a una persona, a las mallas anatómicas ni a las imágenes clínicas de la biblioteca.
- **La entrada total está fijada en 0,7.** En un régimen periódico conservativo, la salida media debe aproximarse a 0,7. El parámetro de bomba, la fuga o la resistencia cambian presiones, distribución de volumen, inversión y forma temporal; la salida media no estima capacidad funcional ni eficacia terapéutica.
- **La pared es lineal.** Aun con volumen positivo puede aparecer presión transmural negativa. En la combinación de menor volumen de la versión 1.1, el primer punto superficial distal tiene presión interior 1,030573 y exterior 1,5: su presión transmural es aproximadamente −0,469427. Eso es compatible con la ecuación implementada; no representa el colapso y contacto de una vena real. El límite 1,5 evita los volúmenes negativos observados, pero no convierte la ley de pared en una representación validada del colapso.
- **Las grandes variaciones son del circuito.** En algunos extremos la red acumula volúmenes varias veces superiores a los de referencia. No deben interpretarse como distensiones cuantitativas de venas biológicas; no hay ley no lineal de endurecimiento ni ajuste morfométrico.
- **Las resistencias valvulares son asimétricas y sin mecánica de valvas.** El parámetro de fuga actúa según cada conexión; la perforante tiene un mínimo de conductancia inversa 0,01 y la colateral emplea 0,01 fijo. No todas las conexiones pasan a ser válvulas ideales al situar el control general en cero.
- **La presión exterior del control se aplica a los compartimentos superficiales.** La activación muscular aplica otro perfil a los profundos. Es una decisión de esta red; no simula una prenda ni una dosis clínica de compresión.
- **Las estadísticas son aproximaciones numéricas.** La presión media se calcula sobre las muestras de representación, no con una cuadratura independiente de todos los pasos. La comparación de paso examinada es satisfactoria para el objetivo ilustrativo; no justifica precisión clínica.

## Recomendaciones de continuidad

Mantener el límite 1,5 y la comprobación de mínimo de los cuatro volúmenes; no recortar silenciosamente volúmenes negativos a cero, porque rompería el balance o escondería un dominio inválido. Si una futura modificación produce volumen no positivo o no converge, marcar ese resultado como fuera del dominio y conservar la información de auditoría.

Conservar en pantalla y exportación la versión, parámetros, convergencia, residual, ciclos de calentamiento y mínimo de volumen. No presentar una marca de conservación numérica como validación científica del modelo. Una ampliación de rangos o un cambio de ley de pared requiere repetir el barrido.

La preparación para un uso médico más amplio sigue requiriendo revisión independiente del contenido y una comparación de los mecanismos y curvas con referencias adecuadas. Esta auditoría es de coherencia e integridad numérica.

## Reproducción y evidencia

Código real 1.1 auditado: SHA256 `0662fdb8d6cba811fbe7b3f8cf72781ba81fd12ef180bd2af2fc5cb0efc60bac`.

Los scripts están fuera de `src` y no se importan en la aplicación. Transpilan una copia en memoria y no escriben el modelo, la interfaz, las dependencias o `.git`.

```powershell
node scripts/content/audit_model_current.cjs
node scripts/content/audit_model_current.cjs --source=docs/content/verification/model-current.audit.ts
node scripts/content/audit_model_domain.cjs --source=docs/content/verification/model-baseline.audit.ts
node scripts/content/audit_model_restrictions.cjs --source=docs/content/verification/model-baseline.audit.ts
node scripts/content/audit_model_cap15.cjs --source=docs/content/verification/model-baseline.audit.ts
```

Evidencias en `docs/content/verification`:

- `model-current-domain-audit.json`: versión 1.1 real, parámetros de los peores casos, nominales, mitad de paso y entradas anómalas de paso.
- `model-current.audit.ts`: copia exacta del código 1.1 examinado.
- `model-domain-audit.json`: barrido inicial de la versión 1.0.
- `model-domain-restrictions.json`: localización del margen de presión exterior y comparación de calentamiento largo.
- `model-cap15-audit.json`: margen 1,5 sobre la copia 1.0, con calentamientos ampliados.
- `model-baseline.audit.ts`: copia exacta 1.0 examinada.

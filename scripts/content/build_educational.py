"""Contenido editorial y diagramas originales de FLEBO LAB.

Los esquemas son representaciones didácticas; no representan estudios de pacientes.
"""
from pathlib import Path
import html
import json
import math

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "src" / "data"
PLATES = ROOT / "public" / "media" / "plates"
ANIMATIONS = ROOT / "public" / "media" / "animations"
for folder in [DATA, PLATES, ANIMATIONS, ROOT / "docs" / "content"]:
    folder.mkdir(parents=True, exist_ok=True)

sources = [
    dict(id="ceap2020", title="CEAP 2020: clasificación y documentación", url="https://pubmed.ncbi.nlm.nih.gov/32113854/", type="Clasificación", summary="Referencia para describir manifestaciones clínicas, etiología, anatomía y fisiopatología por miembro; incorpora corona flebectásica y modificadores de recurrencia.", credit="Lurie y colaboradores, J Vasc Surg Venous Lymphat Disord, 2020", license="Referencia bibliográfica; no se reproducen sus figuras"),
    dict(id="svs2022", title="SVS / AVF / AVLS: evaluación dúplex", url="https://doi.org/10.1016/j.jvsv.2022.09.004", type="Guía clínica", summary="Sustenta la evaluación de reflujo con dúplex, la documentación del segmento y la aplicación de criterios diferenciados.", credit="Society for Vascular Surgery, American Venous Forum y American Vein and Lymphatic Society", license="Referencia bibliográfica; derechos de figuras separados"),
    dict(id="esvs2022", title="ESVS 2022: enfermedad venosa crónica", url="https://esvs.org/wp-content/uploads/2023/03/ESVS-2022-CVD-Guidelines.pdf", type="Guía clínica", summary="Marco de referencia para anatomía, mecanismos, evaluación y contexto de enfermedad venosa de miembros inferiores.", credit="European Society for Vascular Surgery, 2022", license="Consulta de la guía; no se importan sus figuras"),
    dict(id="asa", title="ASA: exploración de insuficiencia venosa", url="https://sonographers.org/resources/clinical-resources/cvi-guideline", type="Guía de sonografía", summary="Organiza anatomía, maniobras, interpretación y documentación. Sus apartados ayudan a separar lo observado de los requisitos de una exploración completa.", credit="Australasian Sonographers Association; sección E actualizada en 2025", license="Referencia; cada recurso enlazado conserva sus derechos"),
    dict(id="dicom", title="DICOM: calibración de regiones ultrasónicas", url="https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.8.5.5.html", type="Estándar técnico", summary="Define unidades y calibración por región de la imagen: distancia, tiempo, velocidad y otros parámetros no son intercambiables.", credit="DICOM Standards Committee / NEMA, PS3.3", license="Referencia al estándar"),
    dict(id="keijsers2015", title="Modelo de la bomba muscular de pantorrilla", url="https://pmc.ncbi.nlm.nih.gov/articles/PMC4676919/", type="Modelo científico", summary="Estudia mecanismos de bomba, válvulas, gravedad y colapso venoso mediante una formulación unidimensional.", credit="Keijsers y colaboradores, 2015; DOI 10.1002/cnm.2714", license="Referencia científica; el motor de FLEBO LAB es una formulación educativa propia"),
    dict(id="ferlito2026", title="Modelo venoso 1D de miembro inferior", url="https://doi.org/10.1109/TBME.2026.3701594", type="Modelo científico", summary="Referencia de los mecanismos combinados de válvulas, perforantes, bomba muscular, gravedad y presión exterior.", credit="Ferlito, Reda, Sen, Alastruey y Avril, 2026", license="Referencia; no se afirma reutilizar el código de los autores"),
    dict(id="tricvi", title="TRICVI-C v2: RGB y termografía", url="https://data.mendeley.com/datasets/rf5m97cmm3/2", type="Datos clínicos", summary="Fotografías y termografía con clasificación clínica de origen. Se mantienen relacionadas las vistas de un mismo caso.", credit="Julian Ruiz, Pilar Gomez-Gil y Francisco Renero, 2026; DOI 10.17632/rf5m97cmm3.2", license="CC BY 4.0"),
    dict(id="thrombus", title="ThrombUS+: compresión ecográfica", url="https://zenodo.org/records/17659415", type="Datos clínicos", summary="Cines multisegmentarios de compresión con etiquetas del proveedor. Su selección docente no representa prevalencia clínica ni una exploración de reflujo completa.", credit="Consorcio ThrombUS+; Didaskalou, Portokallidis y Kaldoudi", license="CC BY 4.0 según el registro de Zenodo consultado"),
    dict(id="waterloo", title="UW-FemVein RF / Open-H-RF", url="https://github.com/open-h/Open-H-RF/blob/main/datasets/waterloo-femoralvein/README.md", type="Datos experimentales", summary="Adquisiciones femorales y campos de velocidad durante contracción muscular e inclinación. Se identifica el procesamiento de cada extracto.", credit="Nahas, Cohen, Zafiris, Ling, Yu, Au y VORTEX, University of Waterloo, 2026", license="CC BY 4.0"),
    dict(id="dopplerphysics", title="Física del Doppler: frecuencia, ángulo y muestreo", url="https://pmc.ncbi.nlm.nih.gov/articles/PMC7807840/", type="Referencia de física", summary="Referencia conceptual para desplazamiento Doppler, proyección angular y límites del muestreo pulsado.", credit="P. Magee. Essential notes on the physics of Doppler ultrasound. BJA Education, 2020;20(4):112–113. DOI 10.1016/j.bjae.2020.01.003", license="Referencia bibliográfica; diagramas de FLEBO LAB originales"),
    dict(id="bodyparts3d", title="BodyParts3D", url="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html", type="Anatomía de referencia", summary="Fuente de geometrías anatómicas. Cada subconjunto usado se identifica en la ficha del activo.", credit="BodyParts3D, Database Center for Life Science", license="CC BY 4.0 según la página vigente del original"),
    dict(id="servier", title="Servier Medical Art", url="https://smart.servier.com/using-smart-images-what-you-can-do/", type="Ilustración", summary="Recurso para ilustración adaptada con atribución, sin confundir ilustraciones y estudios clínicos reales.", credit="Servier Medical Art", license="CC BY 4.0; atribución por activo"),
    dict(id="bioart", title="NIH BioArt Source", url="https://bioart.niaid.nih.gov/terms", type="Ilustración", summary="Ilustraciones científicas con condiciones y créditos en cada entrada. El uso de una fuente institucional no implica un aval de la aplicación.", credit="NIAID NIH BioArt Source", license="Ver licencia de la entrada concreta"),
    dict(id="svzerod", title="svZeroDSolver", url="https://github.com/SimVascular/svZeroDSolver", type="Herramienta científica", summary="Referencia de redes hemodinámicas y bloques valvulares para contrastar formulaciones reducidas.", credit="Stanford University, University of California y colaboradores", license="BSD-3-Clause; dependencias con sus propios avisos"),
]

def term(i, label, english, aliases, definition, refs):
    return dict(id=f"G{i:02d}", term=label, english=english, aliases=aliases, definition=definition, sourceIds=refs)

glossary = [
    term(1,"Retorno venoso","Venous return",["retorno"],"Flujo que retorna desde la periferia hacia el corazón. En el laboratorio se observa a través de la red y las fronteras del modelo.",["keijsers2015","esvs2022"]),
    term(2,"Presión transmural","Transmural pressure",["Ptm"],"Diferencia entre la presión dentro del vaso y la presión exterior. Ayuda a relacionar el entorno del vaso con su volumen.",["keijsers2015"]),
    term(3,"Gradiente de potencial","Pressure potential gradient",["carga gravitacional"],"Diferencia que impulsa el flujo cuando se consideran presión y altura con una convención de referencia común.",["keijsers2015"]),
    term(4,"Complianza venosa","Venous compliance",["compliance"],"Variación de volumen por variación de presión en una condición definida. La distensibilidad normaliza esa respuesta por el volumen de referencia; no son magnitudes intercambiables.",["keijsers2015"]),
    term(5,"Competencia valvular","Valve competence",["válvula competente"],"Capacidad funcional representada de limitar el flujo inverso. La animación muestra el estado de una formulación educativa.",["keijsers2015","ferlito2026"]),
    term(6,"Reflujo venoso","Venous reflux",["flujo retrógrado"],"Flujo inverso evaluado con su duración, territorio y condiciones de provocación. Una inversión breve o un color aislado no completan su interpretación.",["svs2022","asa"]),
    term(7,"Obstrucción","Venous obstruction",["resistencia de salida"],"Limitación de la vía de salida. En FleboTwin se explora como una modificación de la red, sin diagnosticar una lesión individual.",["esvs2022","ferlito2026"]),
    term(8,"Bomba muscular","Calf muscle pump",["bomba de pantorrilla"],"Mecanismo en el que la actividad muscular modifica las condiciones de las venas y favorece el desplazamiento de sangre.",["keijsers2015"]),
    term(9,"Vena perforante","Perforating vein",["perforante"],"Conexión entre territorios venosos superficial y profundo a través de los planos fasciales.",["asa","esvs2022"]),
    term(10,"Vena safena magna","Great saphenous vein",["GSV","VSM","safena mayor"],"Vena del sistema superficial cuyo trayecto y uniones se consideran por segmento. Un cine de la unión no representa todo su estudio.",["asa"]),
    term(11,"Vena safena menor","Small saphenous vein",["SSV","VSP","safena parva"],"Vena superficial con trayecto posterior y variabilidad de sus conexiones; la denominación se conserva ligada al territorio observado.",["asa"]),
    term(12,"Unión safenofemoral","Saphenofemoral junction",["SFJ","USF"],"Región de conexión de la safena magna con la femoral común. GS en ThrombUS+ identifica un sitio de adquisición cercano a esa relación.",["asa","thrombus"]),
    term(13,"Vena femoral común","Common femoral vein",["CFV","VFC"],"Segmento profundo proximal que se identifica por su relación anatómica y contexto de adquisición.",["asa","thrombus"]),
    term(14,"Vena femoral","Femoral vein",["FV","VF"],"Segmento del sistema venoso profundo del muslo; el término visible en la biblioteca se conserva según la fuente.",["asa","thrombus"]),
    term(15,"Vena poplítea","Popliteal vein",["PV","VP"],"Segmento profundo de la región de la rodilla. La orientación del cine debe conservarse al comparar imágenes.",["asa","thrombus"]),
    term(16,"Modo B","B-mode",["escala de grises"],"Representación de ecos que permite observar forma y relaciones. Su brillo no asigna por sí solo una etiología.",["asa"]),
    term(17,"Compresibilidad","Compressibility",["compresión ecográfica"],"Cambio de la luz vascular observado durante la presión del transductor. En los casos reales se conserva la etiqueta del proveedor.",["thrombus","asa"]),
    term(18,"Doppler color","Color Doppler",["mapa de color"],"Representación que codifica información de flujo con una leyenda. La interpretación de dirección requiere revisar mapa y orientación.",["asa","dicom"]),
    term(19,"Doppler espectral","Spectral Doppler",["espectro","trazado"],"Representación temporal de información Doppler. Sus ejes y unidades deben conocerse antes de medir.",["asa","dicom"]),
    term(20,"Línea base","Baseline",["cero espectral"],"Referencia del espectro alrededor de la que se representa el signo de la señal. Moverla modifica la presentación, no la dirección anatómica real.",["dopplerphysics","dicom"]),
    term(21,"PRF","Pulse repetition frequency",["frecuencia de repetición de pulsos"],"Frecuencia de repetición usada en la adquisición pulsada. Interviene en el límite de muestreo de la señal Doppler.",["dopplerphysics"]),
    term(22,"Límite de Nyquist","Nyquist limit",["PRF/2"],"Mitad de la frecuencia de muestreo en la representación pulsada ideal. Rebasarlo puede producir envolvimiento o aliasing.",["dopplerphysics"]),
    term(23,"Aliasing","Aliasing",["envolvimiento"],"Representación ambigua por muestreo insuficiente. Puede aparentar un cambio de signo que no equivale a inversión fisiológica.",["dopplerphysics"]),
    term(24,"Ángulo Doppler","Doppler angle",["ángulo de insonación"],"Ángulo entre el haz y la dirección del movimiento representado. La proyección angular influye en la señal Doppler.",["dopplerphysics","asa"]),
    term(25,"Volumen de muestra","Sample volume",["gate","compuerta"],"Región de adquisición del Doppler pulsado. Su ubicación debe relacionarse con la anatomía mostrada.",["asa","dicom"]),
    term(26,"Fasicidad","Phasicity",["modulación respiratoria"],"Variación temporal del flujo. Un patrón se interpreta con segmento y contexto; no constituye una conclusión aislada.",["asa"]),
    term(27,"Aumentación distal","Distal augmentation",["provocación distal"],"Maniobra que modifica el flujo desde una localización distal al punto de observación. Debe documentarse junto al espectro.",["asa","svs2022"]),
    term(28,"CEAP","Clinical Etiology Anatomy Pathophysiology",["clase C"],"Sistema de descripción de trastornos venosos. Una fotografía puede ilustrar signos, pero no reconstruye automáticamente todos sus componentes.",["ceap2020"]),
    term(29,"Telangiectasia","Telangiectasia",["araña vascular"],"Hallazgo de pequeños vasos visibles que puede describirse por su distribución y aspecto, conservando el contexto del caso.",["ceap2020","esvs2022"]),
    term(30,"Vena reticular","Reticular vein",["reticular"],"Vena superficial visible con patrón reticular. La imagen es apoyo de descripción y no sustituye medición o exploración.",["ceap2020","esvs2022"]),
    term(31,"Corona flebectásica","Corona phlebectatica",["C4c"],"Descriptor incorporado como subclase clínica en CEAP 2020; debe documentarse en el caso antes de asignarlo a una fotografía.",["ceap2020"]),
    term(32,"Calibración por región","Ultrasound region calibration",["Physical Delta X","Physical Delta Y"],"Correspondencia de píxeles, ejes y unidades de una región concreta. La calibración de distancia no calibra automáticamente tiempo o velocidad.",["dicom"]),
]

def control(id,label,min,max,step,value,unit=""):
    return dict(id=id,label=label,min=min,max=max,step=step,defaultValue=value,unit=unit)

dopplerLessons = [
    dict(id="DP01",title="Dirección del haz y del flujo",intro="Antes de interpretar un signo, ubica el haz y el movimiento. La dirección anatómica y la dirección respecto al transductor son referencias diferentes.",keyPoints=["El signo Doppler depende de la proyección del movimiento sobre el haz.","Una flecha hacia proximal no determina por sí sola si la señal aparece arriba o abajo de la línea base.","Verifica la leyenda y orientación de la adquisición real."],controls=[control("angle","Ángulo entre haz y flujo",0,180,1,45,"°"),control("velocity","Velocidad ilustrativa",-50,50,1,20,"cm/s")],sourceIds=["dopplerphysics","asa"],nature="illustration",demo="direction",formula="fD = 2 · f0 · v · cos(θ) / c",takeaway="Relaciona la señal con el haz; después tradúcela al territorio anatómico."),
    dict(id="DP02",title="El mapa de color puede invertirse",intro="La leyenda es parte de la imagen. El mismo movimiento puede cambiar de color cuando se invierte el mapa, sin cambiar la fisiología.",keyPoints=["Rojo y azul no son etiquetas universales de arteria y vena.","Una inversión de paleta no invierte el flujo real.","El color complementa la evaluación; una captura estática no mide duración de reflujo."],controls=[control("invert","Invertir mapa",0,1,1,0),control("velocity","Señal ilustrativa",-50,50,1,25,"cm/s")],sourceIds=["asa"],nature="illustration",demo="color",takeaway="Conserva la leyenda al comparar y al exportar una imagen."),
    dict(id="DP03",title="Encuentra la línea base",intro="La línea base define una referencia de presentación. Observa el trazado y el cero antes de asignar un significado al signo.",keyPoints=["La línea base puede desplazarse dentro de la pantalla.","Mover la referencia no produce una nueva adquisición ni modifica el movimiento.","La interpretación requiere la escala y la orientación del estudio."],controls=[control("baseline","Desplazamiento de línea base",-40,40,1,0,"%"),control("scale","Escala vertical ilustrativa",20,100,5,50,"cm/s")],sourceIds=["dicom","dopplerphysics"],nature="illustration",demo="baseline",takeaway="Describe la referencia antes de describir una deflexión."),
    dict(id="DP04",title="Escala y fisiología son cosas distintas",intro="Una escala más estrecha hace que una misma señal ocupe más espacio. El cambio en el dibujo puede obedecer a presentación y no a una diferencia fisiológica.",keyPoints=["Compara unidades y escala antes de comparar altura de dos trazados.","La amplitud en píxeles no es una velocidad física.","En una imagen real la medida requiere la calibración de su región."],controls=[control("scale","Escala vertical",10,100,5,40,"cm/s"),control("velocity","Velocidad ilustrativa",5,60,1,20,"cm/s")],sourceIds=["dicom","dopplerphysics"],nature="illustration",demo="scale",takeaway="Una comparación válida conserva o explica sus escalas."),
    dict(id="DP05",title="El papel del ángulo Doppler",intro="La ecuación proyecta el movimiento en la dirección del haz. Explora el término coseno y distingue este principio ideal de todas las condiciones de un estudio real.",keyPoints=["Al acercarse a 90°, el componente ideal en la dirección del haz disminuye.","Una pequeña incertidumbre angular puede cambiar la velocidad calculada, especialmente a ángulos altos.","Los controles de este esquema no cambian el ángulo de un cine ya adquirido."],controls=[control("angle","Ángulo",0,89,1,45,"°"),control("frequency","Frecuencia ilustrativa",2,10,0.5,5,"MHz"),control("velocity","Velocidad ilustrativa",5,60,1,20,"cm/s")],sourceIds=["dopplerphysics","asa"],nature="illustration",demo="angle",formula="fD = 2 · f0 · v · cos(θ) / c",takeaway="La geometría de adquisición influye en la señal; anota su contexto."),
    dict(id="DP06",title="Aliasing: un límite del muestreo",intro="Una señal puede envolverse al superar el intervalo representable del muestreo pulsado. Este esquema permite distinguir el movimiento original y su representación muestreada.",keyPoints=["En el esquema ideal, el límite simétrico corresponde a PRF/2.","Un cambio aparente de signo puede ser un artefacto de representación.","No se debe llamar reflujo a una inversión aparente sin revisar la adquisición."],controls=[control("prf","PRF ilustrativa",200,4000,100,1000,"Hz"),control("shift","Desplazamiento Doppler",100,3000,50,800,"Hz")],sourceIds=["dopplerphysics"],nature="illustration",demo="aliasing",formula="Límite de Nyquist = PRF / 2",takeaway="Compara la señal original y la envuelta antes de interpretar su dirección."),
    dict(id="DP07",title="Tiempo, evento y maniobra",intro="Un intervalo se interpreta mejor cuando conocemos qué ocurrió y cuándo. Sitúa la maniobra y distingue el tiempo del espectro del tiempo de reproducción del cine.",keyPoints=["El eje horizontal del espectro necesita una escala temporal válida.","Cambiar la velocidad de reproducción no cambia la duración de origen.","La maniobra, postura y segmento forman parte del contexto de lectura."],controls=[control("eventTime","Momento de la maniobra",0.5,4,0.1,2,"s"),control("duration","Intervalo ilustrativo",0.1,2,0.1,0.8,"s")],sourceIds=["dicom","asa"],nature="illustration",demo="timing",takeaway="Mide entre referencias del mismo eje calibrado."),
    dict(id="DP08",title="Variación temporal del flujo",intro="El flujo venoso puede cambiar con el tiempo. Este patrón sintético sirve para observar modulación; no representa una grabación de un paciente ni decide una causa clínica.",keyPoints=["Un patrón temporal se relaciona con el vaso y las condiciones de registro.","El tiempo de un ciclo ilustrativo no debe trasladarse a un estudio individual.","Una alteración de fasicidad requiere evaluación con contexto adicional."],controls=[control("modulation","Modulación ilustrativa",0,100,5,60,"%"),control("period","Periodo del esquema",2,8,0.5,4,"s")],sourceIds=["asa"],nature="illustration",demo="phasicity",takeaway="Describe primero el patrón; interpreta después con el resto de la exploración."),
    dict(id="DP09",title="Contracción y flujo femoral experimental",intro="Los extractos de Waterloo permiten observar flujo femoral durante una condición de adquisición documentada. Son un puente entre fisiología e imagen, no un banco de todas las patologías venosas.",keyPoints=["Conserva participante, vista longitudinal y condición del experimento.","Los campos de velocidad son resultados del procesamiento identificado por los autores.","Varios momentos de una adquisición no son pacientes diferentes."],controls=[control("phase","Posición del extracto",0,100,1,0,"%"),control("speed","Velocidad de reproducción",0.25,2,0.25,1,"×")],sourceIds=["waterloo"],nature="experimental",demo="experimental",takeaway="Consulta la condición de adquisición antes de generalizar un cambio observado."),
    dict(id="DP10",title="Duración del flujo inverso",intro="Explora una medida temporal en un esquema calibrado y consulta el criterio correspondiente al territorio. El resultado de esta demostración no es un diagnóstico individual.",keyPoints=["SVS/AVF/AVLS diferencia criterios: >0.5 s en troncos superficiales y otros segmentos; >1 s en femoral común, femoral y poplítea.","Especifica segmento y condiciones de provocación.","Una breve señal inversa no debe interpretarse sin la secuencia completa y su contexto."],controls=[control("duration","Duración ilustrativa",0,2,0.05,0.7,"s"),control("deep","Referencia femoropoplítea",0,1,1,0)],sourceIds=["svs2022","asa","dicom"],nature="illustration",demo="reflux",takeaway="Segmento, maniobra y escala dan significado a la duración."),
]

def step(title,body,lab,target=None):
    d=dict(title=title,body=body,lab=lab)
    if target:d["target"]=target
    return d
def pathway(id,title,desc,minutes,steps,refs):
    return dict(id=id,title=title,description=desc,minutes=minutes,steps=steps,sourceIds=refs)

pathways=[
    pathway("RC01","Un primer recorrido por FLEBO LAB","Tres formas de estudiar un mismo territorio: mecanismos, adquisición y signos visibles.",6,[step("Mecanismo","Abre el territorio y observa qué representa cada capa. Identifica que la red funcional es una simplificación educativa.","twin","TW01"),step("Movimiento y tiempo","Reproduce un ciclo. Pausa y relaciona el estado visible con la curva activa.","twin","TW03"),step("Una adquisición real","Abre un cine de compresión. Comprueba su segmento y lado antes de mirar la etiqueta de origen.","dus"),step("Observación clínica","Compara dos vistas y describe únicamente lo que ves. Consulta el contexto después.","vision"),step("Procedencia","Abre la fuente de un caso y diferencia archivo, vista y caso de origen.","vision")],["keijsers2015","thrombus","tricvi"]),
    pathway("RC02","De la válvula al retorno venoso","Sigue dirección, estado valvular y flujo en una comparación controlada.",7,[step("Referencia competente","Observa el escenario de referencia y la convención de flujo.","twin","TW05"),step("Sigue una fase","Pausa después de la contracción y localiza el estado de la válvula.","twin","TW03"),step("Introduce fuga","Modifica la condición valvular manteniendo las demás condiciones fijas.","twin","TW06"),step("Compara curvas","Compara signo y tiempo de flujo, conservando las mismas unidades y presión de referencia.","twin","TW06"),step("Límite de la representación","Consulta el modelo: la geometría animada no constituye una solución fluido-estructura de valvas.","twin","TW05")],["keijsers2015","ferlito2026"]),
    pathway("RC03","La pierna al cambiar de postura","Relaciona alturas y referencias de presión sin contar dos veces la carga gravitacional.",6,[step("Red de referencia","Identifica entrada, salida y alturas del modelo.","twin","TW01"),step("Cambia la postura","Activa el cambio de postura y observa qué variables se recalculan.","twin","TW02"),step("Lee la referencia","Distingue presión interior, exterior y potencial cuando la vista los ofrezca.","twin","TW02"),step("Compara con pausa","Usa A/B para mantener el mismo instante y la misma cámara.","twin","TW02")],["keijsers2015"]),
    pathway("RC04","Contracción y relajación de la pantorrilla","Conecta un mecanismo reducido con una observación experimental femoral.",8,[step("Ciclo de bomba","Localiza la contracción y la relajación en el reloj del modelo.","twin","TW03"),step("Activa menos la bomba","Compara un perfil conservado y otro reducido; identifica qué parámetro cambió.","twin","TW04"),step("Observa el experimento","Abre los extractos disponibles de Waterloo y consulta su condición de adquisición.","dus","DP09"),step("Separa dos tipos de evidencia","El circuito es un modelo genérico y el extracto es una adquisición experimental. La relación es temática, no un mismo paciente.","dus","DP09")],["keijsers2015","waterloo"]),
    pathway("RC05","Vena, arteria y compresión","Observa la luz y la maniobra sin convertir una etiqueta aislada en una exploración completa.",7,[step("Ubica el segmento","Empieza por la ficha y el mapa de adquisición.","dus"),step("Mira el cine limpio","Reproduce sin anotaciones y localiza cambios de forma.","dus"),step("Inspecciona el momento","Pausa y avanza por cuadros para describir la compresión observada.","dus"),step("Compara otro ejemplo","Abre un segundo caso de origen distinto y consulta sus etiquetas.","dus"),step("Conserva el alcance","Los clips seleccionados enseñan una maniobra; no documentan por sí solos todo el protocolo de reflujo.","dus")],["thrombus","asa"]),
    pathway("RC06","Cuatro sitios de exploración","Recorre CFV, GS, FV y PV con el contexto de ThrombUS+.",8,[step("Femoral común","Localiza el sitio CFV y sus relaciones en la región inguinal.","dus"),step("Unión safena","Observa GS como sitio de unión; evita asumir que representa el trayecto safeno completo.","dus"),step("Muslo","Compara la adquisición FV con la región proximal.","dus"),step("Región poplítea","Abre PV y comprueba orientación y lado.","dus"),step("Una ficha completa","Reconoce qué postura, maniobra o parámetros no constan en una adquisición.","dus")],["thrombus","asa"]),
    pathway("RC07","Qué representa el color Doppler","Primero la leyenda y el haz; después la interpretación anatómica.",6,[step("Define referencias","Relaciona haz y dirección del movimiento en el esquema.","dus","DP01"),step("Invierte la paleta","Comprueba que cambia el color mientras se conserva el movimiento.","dus","DP02"),step("Comprueba la escala","Compara la misma señal con otra escala de presentación.","dus","DP04"),step("Distingue artefactos","Observa el envolvimiento por muestreo antes de llamar inverso a un flujo.","dus","DP06")],["asa","dopplerphysics"]),
    pathway("RC08","Cómo se lee un intervalo espectral","Segmento, maniobra y eje temporal dan contexto a una duración.",7,[step("Localiza el cero","Reconoce línea base y unidades del espectro.","dus","DP03"),step("Identifica el evento","Sitúa el inicio de la maniobra y los límites del intervalo.","dus","DP07"),step("Mide el tiempo","Explora el ejemplo calibrado sin confundirlo con la velocidad del reproductor.","dus","DP10"),step("Consulta el territorio","Revisa los criterios diferenciados y el contexto que requeriría un estudio real.","dus","DP10")],["svs2022","asa","dicom"]),
    pathway("RC09","Telangiectasias, reticulares y várices","Practica descripción visual y compara con la etiqueta de origen.",7,[step("Observa distribución","Explora imágenes de C1 y describe patrón y localización sin deducir síntomas.","vision","C1"),step("Compara calibre aparente","Compara un ejemplo C2 con otro de la misma región; recuerda que los píxeles no calibran diámetro.","vision","C2"),step("Amplía con criterio","Acércate hasta el detalle real del archivo y vuelve a la vista de contexto.","vision"),step("Consulta el caso","Distingue signo visible, clase aportada por la fuente y datos faltantes.","vision")],["ceap2020","tricvi"]),
    pathway("RC10","Cambios de piel y heridas","Una fotografía ilustra un hallazgo; la etiología exige contexto.",8,[step("Describe el aspecto","Observa color, textura y distribución en los ejemplos C4.","vision","C4"),step("Conserva la historia","En C5 consulta qué información sustenta que existió una úlcera.","vision","C5"),step("Observa una herida","En C6 separa la descripción del defecto visible de la atribución etiológica de origen.","vision","C6"),step("Compara sin diagnosticar","Relaciona diferencias entre vistas y consulta los límites de la fotografía.","vision")],["ceap2020","esvs2022","tricvi"]),
    pathway("RC11","Obstrucción y reflujo como mecanismos distintos","Compara una vía de salida limitada y una fuga valvular con condiciones explícitas.",7,[step("Resistencia de salida","Observa qué modifica el escenario de resistencia proximal.","twin","TW09"),step("Fuga valvular","Compara con un cambio de conductancia inversa.","twin","TW06"),step("Salida alternativa","Explora la conexión colateral genérica incluida en la red.","twin","TW10"),step("Observación y mecanismo","Relaciona estas ideas con los datos apropiados; un patrón aislado no identifica todas las causas posibles.","dus","DP08")],["esvs2022","ferlito2026"]),
    pathway("RC12","Dos modalidades del mismo caso","Compara RGB y termografía preservando identidad de caso y escala.",6,[step("Verifica la pareja","Selecciona una pareja identificada por caso y vista.","vision"),step("Describe la RGB","Enumera hallazgos visibles sin usar el color térmico como etiología.","vision"),step("Revisa la térmica","Consulta paleta, matriz y unidades disponibles; no compares colores de escalas distintas.","vision"),step("Define el alcance","Ambas modalidades se complementan como material docente. La pareja no confirma reflujo ni sustituye al dúplex.","vision")],["tricvi","esvs2022"]),
]

observationGuides=[
    dict(id="C0",title="C0 · Sin signos venosos visibles o palpables documentados",visibleFindings=["Describe la superficie y la distribución visibles en la fotografía."],contextNeeded=["La ausencia de signos en una fotografía no informa todos los síntomas ni el examen palpable."],limitations=["No equivale a descartar enfermedad venosa mediante una imagen."],sources=["ceap2020","tricvi"]),
    dict(id="C1",title="C1 · Telangiectasias o venas reticulares",visibleFindings=["Patrón vascular superficial, distribución y zona anatómica."],contextNeeded=["Correlación con exploración y el rótulo de origen."],limitations=["No deducir síntomas, diámetro físico o reflujo a partir de píxeles."],sources=["ceap2020","tricvi"]),
    dict(id="C2",title="C2 · Várices documentadas en el caso",visibleFindings=["Trayecto superficial prominente y morfología visible."],contextNeeded=["Historia si se quiere indicar recurrencia; exploración y estudio anatómico cuando corresponda."],limitations=["Una fotografía no determina el origen del reflujo ni toda su extensión."],sources=["ceap2020","esvs2022","tricvi"]),
    dict(id="C3",title="C3 · Edema documentado",visibleFindings=["Cambios de contorno o volumen aparentes que pueden describirse como observación."],contextNeeded=["Exploración, evolución y otras causas posibles del aumento de volumen."],limitations=["La fotografía aislada no confirma edema ni su etiología venosa."],sources=["ceap2020","esvs2022","tricvi"]),
    dict(id="C4",title="C4 · Cambios de piel y tejido subcutáneo",visibleFindings=["Color, textura, localización y extensión del cambio observado."],contextNeeded=["La subclase solo se muestra si está documentada: C4a, C4b o C4c; consulta la fuente."],limitations=["El aspecto puede superponerse con otras dermatosis. Una etiqueta C4 genérica no autoriza inventar una subclase."],sources=["ceap2020","esvs2022","tricvi"]),
    dict(id="C5",title="C5 · Úlcera venosa cicatrizada documentada",visibleFindings=["Área de piel cicatrizada y cambios acompañantes descritos por el origen."],contextNeeded=["Historia que documente la úlcera previa y su atribución venosa."],limitations=["Una cicatriz o cambio de color sin historia no establece por sí solo C5."],sources=["ceap2020","esvs2022","tricvi"]),
    dict(id="C6",title="C6 · Úlcera venosa activa documentada",visibleFindings=["Localización, contorno y superficie de la lesión visible."],contextNeeded=["Información que sustente la etiología y una evaluación clínica completa de la herida."],limitations=["La imagen no permite valorar todos los componentes de la lesión ni excluir otras etiologías."],sources=["ceap2020","esvs2022","tricvi"]),
]

def escape(x):return html.escape(str(x),quote=True)
def text(x,y,value,size=24,fill="#203647",weight=400,anchor="start"):
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{escape(value)}</text>'
def line(x1,y1,x2,y2,color="#7a91a4",width=3,extra=""):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}" {extra}/>'
def path(d,color="#2c769a",width=8,extra=""):
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" {extra}/>'
def arrow(x1,y1,x2,y2,color="#c42946",width=5):
    return line(x1,y1,x2,y2,color,width,'marker-end="url(#arrow)"')
def circle(x,y,r,fill="#f7e5e9",stroke="#c42946",width=4,extra=""):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" {extra}/>'
def rect(x,y,w,h,fill="#edf3f7",stroke="none",radius=16,extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" {extra}/>'
def label_block(x,y,title,body,w=440):
    out=rect(x,y,w,116)+text(x+24,y+36,title,23,"#a8203c",700)
    words=body.split();a=[];line_words=[]
    for word in words:
        if len(" ".join(line_words+[word]))>int(w/12):a.append(" ".join(line_words));line_words=[]
        line_words.append(word)
    if line_words:a.append(" ".join(line_words))
    for i,t in enumerate(a[:3]):out+=text(x+24,y+67+i*24,t,19)
    return out
def vessel(x,y,w=70,h=230):
    return rect(x,y,w,h,"#dcecf7","#2c769a",w/2)+line(x+w/2,y+12,x+w/2,y+h-12,"#a7c8dc",2)
def valve(x,y,scale=1,reverse=False):
    delta=-1 if reverse else 1
    return path(f'M{x-35*scale},{y+20*delta*scale} Q{x-5*scale},{y+10*delta*scale} {x},{y-18*delta*scale}',"#a8203c",5)+path(f'M{x+35*scale},{y+20*delta*scale} Q{x+5*scale},{y+10*delta*scale} {x},{y-18*delta*scale}',"#a8203c",5)
def spectrum(x=150,y=390,w=850,h=230,baseline=.58,negative=False):
    zero=y+h*baseline
    d=""
    for i in range(240):
        px=x+w*i/239;t=i/239
        value=40+25*math.sin(t*math.pi*4)+45*math.exp(-((t-.28)/.075)**2)
        if negative and .55<t<.77:value=-55
        py=zero-value
        d+=("M" if i==0 else " L")+f'{px:.1f},{py:.1f}'
    return arrow(x,y+h,x,y,"#7a91a4",3)+arrow(x,y+h,x+w,y+h,"#7a91a4",3)+line(x,zero,x+w,zero,"#7a91a4",2,'stroke-dasharray="8 7"')+path(d,"#2c769a",5)+text(x-20,zero+7,"0",18,anchor="end")+text(x+w-8,y+h+30,"tiempo",18,anchor="end")

def frame(id,title,subtitle,body,sourcelabel,animated=False):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(subtitle)}. Esquema educativo original de FLEBO LAB; no representa una adquisición clínica.</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
<style>text{{font-family:Arial,Helvetica,sans-serif}}.static{{display:none}}@media(prefers-reduced-motion:reduce){{.moving{{display:none}}.static{{display:inline}}}}</style>
<rect width="1200" height="800" fill="#fff"/><rect width="1200" height="9" fill="#b7213c"/>
{text(55,60,"FLEBO LAB IMF · "+id,18,"#7a91a4",700)}
{text(55,115,title,38,"#203647",700)}
{text(55,153,subtitle,22,"#617b8d")}
{body}
{line(55,723,1145,723,"#dce5eb",2)}
{text(55,754,"Esquema educativo original · "+("Animación conceptual" if animated else "Ilustración conceptual"),18,"#617b8d")}
{text(55,781,"Referencia: "+sourcelabel+" · FLEBO LAB IMF, 2026",15,"#617b8d")}
</svg>'''

plate_specs=[]
plate_specs.append(("PL01","El retorno necesita una referencia","Presión, altura y conexiones forman un sistema.",vessel(280,260,85,340)+arrow(322,550,322,310)+text(395,320,"Salida",26)+text(395,565,"Entrada",26)+label_block(620,270,"Observar una red","Las flechas indican una convención de flujo, no una medición de paciente.")+label_block(620,440,"Conservar el contexto","La presión necesita unidades y una referencia común."),["keijsers2015"]))
plate_specs.append(("PL02","Superficial y profundo","Una relación espacial que ayuda a organizar la observación.",rect(150,245,310,380,"#fff0f3")+rect(460,245,520,380,"#edf3f7")+line(460,245,460,625,"#7a91a4",3,'stroke-dasharray="10 10"')+vessel(300,285,55,275)+vessel(710,285,85,275)+path('M355,410 C500,410 580,470 710,470',"#2c769a",18)+text(195,670,"Superficial",24)+text(660,670,"Profundo",24)+text(500,310,"Plano fascial",20)+text(420,525,"Conexión perforante",22),["asa","esvs2022"]))
plate_specs.append(("PL03","Postura y carga gravitacional","El potencial se interpreta con la altura y su referencia.",vessel(260,255,80,350)+line(210,255,210,605,"#7a91a4",3,'marker-start="url(#arrow)" marker-end="url(#arrow)"')+text(175,435,"Δh",28,anchor="end")+text(380,285,"Nivel superior",23)+text(380,600,"Nivel inferior",23)+label_block(660,310,"Una sola convención","No contar dos veces la contribución gravitacional en la presión.",440)+label_block(660,465,"Comparación controlada","Conserva el resto de parámetros al cambiar la postura.",440),["keijsers2015"]))
plate_specs.append(("PL04","La bomba tiene dos fases","Contracción y relajación cambian las condiciones del circuito.",vessel(275,270,85,280)+arrow(180,390,260,390)+arrow(455,390,375,390)+arrow(317,345,317,290)+valve(317,470)+text(210,615,"Contracción",26)+vessel(785,270,85,280)+arrow(827,500,827,410)+valve(827,350)+text(730,615,"Relajación y llenado",26),["keijsers2015"]))
plate_specs.append(("PL05","Competencia y fuga valvular","Dos configuraciones de una representación educativa.",vessel(275,255,85,325)+valve(317,400)+arrow(317,350,317,285)+text(215,630,"Competencia",27)+vessel(795,255,85,325)+valve(837,400,.7)+arrow(837,445,837,540,"#b7213c")+text(745,630,"Fuga representada",27),["keijsers2015","ferlito2026"]))
plate_specs.append(("PL06","Presión transmural","La diferencia entre interior y exterior da contexto al volumen.",circle(355,420,118,"#dcecf7","#2c769a",8)+text(355,430,"P interior",27,anchor="middle")+arrow(170,420,220,420)+arrow(540,420,490,420)+text(305,605,"P exterior",25)+label_block(680,330,"Ptm = Pi − Pe","Una presión interior aislada no describe la condición de la pared.",400),["keijsers2015"]))
plate_specs.append(("PL07","Conservar volumen","El cambio de volumen corresponde al balance del circuito.",rect(440,300,320,230,"#dcecf7","#2c769a",30)+arrow(160,415,420,415)+arrow(780,415,1040,415)+text(600,415,"Volumen",33,anchor="middle")+text(600,465,"del compartimento",22,anchor="middle")+text(230,365,"Entradas",26)+text(850,365,"Salidas",26)+text(600,640,"Δ volumen / Δ tiempo = entradas − salidas",29,anchor="middle"),["keijsers2015","svzerod"]))
plate_specs.append(("PL08","Una salida alternativa","Una conexión solo modifica el cálculo si existe en la red.",path('M220,570 L220,300 L850,300 L850,570',"#2c769a",26)+path('M220,510 Q535,400 850,510',"#7a91a4",18)+rect(510,270,95,60,"#f7e5e9","#b7213c",12)+text(555,240,"Resistencia",24,anchor="middle")+arrow(350,490,470,470,"#7a91a4")+text(600,640,"Configuración genérica de circuito",28,anchor="middle"),["ferlito2026","svzerod"]))
plate_specs.append(("PL09","Observar una compresión","La secuencia importa más que una captura aislada.",rect(185,270,270,65,"#7a91a4")+f'<ellipse cx="320" cy="460" rx="100" ry="70" fill="#dcecf7" stroke="#2c769a" stroke-width="7"/>'+arrow(320,350,320,385)+rect(730,330,270,65,"#7a91a4")+f'<ellipse cx="865" cy="490" rx="100" ry="15" fill="#dcecf7" stroke="#2c769a" stroke-width="7"/>'+text(320,625,"Antes",28,anchor="middle")+text(865,625,"Durante",28,anchor="middle"),["thrombus","asa"]))
plate_specs.append(("PL10","Vista transversal y longitudinal","Conserva orientación, lado y segmento al comparar.",rect(150,260,390,320)+circle(345,420,90,"#dcecf7","#2c769a",7)+rect(660,260,390,320)+rect(695,385,320,75,"#dcecf7","#2c769a",30)+text(345,635,"Sección transversal",26,anchor="middle")+text(855,635,"Eje longitudinal",26,anchor="middle"),["asa"]))
plate_specs.append(("PL11","El color necesita una leyenda","Invertir el mapa no cambia el movimiento real.",rect(170,310,330,120,"#f7e5e9")+arrow(210,370,460,370,"#c42946",9)+rect(700,310,330,120,"#dcecf7")+arrow(740,370,990,370,"#2c769a",9)+text(335,485,"Mapa A",28,anchor="middle")+text(865,485,"Mapa invertido",28,anchor="middle")+text(600,610,"Misma dirección · distinta codificación",29,anchor="middle"),["asa"]))
plate_specs.append(("PL12","Los ejes dan significado al espectro","Representación sintética de una señal; no es una adquisición.",spectrum(150,290,850,280)+text(80,320,"Señal",20)+text(270,660,"Antes de medir: región, unidades, cero y orientación.",24),["dicom","dopplerphysics"]))
plate_specs.append(("PL13","Una duración pertenece a un eje calibrado","La velocidad del reproductor no cambia el tiempo de origen.",spectrum(150,270,850,270,negative=True)+line(617,300,617,580,"#c42946",3,'stroke-dasharray="7 6"')+line(804,300,804,580,"#c42946",3,'stroke-dasharray="7 6"')+line(617,600,804,600,"#c42946",4,'marker-start="url(#arrow)" marker-end="url(#arrow)"')+text(710,650,"Intervalo ilustrativo",25,anchor="middle"),["dicom","asa"]))
plate_specs.append(("PL14","La señal depende de una proyección","El término coseno relaciona haz y dirección del movimiento.",arrow(160,520,610,520,"#2c769a",8)+arrow(200,260,510,470,"#c42946",7)+path('M430,520 A95,95 0 0 0 410,455',"#7a91a4",3)+text(445,487,"θ",32)+text(610,575,"Movimiento",25,anchor="middle")+text(220,235,"Haz",25)+label_block(700,340,"fD ∝ v · cos θ","Esquema de la ecuación ideal. La adquisición real requiere más contexto.",400),["dopplerphysics"]))
plate_specs.append(("PL15","Aliasing y señal original","El envolvimiento puede aparentar un cambio de signo.",spectrum(160,260,850,300)+line(160,370,1010,370,"#c42946",3,'stroke-dasharray="8 6"')+text(1025,375,"Límite",20)+path('M350,370 L380,510 L415,470 L450,425',"#c42946",7)+text(600,665,"Esquema de muestreo · no demuestra reflujo",27,anchor="middle"),["dopplerphysics"]))
plate_specs.append(("PL16","Maniobra, segmento y tiempo","El registro debe permitir relacionar un evento con la respuesta.",spectrum(150,270,850,270,negative=True)+line(385,250,385,580,"#c42946",4,'stroke-dasharray="7 6"')+text(385,235,"Evento",24,anchor="middle")+text(600,650,"Documenta qué maniobra y en qué territorio se realizó.",25,anchor="middle"),["asa","svs2022"]))
guide_colors=["#edf3f7","#e7f0f5","#dcebf3","#f4e9ed","#f1dbe2","#ead0da","#e7becb"]
body=""
for i,g in enumerate(observationGuides):
    x=95+i*147;body+=rect(x,290,125,160,guide_colors[i])+text(x+62,355,g['id'],36,"#a8203c",700,"middle")+text(x+62,410,["Sin signos","Vasos","Várices","Edema","Piel","Cicatrizada","Activa"][i],17,"#203647",400,"middle")
body+=text(600,560,"La clase pertenece al contexto del miembro.",29,anchor="middle")+text(600,615,"La fotografía no completa E, A y P.",25,anchor="middle")
plate_specs.append(("PL17","CEAP: descripción con contexto","Una guía de lectura, no un clasificador por apariencia.",body,["ceap2020","esvs2022"]))
plate_specs.append(("PL18","Dos modalidades, un mismo caso","Conserva la relación de vista y las escalas de cada modalidad.",rect(150,280,370,250,"#edf3f7","#7a91a4")+rect(680,280,370,250,"#f7e5e9","#c42946")+text(335,400,"RGB",42,"#2c769a",700,"middle")+text(865,400,"Térmica",42,"#a8203c",700,"middle")+text(335,460,"Aspecto visible",24,anchor="middle")+text(865,460,"Paleta y matriz",24,anchor="middle")+line(535,405,665,405,"#7a91a4",4,'stroke-dasharray="7 6"')+text(600,635,"Diagramas de modalidad · no son imágenes de paciente",24,anchor="middle"),["tricvi"]))

plates=[]
source_map={s['id']:s for s in sources}
for id,title,subtitle,body,refs in plate_specs:
    label="; ".join(source_map[r]['title'].split(':')[0] for r in refs)
    (PLATES/f'{id.lower()}.svg').write_text(frame(id,title,subtitle,body,label),encoding="utf-8")
    plates.append(dict(id=id,title=title,description=subtitle,path=f"/media/plates/{id.lower()}.svg",sourceIds=refs,nature="illustration",credit="Esquema original de FLEBO LAB IMF, 2026"))

animations=[]
anim_specs=[
    ("AN01","Válvula y dirección","Movimiento conceptual ligado a una dirección de referencia.",vessel(320,235,100,400)+valve(370,450)+text(650,345,"Observa la dirección",30)+text(650,395,"y el estado representado.",26)+f'<g class="moving"><circle r="12" fill="#c42946"><animateMotion dur="4s" repeatCount="indefinite" path="M370,600 L370,270"/></circle></g>',["keijsers2015"]),
    ("AN02","Postura y referencia","Una columna de altura ayuda a relacionar potencial y posición.",vessel(310,235,85,400)+text(650,330,"Altura y presión",30)+text(650,385,"usan una referencia común.",25)+f'<g class="moving"><line x1="250" y1="620" x2="250" y2="280" stroke="#c42946" stroke-width="7"><animate attributeName="y2" values="590;280;280;590" dur="6s" repeatCount="indefinite"/></line></g>',["keijsers2015"]),
    ("AN03","Dos fases de la bomba","Esquema de contracción y relajación, sin unidades clínicas.",rect(210,260,370,320)+f'<ellipse class="static" cx="395" cy="420" rx="55" ry="135" fill="#dcecf7" stroke="#2c769a" stroke-width="6"/><ellipse class="moving" cx="395" cy="420" rx="55" ry="135" fill="#dcecf7" stroke="#2c769a" stroke-width="6"><animate attributeName="rx" values="55;24;24;55;55" dur="5s" repeatCount="indefinite"/></ellipse>'+arrow(145,420,270,420)+arrow(645,420,520,420)+text(745,340,"Contracción",28)+text(745,400,"Relajación",28)+text(745,465,"Observa el ciclo",24),["keijsers2015"]),
    ("AN04","Presión y volumen","Una representación de respuesta de pared; no es una medida real.",f'<circle class="static" cx="370" cy="420" r="100" fill="#dcecf7" stroke="#2c769a" stroke-width="8"/><circle class="moving" cx="370" cy="420" r="100" fill="#dcecf7" stroke="#2c769a" stroke-width="8"><animate attributeName="r" values="70;120;70" dur="5s" repeatCount="indefinite"/></circle>'+text(700,340,"Interior − exterior",28)+text(700,395,"Presión transmural",25)+text(700,455,"Volumen representado",25),["keijsers2015"]),
    ("AN05","Compresión: observa una secuencia","La maniobra tiene tiempo; una sola captura muestra solo un momento.",rect(270,240,250,60,"#7a91a4")+f'<ellipse class="static" cx="395" cy="480" rx="120" ry="75" fill="#dcecf7" stroke="#2c769a" stroke-width="7"/><ellipse class="moving" cx="395" cy="480" rx="120" ry="75" fill="#dcecf7" stroke="#2c769a" stroke-width="7"><animate attributeName="ry" values="75;12;12;75;75" dur="5s" repeatCount="indefinite"/></ellipse>'+text(710,355,"Antes · durante · después",28)+text(710,415,"Secuencia ilustrativa",25),["asa","thrombus"]),
    ("AN06","Un cursor y un mismo tiempo","Escena y curva deben leer la misma serie temporal.",spectrum(150,270,850,280)+f'<g class="moving"><line x1="170" y1="260" x2="170" y2="580" stroke="#c42946" stroke-width="4"><animate attributeName="x1" values="170;990;170" dur="8s" repeatCount="indefinite"/><animate attributeName="x2" values="170;990;170" dur="8s" repeatCount="indefinite"/></line></g>'+text(600,650,"El reloj de representación no altera los datos de origen.",25,anchor="middle"),["dicom"]),
]
for id,title,subtitle,body,refs in anim_specs:
    label="; ".join(source_map[r]['title'].split(':')[0] for r in refs)
    (ANIMATIONS/f'{id.lower()}.svg').write_text(frame(id,title,subtitle,body,label,True),encoding="utf-8")
    animations.append(dict(id=id,title=title,description=subtitle,path=f"/media/animations/{id.lower()}.svg",sourceIds=refs,nature="illustration",credit="Animación vectorial original de FLEBO LAB IMF, 2026"))

ts='''// Contenido editorial original de FLEBO LAB IMF. No es un clasificador ni una evaluación clínica individual.
export type EducationalSource = { id: string; title: string; url: string; type: string; summary: string; credit: string; license: string };
export type GlossaryTerm = { id: string; term: string; english: string; aliases: string[]; definition: string; sourceIds: string[] };
export type LessonControl = { id: string; label: string; min: number; max: number; step: number; defaultValue: number; unit: string };
export type DopplerLesson = { id: string; title: string; intro: string; keyPoints: string[]; controls: LessonControl[]; sourceIds: string[]; nature: 'illustration' | 'experimental'; demo: string; formula?: string; takeaway: string };
export type PathwayStep = { title: string; body: string; lab: 'twin' | 'dus' | 'vision'; target?: string };
export type Pathway = { id: string; title: string; description: string; minutes: number; steps: PathwayStep[]; sourceIds: string[] };
export type ObservationGuide = { id: string; title: string; visibleFindings: string[]; contextNeeded: string[]; limitations: string[]; sources: string[] };
export type EducationalPlate = { id: string; title: string; description: string; path: string; sourceIds: string[]; nature: string; credit: string };
'''
for name,typ,value in [('sources','EducationalSource',sources),('glossary','GlossaryTerm',glossary),('dopplerLessons','DopplerLesson',dopplerLessons),('pathways','Pathway',pathways),('observationGuides','ObservationGuide',observationGuides),('plates','EducationalPlate',plates),('animations','EducationalPlate',animations)]:
    ts+=f'\nexport const {name}: {typ}[] = '+json.dumps(value,ensure_ascii=False,indent=2)+';\n'
(DATA/'educational.ts').write_text(ts,encoding='utf-8')

doc='''# Contenido editorial de FLEBO LAB

Fecha: 6 de noviembre de 2026.

El módulo `src/data/educational.ts` contiene 15 fuentes, 32 términos, diez demostraciones Doppler, doce recorridos, siete guías de observación, 18 láminas originales y seis animaciones SVG.

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
'''
(ROOT/'docs'/'content'/'EDITORIAL_Y_MEDIOS_ORIGINALES.md').write_text(doc,encoding='utf-8')
print(json.dumps(dict(sources=len(sources),glossary=len(glossary),lessons=len(dopplerLessons),pathways=len(pathways),observationGuides=len(observationGuides),plates=len(plates),animations=len(animations)),indent=2))

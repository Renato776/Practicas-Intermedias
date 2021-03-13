# Índice
- Encabezado

+ Índice

+ Introducción

+ Objetivos

- Actividades con métrica(gráficos generados por ingreso de actividades con notas)

- Actividades sin metrica(Ingreso de actividades descritas por fecha) aplica para todos.

- Estadísticas de deserción(para tutores de cursos).

- Anomalías detectadas(para tutores de cursos).

- Pie del informe

+ Conclusiones

+ Recomendaciones

+ Bibliografía utilizada en el periodo del informe. 

# INTRODUCCIÓN
La implementación de un sistema de archivos ext2 o ext3 es un proyecto muy interesante y revelador para el estudiante, ya que este tiene
la oportunidad de no solo saber teóricamente como se almacenan los archivos a bajo nivel, sino también la experiencia de implementarlo ellos
mismos. Si bien las estructuras que se utilizan a bajo nivel por el sistema de archivos varía de acuerdo al sistema de archivos que 
se está implementando (las estructuras de ZFS no son las mismas que EXT3 o NTFS por ejemplo), aún así el nivel de conocimiento que obtienen
los estudiantes al implementar uno de ellos los habilita para poder fácilmente entender las estructuras a bajo nivel que se utilizan
por otros sistemas de archivos, aportando grandemente a su futura capacidad para adaptarse y llevar a cabo proyectos relacionados en 
su vida profesional. <br><br>
En el curso se le provee al estudiante con todos los conceptos necesarios para implementar este tipo de sistemas. Muchos estudiantes están
muy acostumbrados al uso de librerías de terceros para realizar varias operaciones, cuando estas no son realmente necesarias. En el contexto
de la implementación de un sistema de archivos a bajo nivel esto se hace mucho más evidente, pues claramente estos sistemas nunca se 
implementan apoyándose de librerías de alto nivel. Por esta razón, se prestó especial énfasis en enseñarles a los alumnos como realizar
varias operaciones relevantes al curso, sin depender de librerías externas. Esto con el objetivo de disminuir la dependencia de los alumnos
hacia las mismas.

# OBJETIVOS
### GENERAL
Proveer al estudiante las técnicas, buenas prácticas y conceptos necesarios para la implementación o mantenimiento de sistemas de archivos,
para su posterior comprensión en la forma en que los sistemas de bases de datos se apoyan de estos para realizar sus tareas.

### ESPECÍFICOS

1. Proveer al estudiante los conceptos básicos para la implementación de un sistema de archivos EXT2 o EXT3.

2. Realizar tareas semanales o quincenales, con el objetivo que el estudiante refuerce los últimos conceptos vistos en clase.

3. Crear tutoriales y ejemplos prácticos que reflejen los conceptos vistos en clase.

4. Incentivar al estudiante al uso de Git para el versionamiento y control de su proyecto.


# INFORME
Al inicio del semestre se notó una falta de asistencia de estudiantes al laboratorio, llegando a tener un estimado de 18 alumnos 
conectados por sesión. Una de las razones puede ser el hecho que la asistencia al laboratorio no tiene ponderación, además que las clases
son grabadas y pueden ser revisadas posteriormente cuando el estudiante disponga, a esto también se le suma que la hora en que se imparte el 
laboratorio no es muy atractiva a los estudiantes, puesto que algunos podrían estar almorzando a esa hora. Sin embargo, en el transcurso
del semestre, se ha obtenido una reacción muy positiva hacia las grabaciones de las clases. Las cuales han sido revisadas por la mayoría de los
estudiantes, quienes se han puesto al día durante el transcurso de la semana.
<br><br>
En las primeras sesiones se tuvieron algunas complicaciones, ya que la mayoría de los estudiantes abogaba por el uso de lenguajes y librerías
de alto nivel para la implementación de un sistema de archivos, el cual por naturaleza nunca se implementa en la vida real con dichas
herramientas. Sin embargo, dada la tradición que se ha llevado en el curso, se habilitó al estudiante para que este decida que opción utilizar
entre C (bajo nivel) y C++ (alto nivel). En el laboratorio se trató de promover el uso de C y sus herramientas como Make, al proveer y 
explicar ejemplos prácticos estcritos en este lenguaje.
<br><br>
Durante el avance del semestre se notó un incremento en asistencia, llegando a un aproximado de 25 estudiantes por sesión. Es posible que
el incremento se deba a la calidad de las clases y los conceptos que se imparten en las mismas, así como de la oportunidad que tienen
los estudiantes de hacer preguntas e interactuar con el auxiliar, algo que no sería posible con las grabaciones.
<br><br>
De las actividades en clase que se realizaron, tales como cortos, hojas de trabajo y tareas semanales, apróximadamente el 90% de los alumnos
realizó dichas entregas. Lo que refleja un gran nivel de interés por parte de los estudiantes en el curso. 
<br><br>
Durante las últimas clases, se han hecho esfuerzos por parte de los alumnos en la disminución o eliminación total de los requerimientos
mínimos del proyecto, puesto que se acerca la entrega del mismo. Estas peticiones aún siguen en consideración y no se ha dado ninguna 
respuesta oficial aún.

--------------------------------------------------------------------------
--------------------------------------------------------------------------

# Conclusiones

1. Los conceptos proporcionados han ayudado a los estudiantes en la realización del proyecto 1.

2. Los alumnos han prestado bastante atención a las actividades en clase y han entregado la mayoría de estas.

3. La revisión de las grabaciones de clase ha sido de beneficio para la elaboración del proyecto 1, ya que los alumnos han podido repasar 
los conceptos vistos en clase a su ritmo.

4. La entrega obligatoria por medio de Github hizo que los estudiantes aprendieran el uso de Git para el versionamiento y control de su proyecto.

# Recomendaciones

1. Reforzar el uso y la importancia de herramientas y lenguajes de bajo nivel en cursos donde estos tienen relevancia.

2. Crear más ejemplos y tutoriales relacionados con el curso, ya que los estudiantes mostraron una gran aceptación hacia esta metodología.

3. Incorporar el uso de herramientas de control de versiones en diversos cursos para adentrar al estudiante al uso de las mismas.

4. Disminuir la dependencia de los estudiantes hacia librerías externas cuando estas no son justificadas.

# Bibliografía

- Loomis, Mary E.S. (1,989) Estructuras de datos y Organización de archivos (Segunda Edición). Editorial Prentice Hall.

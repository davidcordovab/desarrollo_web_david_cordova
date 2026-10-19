# desarrollo_web_david_cordova

# Descripción
En esta entrega se implementó la interacción dinámica entre el cliente y el servidor. El sitio permite agregar comentarios en tiempo real y visualizar indicadores estadísticos sin necesidad de refrescar la página.

# Discusión de decisiones tomadas

*Librería para gráficos-Highcharts:*
Se seleccionó Highcharts por su facilidad de integración. Procesa las respuestas JSON del backend directamente en el navegador de manera liviana e interactiva.

*Peticiones Fetch API:*
Se utilizó "fetch" nativo de JavaScript para el envío del formulario de comentarios y la carga de datos estadísticos. Esto evita recargas innecesarias de la página y mejora la experiencia de usuario con código JS simple y sin frameworks.

*Modelo de datos para comentarios:*
Se integró la tabla "comentario" vinculada mediante la llave foránea "avistamiento_id" a la tabla "avistamiento". Esto asegura la integridad referencial en MySQL y facilita la obtención de comentarios específicos por cada publicación.

Se utilizó IA como herramienta de asistencia para consulta de sintaxis, depuración de código y estructuración de gráficos con Highcharts.

# Ejecución local
1. Ejecutar los scripts ".sql" en MySQL.
2. Ajustar el puerto de conexión a MySQL en "app.py" si es necesario (por defecto está configurado en "3307"; cambiar a "3306" según el servidor local).
3. Correr "python app.py" en la terminal.
4. Entrar a "http://127.0.0.1:5000" en el navegador.

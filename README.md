# desarrollo_web_david_cordova
# CC5002 – Tarea 4: Buscador y evaluación de avistamientos

Aplicación web hecha con **Spring Boot 3.5**, **Java 17**, **JPA (MySQL)** y **Thymeleaf**, con llamadas asíncronas en JavaScript (`fetch`).

## Cómo ejecutar
1. Ejecuta `tabla-nota.sql` en tu base de datos de avistamientos para crear la tabla `nota`.
2. Revisa los datos de conexión a MySQL en `src/main/resources/application.properties`.
3. Levanta el proyecto con `./mvnw spring-boot:run` y entra a <http://localhost:8080/buscador>.

## Endpoints principales
Método: GET; ruta: `/buscador`; lo que hace: Muestra la página del buscador de avistamientos
Método: GET; ruta: `/api/avistamientos/buscar?q=texto`; lo que hace: Busca avistamientos que coincidan en ave, voluntario o comuna 
Método: POST; ruta: `/api/avistamientos/{id}/notas`; lo que hace: Recibe `{"nota": 5}`, guarda la nota y devuelve el nuevo promedio

## Decisiones tomadas
- **Búsqueda mientras escribes:** Espera 300 ms después de que dejas de teclear para no mandar tantas peticiones, y cancela la petición anterior si escribes algo nuevo (`AbortController`). Si el campo está vacío, no busca.
- **Búsqueda sin importar mayúsculas:** Filtra ignorando mayúsculas y minúsculas usando consultas de Spring Data (`ContainingIgnoreCase`).
- **Destacado de texto seguro:** Resalta las coincidencias con `<mark>` usando nodos de texto en vez de `innerHTML` para evitar inyección HTML, ignorando mayúsculas y tildes.
- **Nota promedio:** Muestra el promedio con un decimal, o `-` si el avistamiento todavía no tiene notas.
- **Evaluación rápida:** Al hacer clic en evaluar, se muestra un selector del 1 al 7; al elegir una nota, se envía por `POST` y se actualiza el promedio en pantalla sin recargar la página.
- **Validación en varias capas:** Se revisa que la nota sea un número entero entre 1 y 7 en el navegador, en el controlador y en el servicio. En el controlador se lee el JSON con `JsonNode` y se exige `isInt()` para rechazar decimales (`5.5`, `5.0`) o textos (`"5"`) con error 400.
- **Cálculo de promedio:** Se calcula el promedio en la base de datos (`AVG`) al guardar una nota, y para el listado general se consultan los promedios de una vez con `GROUP BY`.

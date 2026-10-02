# desarrollo_web_david_cordova

# Consideraciones para la Corrección


# 1. Puerto de la base de datos (3307)
Por un tema de configuración de mi equipo local, mi servidor de MySQL corre en el **puerto 3307** en vez del clásico 3306. Por eso, en mi `app.py` van a encontrar esta línea:

`app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3307/tarea2'`

**Nota para quien revise:** Para levantar el proyecto en sus computadores y que conecte bien, solo tienen que cambiar ese `3307` por `3306` en el código.

# 2. Uso de IA
Usé Inteligencia Artificial como herramienta de apoyo y estudio para:
* Entender y arreglar errores de sintaxis cuando Jinja2 se mareaba al renderizar las plantillas.
* Aprender a estructurar bien las relaciones de SQLAlchemy (específicamente cómo conectar las tablas con `db.relationship` y `backref`).

Aclaro que la arquitectura, el flujo del código y las adaptaciones para cumplir con la rúbrica fueron craneadas y armadas por mí.

# 3. Modelo de Datos
Para las tablas usé IDs autoincrementales, dejando que SQLAlchemy haga el trabajo de mantener la integridad referencial entre los datos.

# 4. Manejo de las fotos y videos
Cuando un voluntario sube una evidencia, el archivo pasa por la función `secure_filename` de Werkzeug. Esto limpia el nombre del archivo para evitar dramas de formato antes de guardarlo físicamente en la carpeta `static/uploads/`.

# 5. Validaciones de servidor (Backend)
Mantuve vivas las validaciones con JavaScript de la Tarea 1, y le sumé la validación por Flask.

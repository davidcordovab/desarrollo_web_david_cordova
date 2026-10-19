from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os 
from werkzeug.utils import secure_filename


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3307/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')


db = SQLAlchemy(app)


class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(200), nullable=False)


class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)


class Voluntario(db.Model):
    __tablename__ = 'voluntario'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)


class Ave(db.Model):
    __tablename__ = 'ave'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(80), nullable=False)


class Avistamiento(db.Model):
    __tablename__ = 'avistamiento'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    voluntario_id = db.Column(db.Integer, db.ForeignKey('voluntario.id'), nullable=False)
    ave_id = db.Column(db.Integer, db.ForeignKey('ave.id'), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False)
    lugar = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text, nullable=True) 

    ave = db.relationship('Ave', backref='avistamientos')
    registros = db.relationship('Registro', backref='avistamiento')


class Registro(db.Model):
    __tablename__ = 'registro'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey('avistamiento.id'), nullable=False)

class Comentario(db.Model):
    __tablename__= "comentario"
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(80), nullable=False)
    texto =db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey('avistamiento.id'), nullable=False)




@app.route('/')
def index():
    ultimos_avistamientos = Avistamiento.query.order_by(Avistamiento.id.desc()).limit(2).all()
    
    return render_template('index.html', avistamientos=ultimos_avistamientos)


@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre_form = request.form.get('nombre')
        apellido_form = request.form.get('apellido')
        correo = request.form.get('correo')
        celular = request.form.get('celular')
        comuna_id = request.form.get('comuna') 

        if not nombre_form or not apellido_form or not correo or not celular or not comuna_id:
            lista_comunas = Comuna.query.order_by(Comuna.nombre.asc()).all()
            return render_template('registro.html', comunas=lista_comunas, error_msg="Error: Todos los campos son obligatorios para registrarte.")
        
        nombre_completo = f"{nombre_form} {apellido_form}"
        
        nuevo_voluntario = Voluntario(
            nombre=nombre_completo,
            email=correo,
            telefono=celular,
            comuna_id=comuna_id
        )
        
        db.session.add(nuevo_voluntario)
        db.session.commit()
        
        return render_template('registro_exitoso.html', nombre=nombre_completo)
    
    lista_comunas = Comuna.query.order_by(Comuna.nombre.asc()).all()
    return render_template('registro.html', comunas=lista_comunas)

        


@app.route('/avistamiento', methods=['GET', 'POST'])
def avistamiento():
    if request.method == 'POST':
        
        voluntario_id = request.form.get('voluntario')
        ave_id = request.form.get('ave')
        lugar = request.form.get('lugar')
        fecha = request.form.get('fecha')
        hora = request.form.get('hora')

        if not voluntario_id or not ave_id or not lugar or not fecha or not hora:
            lista_voluntarios = Voluntario.query.order_by(Voluntario.nombre.asc()).all()
            lista_aves = Ave.query.order_by(Ave.nombre.asc()).all()
            return render_template('avistamiento.html', voluntarios=lista_voluntarios, aves=lista_aves, error_msg="Error: Faltan datos clave del avistamiento.")

        fecha_hora_str = f"{fecha} {hora}"
        fecha_hora = datetime.strptime(fecha_hora_str, '%Y-%m-%d %H:%M')
        
        nuevo_avistamiento = Avistamiento(
            voluntario_id=voluntario_id,
            ave_id=ave_id,
            fecha_hora=fecha_hora,
            lugar=lugar)
        
        db.session.add(nuevo_avistamiento)
        db.session.flush()
        
        archivo = request.files.get('evidencia')
        
        if archivo and archivo.filename != "":
            nombre_limpio = secure_filename(archivo.filename)
            ruta_guardado = os.path.join(app.config['UPLOAD_FOLDER'], nombre_limpio)
            archivo.save(ruta_guardado)
            
            nuevo_registro_foto = Registro(
                ruta_archivo=ruta_guardado,
                nombre_archivo=nombre_limpio,
                avistamiento_id=nuevo_avistamiento.id)
            db.session.add(nuevo_registro_foto)
            
        db.session.commit()
        return render_template("avistamiento_exitoso.html")
        
    lista_voluntarios = Voluntario.query.order_by(Voluntario.nombre.asc()).all()
    lista_aves = Ave.query.order_by(Ave.nombre.asc()).all()
    return render_template('avistamiento.html', voluntarios=lista_voluntarios, aves=lista_aves)




@app.route('/listado')
def listado():
    
    page_num = request.args.get('page', 1, type=int)
    
    pag_avistamientos = Avistamiento.query.order_by(Avistamiento.fecha_hora.desc()).paginate(page=page_num, per_page=5, error_out=False)
    
    return render_template('listado.html', paginacion=pag_avistamientos)

@app.route('/indicadores')
def indicadores():
    return render_template('indicadores.html')



@app.route('/detalle/<int:id>')
def detalle_avistamiento(id):
    avistamiento_obj = Avistamiento.query.get(id)
    if not avistamiento_obj:
        return "No se encontro el avistamiento", 404

    return render_template('detalle.html', avistamiento=avistamiento_obj)



@app.route('/api/comentarios', methods=['POST'])
def agregar_comentario():
    nombre = request.form.get('nombre')
    texto = request.form.get('texto')
    avistamiento_id = request.form.get('avistamiento_id')

    if not nombre or len(nombre)>50 or len(nombre)<3: 
        return jsonify({"error": "El nombre debe tener entre 3 y 50 caracteres"}), 400
    
    if not texto or len(texto)< 5:
        return jsonify({"error": "El texto debe tener al menos 5 caracteres"}), 400

    nuevo_comentario = Comentario(
    nombre=nombre,
    texto=texto,
    avistamiento_id=avistamiento_id)
    db.session.add(nuevo_comentario)
    db.session.commit()
    return jsonify({"exito":"Se guardó correctamente el comentario"}), 200

@app.route("/api/comentarios/<int:id_avistamiento>", methods=["GET"])
def obtener_comentarios(id_avistamiento):
    comentario_obj = Comentario.query.filter_by(avistamiento_id=id_avistamiento).all()
    L= []
    for a in comentario_obj:
        L.append({"fecha": a.fecha, "nombre": a.nombre, "texto": a.texto})

    return jsonify(L)
        


@app.route("/api/estadisticas/avistamientos_por_dia", methods= ["GET"])
def estadistica_por_dia():

    resultados = db.session.query(db.func.date(Avistamiento.fecha_hora), db.func.count(Avistamiento.id)).group_by(db.func.date(Avistamiento.fecha_hora)).all()

    L=[]
    for a in resultados:
        L.append({"fecha": str(a[0]), "conteo": a[1]})

    return jsonify(L)


@app.route("/api/estadisticas/avistamientos_por_ave", methods=["GET"])
def estadistica_por_ave():

    resultados = db.session.query(Ave.nombre, db.func.count(Avistamiento.id)).join(Avistamiento).group_by(Ave.nombre).all()

    L=[]
    for a in resultados:
        L.append({"nombre_ave": str(a[0]), "conteo": a[1]})
    
    return jsonify(L)


@app.route("/api/estadisticas/voluntarios_por_comuna", methods=["GET"])
def estadistica_vol_por_comuna():

    resultados= db.session.query(Comuna.nombre, db.func.count(Voluntario.id)).join(Voluntario).group_by(Comuna.nombre).all()

    L=[]
    for a in resultados:
        L.append({"nombre_comuna": str(a[0]), "conteo_voluntario": a[1]})
        
    return jsonify(L)


if __name__ == '__main__':
    app.run(debug=True)




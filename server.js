// Importar frameworks necesarios para ejecutar la app

const express = require('express'); //SW
const mongoose = require('mongoose'); //mangoDB
const bodyParser = require('body-parser'); //json
const cors = require('cors'); //permitir solicitudes
const bcrypt = require('bcrypt'); //incriptar contraseñas

//Crear una instancia de la app express 
const app = express();
//Definir el puerto donde se ejecutará el servidor
const PORT =3000;

//habilitar cors para permitir peticiones
app.use(cors());
//sentencia que permite a express entienda el formato json
app.use(bodyParser.json());

//detectar archivos estaticos de la carpeta public
app.use(express.static('public'));

//conexion a mongoDB
mongoose.connect('mongodb://localhost:27017/linea',{ 
    useNewUrlParser: true, //usa el parser del url
    useUnifiedTopology: true //motor de monitoreo 
})

//si la conexion es exitosa , muestra mensaje 
.then(() => console.log('Conexión exitosa a MongoDB'))
//si hay un error en la conexion, muestra mensaje
.catch(err => console.error(err));

//esquemas y modelos 

//define el esquema para los usuarios 
const UsuarioSchema=new mongoose.Schema({
    nombre:String,
    email:String,
    password:String
});
//Crear el modelo usuario basado en el esquema anterior 
const Usuario=mongoose.model('Usuario', UsuarioSchema);







//Definir esquema de alumnos
const AlumnoSchema =new mongoose.Schema({
    nombre:String,
    apellido:String
});
const Alumno= mongoose.model('Alumno', AlumnoSchema);

//Definir esquema de maestros
const MaestrosSchema = new mongoose.Schema({
    nombre:String,
    materia:String
});
 const Maestro = mongoose.model('Maestro', MaestrosSchema);

 //Definir esquema de tutores
const TutoresSchema = new mongoose.Schema({
    nombre:String,
    alumno:String
});
const Tutores = mongoose.model('Tutores', TutoresSchema);

 //Definir esquema de materias
const MateriasSchema = new mongoose.Schema({
    nombre:String,
    horas:String
});
const Materias = mongoose.model('Materias', MateriasSchema);


 //Definir esquema de calificaciones
const CalificacionesSchema = new mongoose.Schema({
    alumno:String,
    promedio:String
});
const Calificaciones = mongoose.model('Calificaciones', CalificacionesSchema);

//Rutas de autenticación
app.post ('/registro', async(req, res)=>{
    //extrae el email y el password}
    const{nombre,email,password}=req.body;
    //Encripta la contraseña
    const hashedPassword=await bcrypt.hash(password,10);
    //Crea un nuevo usuario con datos recibidos
    const nuevoUsuario=new Usuario({nombre,email,password:hashedPassword});
    //Guarda el usuario en la base
    await nuevoUsuario.save();
    //Responde con un mensaje de exito
    res.status(201).send('Usuario registrado');
});

//ruta para iniciar sesión
app.post('/login', async(req, res)=>{
    //extrae el email y el password del cuerpo de la solicitud
    const {email, password} = req.body; 
    //Busca el usuario por el email dado
    const usuario = await Usuario.findOne({email});
    //si no existe el usuario, responde con un error
    if(!usuario)return res.status(401).send('Usuario no encontrado');
    //Compara la contraseña proporcionada 
    const valid = await bcrypt.compare(password, usuario.password);
    //si la contraseña no es valida responde con error 401 
    if(!valid)return res.status(401).send('Contraseña incorrecta');
    //si todo es correcto, responde con un mensaje de exito
    res.send('Bienvenido ' + usuario.nombre);
});

//CRUD de alumnos
//ruta para todos los alumnos
app.get('/api/alumnos', async (req, res) => {
    //busca todos los alumnos en la base de datos
    const alumnos = await Alumno.find();
    //devuelve la lista de alumnos en formato JSON
    res.json(alumnos);
});

//Crear un nuevo alumno
app.post('/api/alumnos', async (req, res) => {
    //Crea un nuevo alumno
    const nuevo = new Alumno(req.body);
    //Guarda el alumno en la base de datos
    await nuevo.save();
    //Responde con un mensaje de éxito
    res.status(201).send('Alumno creado');
});

//Eliminar el alumno por id
app.delete('/api/alumnos/:id', async (req, res) => {
    //elimina el alumno por id
    await Alumno.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('Alumno eliminado');
});

//CRUD de maestros
app.get('/api/maestros', async (req, res) => {
    //busca todos los maestros en la base de datos
    const maestros = await Maestro.find();
    //devuelve la lista de maestros en formato JSON
    res.json(maestros);
});

//Crear un nuevo maestro
app.post('/api/maestros', async (req, res) => {
    //Crea un nuevo maestro
    const nuevo = new Maestro(req.body);
    //Guarda el maestro en la base de datos
    await nuevo.save();
    //Responde con un mensaje de éxito
    res.status(201).send('Maestro creado');
});

//Eliminar el maestro por id
app.delete('/api/maestros/:id', async (req, res) => {
    //elimina el maestro por id
    await Maestro.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('Maestro eliminado');
});


//Ruta para obtener todos los tutores
app.get('/api/tutores' , async(req, res) => { 
//Busca todos los tutores en la base de datos
const tutores=await Tutores.find();
//Devuelve la lista de tutores en formato JSON
res.json(tutores);    
});
//Ruta para crear un nuevo tutor
   app.post('/api/tutores', async (req,res)=> {
    //Crea un nuevo tutor  con los datos recibidos en la seleccion
   const nuevo =new Tutores (req.body);
   //guarda el tutor en la base de datos
   await nuevo.save();
   //responde con un mensaje de exito y codigo 201 (creado)
   res.status(201).send('Tutor creado');
});

//Ruta eliminar un tutor por  su Id
app.delete('/api/tutores/:id' , async (req,res) => {
    //eliminar el tutor cuyo id se recibe
    await Tutores.findByIdAndDelete(req.params.id);
    //responde con un mensaje de exito
    res.send('Tutor  eliminado');
});



//CRUD de materias
//ruta para todas las materias
app.get('/api/materias', async (req, res) => {
    //busca todas las materias en la base de datos
    const materias = await Materias.find();
    //devuelve la lista de materias en formato JSON
    res.json(materias);
});

//Crear una nueva materia
app.post('/api/materias', async (req, res) => {
    //Crea una nueva materia
    const nuevo = new Materias(req.body);
    //Guarda la materia en la base de datos
    await nuevo.save()
    //Responde con un mensaje de éxito
    res.status(201).send('Materia creada');
});

//Eliminar la materia por id
app.delete('/api/materias/:id', async (req, res) => {
    //elimina la materia por id
    await Materias.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('Materia eliminada');
});

//  CRUD Calificaciones 
app.get('/api/calificaciones', async (req, res) => {
    const calificaciones = await Calificaciones.find();
    res.json(calificaciones);
});

app.post('/api/calificaciones', async (req, res) => {
    const nueva = new Calificaciones(req.body);
    await nueva.save();
    res.status(201).send('Calificación creada');
});

app.delete('/api/calificaciones/:id', async (req, res) => {
    await Calificaciones.findByIdAndDelete(req.params.id);
    res.send('Calificación eliminada');
});



//Iniciar servidor 

//Inicia el servidor y lo pone a eschucar en el puerto definido
app.listen(PORT, () => {
    // Muestra en consola la URL esta corriendo el servidor
    console.log(`Servicio escuchando en http://localhost:${PORT}`);
} );
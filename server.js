require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CONEXION MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));


const Usuario = require("./modelos/Usuario.js");

app.use(express.static("html"));

// REGISTRO
app.post("/registro", async (req, res) => {

    try {

        const { nombre, correo, telefono, contrasena } = req.body;

        const existe = await Usuario.findOne({ correo });

        if(existe){
            return res.send("El usuario ya existe");
        }

        const passwordHash = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = new Usuario({

            nombre: nombre,
            correo,
            telefono: telefono,
            contrasena: passwordHash

        });

        await nuevoUsuario.save();

        res.send(`
            <script>
                alert("Usuario registrado correctamente");
                window.location.href = "/paginas/login.html";
            </script>
        `);

    } catch(error){

        console.log(error);
        res.send("Error");

    }

});

// LOGIN
app.post("/login", async (req, res) => {

    try {

        const { correo, contrasena } = req.body;

        const usuario = await Usuario.findOne({ correo });

        if(!usuario){
            return res.send("Usuario no encontrado");
        }

        const passwordCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if(!passwordCorrecta){
            return res.send("Contraseña incorrecta");
        }

        res.send(`
            <script>
                alert("Inicio de Sesion Correcto");
                window.location.href = "/index.html";
            </script>
        `);

    } catch(error){

        console.log(error);
        res.send("Error");

    }

});


app.listen(process.env.PORT, () => {

    console.log("Servidor corriendo en puerto 3000");

});
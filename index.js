const express = require('express')
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const bcrypt = require('bcrypt')


app.listen(3000, console.log("Server on"))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


const { verifyToken } = require('./middlewares')
const { registerUser, verifyUser, profileView } = require('./queries');


//Registrar
app.post("/usuarios", async (req, res) => {

    const { email, password, rol, lenguage } = req.body;

    try {

        const bcryptPassword = await bcrypt.hash(password, 10);

        console.log("Password encriptado: ", bcryptPassword)

        const rows = await registerUser({ email, bcryptPassword, rol, lenguage });

        console.log(rows)
        return res.json("Usuario registrado.");
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }

});


//login
app.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;
        await verifyUser(email, password);

        //Generar token.    
        const token = jwt.sign({ email, password }, 'secretKey') //Payload, Secret key: contraseña para decifrar tokens.

        res.send(token);


    }

    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

// Mostrar datos del usuario (Autorizado)
app.get("/perfil", verifyToken, async (req, res) => {

    try {

        const authorization = req.header ("Authorization");
        const token = authorization.split ("Bearer ")[1]
        jwt.verify(token, "Secret Password")

        const user = await profileView()
        res.send(user)


    } catch (error) {
        res.status(error.code || 500).send(error)

    }
})



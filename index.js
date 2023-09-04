const express = require('express')
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const bcrypt = require('bcrypt')


app.listen(3009, console.log("Server on"))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


const { registerUser, verifyUser, profileView } = require('./queries');
const { report } = require('./middlewares')


//REGISTRAR USUARIO
app.post("/usuarios",report, async (req, res) => {
    try {
        const user = req.body;
        await registerUser(user);
        res.send('usuario registrado con exito');
    } catch (error) {
        res.status(error.code || 500).send(error)
    }

})

//LOGIN
app.post("/login",report, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verifyUser(email, password);
        const token = jwt.sign({ email }, "secreto");
        res.send(token);
    } catch (error) {
        res.status(error.code || 500).send(error)
    }

})

// Mostrar datos del usuario (Autorizado)
app.get("/usuarios", report, async (req, res) => {

    const Authorization = req.header('Authorization');
    const token = Authorization.split("Bearer ")[1]; //SEPARAR BEARER Y TOKEN
    jwt.verify(token, 'Secret Password');
    const { email } = jwt.decode(token);

    const user = await profileView(email)
    res.json(user)


}

)



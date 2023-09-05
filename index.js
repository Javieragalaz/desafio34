const express = require('express')
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken')
const morgan = require('morgan')


app.listen(3009, console.log("Server on"))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


const { registerUser, verifyUser, profileView } = require('./queries');
const { report, verifyLogin, verifyToken }= require ('./middlewares')

//REGISTRAR USUARIO
app.post("/usuarios", report, async (req, res) => {
    try {
        const newUser = req.body;
        await registerUser(newUser);
        res.send('usuario registrado con exito');
    } catch (error) {
        res.status(error.code || 500).send(error)
    }

})

//LOGIN
app.post("/login",verifyLogin, report, async (req, res) => {
    try {
        const { email, password } = req.body;
         result = await verifyUser(email, password);
         if (!result.error) {
            const token = jwt.sign({email}, "Secret.key");
            console.log(token)
            res.send(token);
        } else {
            res.status(400).send(result.msg);
        }
    } catch (error) {
        res.status(error.code || 500).send(error)
    }

})

// MOSTRAR DATOS DEL USUARIO (AUTORIZADO)
app.get("/usuarios", verifyToken, report, async (req, res) => {

    const Authorization = req.header('Authorization');
    const token = Authorization.split("Bearer ")[1]; //SEPARAR BEARER Y TOKEN
    const {email} = jwt.verify(token, 'Secret.key');
    

    const profile = await profileView()
    res.send(profile)
} 

)



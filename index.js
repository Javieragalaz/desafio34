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


const { report } = require('./middlewares');
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

//Login
app.post('/login',report, async (req, res) => {

    const { email, password } = req.body;
    await verifyUser(email, password);

    //Generar token.    
    const token = jwt.sign({ email }, 'secretKey') //Payload, Secret key: contraseña para decifrar tokens.
    res.send(token);
}
)

// Mostrar datos del usuario (Autorizado)
app.get("/usuarios" , report, async (req, res) => {

    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, 'Secret Password');
    const { email } = jwt.decode(token);

    const user = await profileView(email)
    res.json(user)


}

)



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

const queries = async (req, res) => {
const params = req.params
const body = req.body}


const { registerUser, verifyUser, profileView } = require('./queries');


//Registrar
app.post("/usuarios", async (req, res) => {
    const { email, password, rol, lenguage } = req.body;
    try {
    
      if (!email || !password) {
        throw { message: "el email y la contraseña son requeridos" };
      }
  
      const bcryptPassword = await bcrypt.hash(password, 10);
      console.log("Password encriptado: ", bcryptPassword)
  
      const  rows  = await registerUser({email, bcryptPassword , rol , lenguage});
      console.log('rows ')
      console.log(rows)
      return res.json({rows});
    }
    catch(error) { 
              console.error(error.message);
              res.status(500).json({ message: error.message });
    }

  });
  

//ingresar
app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw { message: "Ingresa email y password" }
        }

        const userLogin = await verifyUser(email)
        const verifyPassword = await bcrypt.compare(password, userLogin)

        if (verifyPassword == false) {
            throw { message: 'Password incorrecto' }
        }
        else { console.log('Usuario no existe') }

        //generar token
        const token = jwt.sign({ email, password }, 'secretKey')
        res.send(token);
    }

    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }

})

// Mostrar datos del usuario (Autorizado)
app.get("/perfil", async (req, res) => {

    const { email, rol, lenguage } = req.body

    res.json

})
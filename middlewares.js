const jwt = require("jsonwebtoken")

const report = async (req, res, next) => {
    const params = req.params;
    const url = req.url;
    const body = req.body

    next()

    console.log(` ${new Date()} - ${url} - ${body.email} `, params);
}

const verifyToken = (req, res, next) => {

    const token = req.header('Authorization').split('Bearer ')[1];

    if (!token)
        throw { code: 401, message: 'Debe incluir el token en las cabeceras (Authorization)' }

    const validToken = jwt.verify(token, "Secret.key")
    if (!validToken)
        throw { code: 401, message: "Token inválido" }

    const { email } = jwt.decode(token)
    console.log("Solicitud enviada por " + email);

    next()
}

const verifyLogin = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        res.send({ message: "Credenciales inválidas" })
    }
    next()
}




module.exports = { report, verifyToken, verifyLogin }

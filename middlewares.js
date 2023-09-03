const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization").split("Bearer ")[1]
    if (!token) throw { code: 401, message: "Debe tener autorización" }

    const validToken = jwt.verify(token, "MiContraseñaUltraSecreta")
    if (!validToken) throw { code: 401, message: "El token es inválido" }
    const { email } = jwt.decode(token)
    console.log("Solicitud enviada por " + email);
    next()
}


module.exports = { verifyToken }
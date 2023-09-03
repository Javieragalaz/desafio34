
const bcrypt = require('bcrypt')
const { Pool } = require('pg')


const pool = new Pool({
    host: 'localhost',
    user: 'javi',
    password: 'admin',
    database: 'softjobs',
    port: '5432',
    allowExitOnIdle: true
})


//REGISTRAR NUEVO USUARIO.
const registerUser = async (user) => {

    let { email, bcryptPassword, rol, lenguage } = user //ALMACENAR  EN UNA VARIABLE TODOS LAS PROPIEDADES DEL USUARIO.
    const query = ' INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)'; //INSERTAR VALORES DE LAS PROPIEDADES EN LA BASE DE DATOS
    const values = [email, bcryptPassword, rol, lenguage] //VALORES QUE VAN A REEMPLAZAR LOS PLACEHOLDERS

    try {
        return await pool.query(query, values) //CONSULTAR DB Y REEMPLAZA LOS VALORESDE DE LOS PLACEHOLDERS / EVITAR DEPENDENCY INJECTION

    }
    catch (error) {
        console.log(error);
    }
}


//LOGIN
const verifyUser = async (email, password) => {

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1 AND password =$2' //VERIFICAR QUE EMAAIL Y CONTRASEÑA EXISTAN.
        const values = [email, password]

        //rowCount: Número de usuarios registrados (debe ser 1)
        const { row: [user], rowCount } = await pool.query(query, values);

        if (!rowCount)
            throw { code: 404, message: 'El usuario no existe' }

        const { password: passwordEncrypted } = user
        const correctPassword = bcrypt.compareSync(password, passwordEncrypted); //Compara 2 strings y responde true o false.

        if (!rowCount || !correctPassword) {

            throw { code: 401, message: "Email o contraseña inválidos" }
        }

        if (correctPassword) {
            console.log('Acceso correcto');


        } else {
            console.log('Los datos no coinciden')

        }
    }

    catch {
        console.log(error)

    };
}
const profileView = async (email) => {

    const query = 'SELECT email, rol, lenguage FROM usuarios'
    const values = [email, rol, lenguage];

    const { rows } = await pool.query(query, values)

    return rows

}

module.exports = { registerUser, verifyUser, profileView }
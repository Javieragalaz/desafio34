
const { Pool } = require('pg');
const bcrypt = require('bcryptjs')


const pool = new Pool({
    host: 'localhost',
    user: 'javi',
    password: 'admin',
    database: 'softjobs',
    port: '5432',
    allowExitOnIdle: true
})

const registerUser = async (user) => {

    let { email, password, rol, lenguage } = user;

    // ENCRIPTAR LAS CONTRASEÑAS DE LOS NUEVOS USUARIOS 
    const passwordEncrypted = bcrypt.hashSync(password)
    password = passwordEncrypted

    const query = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)"
    const values = [email, passwordEncrypted, rol, lenguage]

    try {
        await pool.query(query, values)

    } catch (error) {
        console.log(error)
    }

};


//LOGIN
const verifyUser = async (email, password) => {

    const query = "Select * from usuarios where email = $1";
    const values = [email];

    try {

        const { rows: [user], rowCount } = await pool.query(query, values);

        if (rowCount == 1) {

            const dbPassword = user.password;
            const correctPassword = bcrypt.compareSync(password, dbPassword);

            if (correctPassword) {
                console.log("validado!");
                return { error: false, msg: "Usuario correcto" };

            } else {
                console.log("falso !");
                return { error: true, msg: "Usuario o contraseña inválido" };
            }

        } else {
            return { error: true, msg: "Usuario o contraseña inválido" };

        }

    } catch (error) {
        console.log(error);
        return { error: true, msg: "Hubo un error inesperado" };
    }

}


const profile = async (email) => {

    const { rows: profile } = await pool.query("SELECT * FROM usuarios")
    console.log(profile)

    return profile
}

module.exports = { registerUser, verifyUser, profile }
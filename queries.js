
const { Pool } = require('pg');
const bcrypt = require('bcrypt')


const pool = new Pool({
    host: 'localhost',
    user: 'javi',
    password: 'admin',
    database: 'softjobs',
    port: '5432',
    allowExitOnIdle: true
})

const registerUser = async (user) => {

    let { email, password, rol, lenguage } = user


    // ENCRIPTAR LAS CONTRASEÑAS DE LOS NUEVOS USUARIOS 
    const passwordEncrypted = bcrypt.hash(password, 10)
    password = passwordEncrypted

    const values = [email, passwordEncrypted, rol, lenguage]
    const query = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    await pool.query(query, values)
};


//LOGIN
const verifyUser = async (email, password) => {

    const query = "Select * from usuarios where email = $1";
    const values = [email];

    try {

        const {rows: [user], rowCount} = await pool.query(query, values);

        if (rowCount == 1) {

            const passwordFromDBEncripted = user.password;
            const correctPassword = bcrypt.compareSync(password, passwordFromDBEncripted);

            if (correctPassword){
                console.log("validado!");
                return {error:false, msg: "Usuario correcto"};
            } else {
                console.log("falso !");
                return {error:true, msg: "Usuario o contraseña inválido"};
            }

        } else {
            return {error:true, msg: "Usuario o contraseña inválido"};
            
        }

    } catch (error) {
        console.log(error);
        return {error:true, msg: "Hubo un error inesperado"};
    }

}


const profile = async (email) => {

    const query = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows: [user] } = await pool.query(query, values);
    return user;

}

module.exports = { registerUser, verifyUser, profile }
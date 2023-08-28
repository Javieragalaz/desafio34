
const bcrypt = require ('bcrypt')
const { Pool } = require ('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'javi',
    password: 'admin',
    database: 'softjobs',
    port:'5432',
    allowExitOnIdle: true
})

const registerUser = async (user) => {

let {email, bcryptPassword, rol, lenguage}= user

    const query = ' INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)';
    // const encrypt = bcrypt.hashSync(password, 1);

    // password = encrypt;
    console.log('imprime el usuario')
    console.log(user)

    const values = [ email, bcryptPassword, rol, lenguage]


    try {
        return await pool.query(query, values)

    }
    catch (error) {
        console.log(error);
    }
}


const verifyUser = async (email, password) => {

    const query = 'SELECT * FROM usuarios WHERE email = $1 AND password = $2'
    const values = [email, password]

    try {

        const { rows: [email], rowCount } = await pool.query(query, values);

        if (rowCount == 1) {

            const passwordEncrypted = email.password;
            const correctPassword = bcrypt.compareSync(password, passwordEncrypted);}

            if (correctPassword) {
                console.log('Usuario validado');

            } else {
                console.log('Los datos no coinciden')

            
            } 
    }


 catch (error) {console.log('error')}};

const profileView = async (email) => {

    const query = 'SELECT email, rol, lenguage FROM usuarios'
    const values = [email, rol, lenguage];

    const { rows } = await pool.query(query, values)

    return rows

}

module.exports = { registerUser, verifyUser, profileView }
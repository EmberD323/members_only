const pool = require("./pool");

async function findUserByUsername(username) {
    const { rows } = await pool.query("SELECT * FROM users where username = $1",[username]);
    return rows[0];
}

async function addUser(firstName,lastName,username,password) {
    await pool.query("INSERT INTO users (first_name,last_name,username,password,membership_status) VALUES($1,$2,$3,$4,'notactive')" 
        ,[firstName,lastName,username,password]);
    const { rows } = await pool.query("SELECT * FROM users");
    console.log(rows)
    return 
}
async function getUserByUsername(username) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return  rows[0]
}

async function getUserByID(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return  rows[0]
}


    
     
module.exports ={findUserByUsername,
    addUser,
    getUserByUsername,
    getUserByID
  }
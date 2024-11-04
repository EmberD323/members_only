const pool = require("./pool");

async function findUserByUsername(username) {
    const { rows } = await pool.query("SELECT * FROM users where username = $1",[username]);
    return rows[0];
}

async function addUser(firstName,lastName,username,password,admin) {
    if (admin=="true"){
        await pool.query("INSERT INTO users (first_name,last_name,username,password,membership_status,admin_status) VALUES($1,$2,$3,$4,'notactive','true')" 
            ,[firstName,lastName,username,password]);
        return 
    }else{
        await pool.query("INSERT INTO users (first_name,last_name,username,password,membership_status,admin_status) VALUES($1,$2,$3,$4,'notactive','false')" 
            ,[firstName,lastName,username,password]);
        return 
    }
    
}
async function getUserByUsername(username) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return  rows[0]
}

async function getUserByID(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return  rows[0]
}

async function updateMembership(user) {
    await pool.query("UPDATE users SET membership_status='active'  WHERE username=$1",[user.username]);
    
 
    return 
}

async function addMessage(userID,date,title,message) {
    await pool.query("INSERT INTO messages (title,time,text,userid) VALUES($1,$2,$3,$4)" 
       ,[title,date,message,userID]);

    return 
}
async function getAllMessages() {
    const { rows } = await pool.query("SELECT * FROM messages JOIN users ON (userid = users.id)");
    return  rows
}

async function deleteMessage(messageid) {
    await pool.query("DELETE FROM messages WHERE id=$1",
    [messageid]);
    return
}
module.exports ={findUserByUsername,
    addUser,
    getUserByUsername,
    getUserByID,
    updateMembership,
    addMessage,
    getAllMessages,
    deleteMessage
  }
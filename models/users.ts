import * as db from '../helpers/database';
import bcrypt from 'bcryptjs';

export const getAll = async  (limit=10, page=1) =>{
  const offset = (page - 1) * limit;
  const query = "SELECT * FROM users LIMIT  ? OFFSET  ?;";
  const data = await db.run_query(query, [limit, offset]);
  return data;
}

export const getSearch = async  (sfield:any,q:any) =>{
 const query = `SELECT ${sfield} FROM users WHERE ${sfield} LIKE '%${q}%' `;
 try{ const data = await db.run_query(query,null);
  return data;}
  catch(error) {
    return error
}
}

export const getByUserId = async  (id:number) =>{
  let query = "SELECT * FROM users WHERE id = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}

  export const add = async  (user:any) =>{  
  let keys= Object.keys(user)
  let values= Object.values(user)  
  let key = keys.join(',')   
  let parm = ''
  for(let i =0; i<values.length; i++){ parm +='?,'}
  parm=parm.slice(0,-1)
  let query = `INSERT INTO users (${key}) VALUES (${parm})`
  try{
    await db.run_query(query, values)  
    return {"status": 201}
  } catch(error) {
    return error
  }
}

export const findByUsername = async (username: string) => {
  const query = 'SELECT * FROM users where username = ?';
  const user = await db.run_query(query,  [username] );
  return user;
}

export const  update= async(user:any,id:any)  =>{  

  //console.log("user " , user)
 // console.log("id ",id)
  console.log(user)
  console.log(id)
  // Generate a new salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the new salt if present in the user object
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    user.passwordsalt = salt; // Set the new salt in the user object
  }
  let keys = Object.keys(user)
  let values = Object.values(user)  
  let updateString=""
  for(let i: number = 0; i<values.length;i++){updateString+=keys[i]+"="+"'"+values[i]+"'"+"," }
 updateString= updateString.slice(0, -1)
 // console.log("updateString ", updateString)
  let query = `UPDATE users SET ${updateString} WHERE ID=${id} RETURNING *;`
  try{
   await db.run_query(query, values)  
    return {"status": 201}
  } catch(error) {
    return error
  }
}

export const deleteById = async (id:any) => {
  let query = "Delete FROM users WHERE ID = ?"
  let values = [id]
  try{
    await db.run_query(query, values);  
    return { "affectedRows":1 }
  } catch(error) {
    return error
  }
}

export const compare = async (username: string, email: string) => {
  let query = `SELECT id FROM users WHERE username = ? AND email = ?`;
  let values = [username, email];
  try {
    const result = await db.run_query(query, values);
    if (result.length > 0) {
      return result[0].id; 
    } else {
      return null; 
    }
  } catch (error) {
    throw error; 
  }
};

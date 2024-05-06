import * as db from '../helpers/database';

//get all Msgs of articled
export const getMsg= async  (id:any)=> {
  let query = "SELECT * FROM msgs WHERE articleid=?;";
  const result = await db.run_query(query, [id]);
  return result;
}

//add a new Msg
export const add_Msg = async (id:any, uid:any,uname:any,msg:any) =>{
 console.log('body query ', msg)
  let msgtxt=msg.messagetxt;
  console.log ("msgtxt from query ",msgtxt)
    let query = `INSERT INTO msgs (articleid,userid,username,messagetxt) VALUES (${id},${uid},'${uname}','${msgtxt}') `  
  try{
    await db.run_query(query, [id, uid,uname,msgtxt]);  
       return {"status": 201, "affectedRows":1 }
    }
   catch(error) {
    return error
  }
  
}


    

//remove a msg record
export const removeMsg = async  (id:any, msg:any)=> {
  console.log('body query ', msg)
  let msgtxtin=msg.source
  console.log("msgtxtin from source ", msgtxtin)
  let msgObj=JSON.parse(msgtxtin)
  console.log("msgtxtin from msgObje ", msgObj)
  
  let msgtxt:any=msgObj.messagetxt
  console.log('in query ', msgtxt)
let query = "DELETE FROM msgs WHERE articleid=? AND messagetxt=?; ";
   try{
    await db.run_query(query, [id, msgtxt]);  
    return { "affectedRows":1 }
  } catch(error) {
    return error
  }

}



import * as db from '../helpers/database';

//add a new like record
export const like = async  (id:any, uid:any) =>{

 let query = `INSERT INTO articleslikes (articleid,userid) VALUES (${id},${uid}) ON CONFLICT ON CONSTRAINT  NoDuplicateLike DO NOTHING RETURNING userid;`   
  
 try{   
 
  const result:any=await db.run_query(query, [id, uid]); 
  console.log("result return ", result)
       return {"status": 201, "affectedRows":1,"userid" :result[0].userid}
     
 } catch(error) {
  return error
}
 }
 

 

    

//remove a like record
export const dislike = async  (id:any, uid:any)=> {
  let query = "DELETE FROM articleslikes WHERE articleid=? AND userid=?; ";
   try{
    await db.run_query(query, [id, uid]);  
    return { "affectedRows":1 }
  } catch(error) {
    return error
  }

}

//count the likes for an article

export const count = async  (id:any) =>{
  let query = "SELECT count(1) as likes FROM articleslikes WHERE articleid=?;";
  const result:any = await db.run_query(query, [id]);
  return result[0].likes;
}


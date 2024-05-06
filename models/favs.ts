import * as db from '../helpers/database';

//add a user Favorite
export const addFav = async (id:any, uid:any) =>{
//let query1 = `SELECT * FROM favs WHERE  articleid=${id} AND userid=${uid} `
 let query = `INSERT INTO favs (articleid,userid) VALUES (${id},${uid}) ON CONFLICT ON CONSTRAINT  NoDuplicateFav DO NOTHING RETURNING userid;`   
 try{
 
   const result:any = await db.run_query(query, [id, uid]);  
       return {"status": 201, "affectedRows":1,"userid" :result[0].userid }
      } catch(error) {
        return error
      }
  
  }
  



    

//remove a fav record
export const removeFav = async (id:any, uid:any) =>{
   let query = `DELETE FROM favs WHERE articleid=${id} AND userid=${uid} ;`;
   try{
        await db.run_query(query, [id, uid]);  
    return { "affectedRows":1 }
  } catch(error) {
    return error
  }

}

//list the fav  article for user
export const listFav = async (id:any)=> {
  let query = "SELECT * FROM favs  WHERE userid=?";
   const result = await db.run_query(query, [id]);
  return result;
}


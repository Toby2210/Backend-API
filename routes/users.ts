import { basicAuth } from '../controllers/auth';
import { validateUser } from "../controllers/validation";
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as model from '../models/users';

const prefix = '/api/v1/users';
const router:Router = new Router({ prefix: prefix });

const getAll = async(ctx: any, next: any) =>{  
 
    let users = await model.getAll(20, 1);
    if (users.length) {
      ctx.body = users;
    }
      else {
        ctx.body = {};
      }
      await next();
  
  }

const doSearch = async(ctx: any, next: any) =>{
  
    let { limit = 50, page = 1, fields = "", q = "" } = ctx.request.query;
    // ensure params are integers
    limit = parseInt(limit);
    page = parseInt(page);
    // validate values to ensure they are sensible
    limit = limit > 200 ? 200 : limit;
    limit = limit < 1 ? 10 : limit;
    page = page < 1 ? 1 : page;
    let result:any;
    // search by single field and field contents
    // need to validate q input
   try{
    if (q !== "") 
      result = await model.getSearch(fields, q);     
    else
    {console.log('get all')
      result = await model.getAll(limit, page);
     console.log(result)
    }
      
    if (result.length) {
      if (fields !== "") {
        // first ensure the fields are contained in an array
        // need this since a single field in the query is passed as a string
        console.log('fields'+fields)
        if (!Array.isArray(fields)) {
          fields = [fields];
        }
        // then filter each row in the array of results
        // by only including the specified fields
        result = result.map((record: any) => {
          let partial: any = {};
          for (let field of fields) {
            partial[field] = record[field];
          }
          return partial;
        });
      }
      console.log(result)
      ctx.body = result;
    }
  }
    catch(error) {
      return error
    }
   await next();
  }


  const getById = async(ctx: any, next: any) =>{
  let id = ctx.params.id;
  let user = await model.getByUserId(id);
  if (user.length) {
    ctx.body = user[0];
  }
}

  const createUser = async(ctx: any, next: any) =>{
  const body = ctx.request.body;
    let avatarurl:string=' '
    if(body.avatarurl)
      avatarurl=body.avatarurl;
    let username:string= body.username;
    let password:string = body.password;
    let email:any = body.email;
    let role:string = 'user';
    let secretkey:string = body.actiCode;
    let secretList:string[]= ["mongkok_123456789", "mongkok_987654321","shatin_123456789","shatin_987654321","chaiwan_123456789","chaiwan_987654321" ]
     if(secretkey)
     {for(let i=0;i<secretList.length;i++)
       if(secretkey==secretList[i])
       {role='admin'
        break;
       }
     }
    console.log("role ", role)
    let newUser = {username: username, password: password, email: email, avatarurl: avatarurl, role: role};
    
  let result = await model.add(newUser);
  if (result) {
    ctx.status = 201;
    ctx.body = result;
  } else {
    ctx.status = 201;
    ctx.body = "{message:New user created}";
  }
}

  const login = async(ctx: any, next: any) =>{
  // return any details needed by the client
    const user = ctx.state.user;
 // const { id, username, email, avatarurl, role } =ctx.state.user;
    const id:number =user.user.id;
    const username:string =user.user.username;
    const email:string =user.user.email;
    const avatarurl:string =user.user.avatarurl;
    const role:string =user.user.role;
    const links = {
    self: `http://${ctx.host}${prefix}/${id}`,
  };
  ctx.body = { id, username, email, avatarurl, role, links };
}

const updateUser = async(ctx: any, ) =>{
  let id = +ctx.params.id;
  let c: any = ctx.request.body; 
  let result = await model.update(c,id)
  if (result) {
    ctx.status = 201
    ctx.body = `User with id ${id} updated` 
  } 
}

const deleteUser = async(ctx: any, next: any) =>{
  let id = +ctx.params.id;
  
  let user = await model.deleteById(id)
    ctx.status=201
    ctx.body = `User with id ${id} deleted`
    await next();
}


router.get('/', basicAuth, doSearch);
//router.get('/search', basicAuth, doSearch);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})',bodyParser(), validateUser,  updateUser);
router.del('/:id([0-9]{1,})', deleteUser);
router.post('/login', basicAuth, login);

export {router};
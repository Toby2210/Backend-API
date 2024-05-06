import Router, {RouterContext} from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/articles";
import * as likes from "../models/likes";
import * as favs from "../models/favs";
import * as msgs from "../models/msgs";
import { validateArticle } from "../controllers/validation";
import { basicAuth } from "../controllers/auth";

/*
const articles = [
  {title: 'Hello article', fullText: 'some text to fill the body'},
  {title: 'another article', fullText: 'again here is some text here to fill'},
  {title: 'coventry university', fullText: 'some news about coventry university'},
  {title: 'smart campus', fullText: 'smart campus is coming to IVE'}
];

 */

interface Post {
  id: number,
  title: string,
  alltext:string,
  summary: string,
  imageurl: string,
  authorid: number,
  description:string,
  links: {
    likes: string,
    fav: string,
    msg: string,
    self: string
  }
}
const router:Router = new Router({prefix: '/api/v1/articles'});

const getAll = async (ctx: RouterContext, next: any) => {
  //ctx.body = articles;
const {limit=100, page=1,  order="dateCreated", direction='ASC'} = ctx.request.query;
  const parsedLimit = parseInt(limit as string, 10);
  const parsedPage = parseInt(page as string, 10);
  const result = await model.getAll(20, 1, order, direction);
   if (result.length) {
     const body: Post[] = result.map((post: any) => {
       const { id = 0, title = "",  alltext="",summary = "", imageurl = "",authorid = 0,description="" }: Partial<Post> = post;
       const links = {
         likes: `http://${ctx.host}/api/v1/articles/${post.id}/likes`,
         fav: `http://${ctx.host}/api/v1/articles/${post.id}/fav`,
         msg: `http://${ctx.host}/api/v1/articles/${post.id}/msg`,
         self: `http://${ctx.host}/api/v1/articles/${post.id}`
       };
       return { id, title,   alltext,summary, imageurl,authorid, description, links }; // Utilizing the destructured elements
     });
  ctx.body = body;
  
  await next();
      
   }
}
const createArticle = async (ctx: RouterContext, next: any) => {
  /*let c: any = ctx.request.body;
  let title = c.title;
  let fullText = c.fullText;
  let newArticle = {title: title, fullText: fullText};
  articles.push(newArticle);
  ctx.status = 201;
  ctx.body = newArticle;*/
  const body = ctx.request.body;
  let result = await model.add(body);
  if(result.status==201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = {err: "insert data failed"};
  }
  await next();
}

const getById = async (ctx: RouterContext, next: any) => {
  let id = +ctx.params.id;
  /*if((id < articles.length +1) && (id>0)){
    ctx.body = articles[id-1];
  } else {
    ctx.status = 404;
  }*/
  let article = await model.getById(id);
  if(article.length) {
    ctx.body = article[0];
     ctx.status=200;
  } else {
    ctx.status = 404;
  }
  await next();
}

const updateArticle = async (ctx: RouterContext, next: any) => {
  let id = +ctx.params.id;
  //let {title, fullText} = ctx.request.body;
  let c: any = ctx.request.body;
  /*
  let title = c.title;
  let fullText = c.fullText;
  if ((id < articles.length+1) && (id > 0)) {
    articles[id-1].title = title;
    articles[id-1].fullText = fullText;
    ctx.status = 200;    
    ctx.body = articles;
  } else {
    ctx.status = 404;
  }
  */
  let result = await model.update(c,id)
  if (result) {
    ctx.status = 201
    ctx.body = `Article with id ${id} updated` 
  } 
  await next();
}

const deleteArticle = async (ctx: RouterContext, next: any) => {
  let id = +ctx.params.id;
 /*
  if((id < articles.length+1) && (id > 0)) {
    articles.splice(id-1, 1);
    ctx.status = 200;
    ctx.body = articles;
  } else {
    ctx.status = 404;
  }
  */
let article:any = await model.deleteById(id)
  ctx.status=201
  ctx.body = article.affectedRows ? {message: "removed"} : {message: "error"};
  await next();
}


// methods for like icon
async function likesCount(ctx: RouterContext, next: any) {
  // For you TODO: add error handling and error response code
  const id = ctx.params.id;
  const result = await likes.count(id);
  ctx.body = result ? result : 0;
  await next();
}

async function likePost(ctx: RouterContext, next: any) {
  // For you TODO: add error handling and error response code
  const user = ctx.state.user;
  const uid:number =user.user.id;
  const id = parseInt(ctx.params.id);
  const result:any = await likes.like(id, uid);
  ctx.body = result.affectedRows ? {message: "liked",userid:result.userid} : {message: "error"};
  await next();
}

async function dislikePost(ctx: RouterContext, next: any) {
  // For you TODO: add error handling and error response code
  const user = ctx.state.user;
  const uid:number =user.user.id;
  const id = parseInt(ctx.params.id);
  const result:any = await likes.dislike(id, uid);
  ctx.body = result.affectedRows ? {message: "disliked"} : {message: "error"};
  await next();
}

//mehtods for Heart(Favorite) icon
async function userFav(ctx: RouterContext, next: any) {
  // For you TODO: add error handling and error response code
  const user = ctx.state.user;
  const uid:number =user.user.id;
  const result = await favs.listFav(uid);
  ctx.body = result ? result : 0;
  await next();
}

async function postFav(ctx: RouterContext, next: any) {
  // For you TODO: add error handling and error response code
  const user = ctx.state.user;
  const uid:number =user.user.id;
  const id = parseInt(ctx.params.id);
  const result:any = await favs.addFav(id, uid);
  ctx.body = result.affectedRows ? {message: "added",userid:result.userid} : {message: "error"};
  await next();
}

async function rmFav(ctx: RouterContext, next: any) {
  // For you TODO: add error handling and error response code
  const user = ctx.state.user;
  const uid:number =user.user.id;
  const id = parseInt(ctx.params.id);
  const result:any = await favs.removeFav(id, uid);
  ctx.body = result.affectedRows ? {message: "removed"} : {message: "error"};
  await next();
}

//methods for message icon
async function listMsg(ctx: RouterContext, next: any){
   const id = parseInt(ctx.params.id);
   const result = await msgs.getMsg(id);
  ctx.body = result ? result : 0;
  await next();
}

async function addMsg(ctx: RouterContext, next: any){
  const id = parseInt(ctx.params.id);
  const user = ctx.state.user;
  const uid:number =user.user.id;
  const uname = user.user.username;
  let msg:any = ctx.request.body;
  console.log('ctx.request.body ',ctx.request.body)
  console.log('..msg ',msg)
  const result:any= await msgs.add_Msg(id, uid,uname, msg);
  ctx.body = result.affectedRows ? {message: "added"} : {message: "error"};
  await next();
}

async function rmMsg(ctx: RouterContext, next: any){
  // const uid = ctx.state.user.id;
// only admin can del article comment
 let b:any = ctx.request.body;
 
 const id = parseInt(ctx.params.id); 
  const result:any = await msgs.removeMsg(id, b);
  ctx.body = result.affectedRows ? {message: "removed"} : {message: "error"}; 
  await next();
}

router.get('/', getAll);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(),validateArticle, updateArticle);
router.delete('/:id([0-9]{1,})', basicAuth, deleteArticle);
router.get('/:id([0-9]{1,})/likes', likesCount);
router.post('/:id([0-9]{1,})/likes', basicAuth, likePost);
router.del('/:id([0-9]{1,})/likes', basicAuth, dislikePost);

router.get('/fav', basicAuth, userFav);
router.post('/:id([0-9]{1,})/fav', basicAuth, postFav);
router.del('/:id([0-9]{1,})/fav', basicAuth, rmFav);

router.get('/:id([0-9]{1,})/msg', listMsg);
router.post('/:id([0-9]{1,})/msg', bodyParser(), basicAuth, addMsg);
router.del('/:id([0-9]{1,})/msg', basicAuth, bodyParser(),rmMsg);
export { router };

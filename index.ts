import Koa from "koa";
import Router, { RouterContext }  from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import passport from 'koa-passport';
import bodyParser from "koa-bodyparser";
import cors from '@koa/cors' ;
import { router as articles } from "./routes/articles";
import { router as special } from './routes/special';
import { router as uploads } from './routes/uploads';
import { router as users } from "./routes/users";
import serve from 'koa-static';

const app: Koa = new Koa();
const router: Router = new Router();

/*const welcomeAPI = async (ctx: RouterContext, next:any) => {
  ctx.body = {message: "Welcome to the blog API!"};
  await next();
}

router.get('/api/v1', welcomeAPI);
*/
// For Document:
app.use(serve('./docs'));
app.use(cors());
app.use(logger());
app.use(json());
app.use(bodyParser());
app.use(router.routes());
app.use(passport.initialize());
app.use(articles.middleware());
app.use(special.middleware());
app.use(uploads.middleware());
app.use(users.middleware());

app.use(async (ctx: RouterContext, next: any) => {
  try {
    await next();
    console.log(ctx.status)
    if(ctx.status === 404){
      ctx.body = {err: "No such endpoint existed"};
    }
  } catch(err: any) {
    ctx.body = {err: err};
  }

});
let port = process.env.PORT || 10888;
app.listen(10888, () => {
console.log( `Koa Started at ${port}` );
})
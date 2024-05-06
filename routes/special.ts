import Router, { RouterContext } from "koa-router";
import { basicAuth } from '../controllers/auth';

const router = new Router({prefix: '/api/v1'});

// Just for testing
router.get('/', async(ctx: RouterContext, next: any) => {
  ctx.body= {
    message: 'Public API return'
  };
  await next();
})

router.get("/private", basicAuth, privateAPI);

// Add a protected route that requires authentication
function privateAPI(ctx: RouterContext, next: any) {
  const user = ctx.state.user;
//  console.log('user=> '+JSON.stringify(user))
//  console.log('status=> '+ctx.status)
  ctx.body = {message: `Hello ${user.user.username} you registered on ${user.user.dateregistered}`} 
}



export {router};
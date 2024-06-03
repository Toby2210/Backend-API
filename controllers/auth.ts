import passport from "koa-passport";
import { BasicStrategy } from "passport-http";
import { RouterContext } from "koa-router";
import bcrypt from 'bcryptjs';
import * as users  from '../models/users';

const verifyPassword = (user: any, password: string) => {
  console.log('user return pwd: '+user.password);
  console.log('user return salt: '+user.passwordsalt);
  const salt = user.passwordsalt;
  const hashedPassword = bcrypt.hashSync(password , salt);
  console.log('input password '+ password)
  console.log('hashed password '+ hashedPassword)
  return user.password === hashedPassword;
}

passport.use(new BasicStrategy(async (username, password, done) => {
  // Replace this with your own authentication logic
  /*if (username === "admin" && password === "password") {
    done(null, { username: "admin" });
  } else {
    done(null, false);
  } */
  let result: any[] = [];
  try {
    result = await users.findByUsername(username);
    console.log('user found');
  } catch (error) {
    console.error(`Error during authentication for user ${username}: ${error}`);
    done(null, false);
  }
  if(result.length) {
    const user = result[0];
    console.log('username: '+ user.username);
    if(verifyPassword(user, password)) {
      console.log('done')
      done(null, {user: user});
    } else {
      console.log(`Password incorrect for ${username}`);
      done(null, false);
    }
  } else {
    console.log(`No user found with username ${username}`);
    done(null, false);
  }
}));

export const basicAuth = async (ctx: RouterContext, next: any) => {
  await passport.authenticate("basic", { session: false })(ctx, next);
  if(ctx.status == 401)
  {
    ctx.body = {
      message: 'you are not authorized'
    };
   
   }
/*
  else {
   const user = ctx.state.user; 
     console.log('user=> '+JSON.stringify(user))
    console.log('status=> '+ctx.status)
  ctx.body = {message: `Hello ${user.user.username} you registered on ${user.user.dateregistered}`} 
    }
    */
  }



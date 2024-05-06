import { RouterContext } from "koa-router";
import * as msgs from "../models/msgs";

export async function addMsg(ctx: RouterContext, next: any) {
  const id = parseInt(ctx.params.id);
  const user = ctx.state.user;
  const uid: number = user.user.id;
  const uname = user.user.username;
  let body: any = ctx.request.body;
  let msg = body.messagetxt;
  console.log('ctx.request.body ', ctx.request.body);
  console.log('body.msg ', msg);
  const result: any = await msgs.add_Msg(id, uid, uname, msg);
  ctx.body = result.affectedRows ? { message: "added" } : { message: "error" };
}

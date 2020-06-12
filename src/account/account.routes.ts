import Router from "@koa/router";
import passport from "koa-passport";
import { AccountService } from "./account.service";

export default async ({ router, log }: { router: Router; log: any }) => {
  const accounts = new AccountService();
  const route = new Router();

  route.post("/signup", async (ctx, next) => {
    log.debug("Signup endpoint");
    const newAccount = ctx.request.body;
    await accounts.signup(newAccount);
    ctx.status = 201;
    await next();
  });

  route.post("/signin", passport.authenticate("local", { session: false }), async (ctx) => {
    log.debug("signin");
    ctx.response.body = "";
  });

  router.use(route.routes());
};

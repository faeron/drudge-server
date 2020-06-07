import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import passport from "koa-passport";
import { Strategy as LocalStrategy } from "passport-local";
import Router from "koa-router";
import { AccountService } from "../modules/account/account.service";

export default async ({ app, log }) => {
  const accounts = new AccountService();
  const router = new Router();

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const validAccount = await accounts.signIn(username, password);
        if (!validAccount) {
          done(null, false);
        } else {
          done(null, validAccount);
        }
      } catch (err) {
        done(err);
      }
    })
  );

  app.use(cors());
  app.use(bodyParser());
  app.use(passport.initialize());

  router.post("/signup", async (ctx, next) => {
    log.debug("Signup endpoint");
    const newAccount = ctx.request.body;
    await accounts.signup(newAccount);
    ctx.status = 201;
    await next();
  });
  router.post("/signin", passport.authenticate("local", { session: false }), async (ctx) => {
    ctx.response.body = "";
  });

  app.use(router.routes());
};

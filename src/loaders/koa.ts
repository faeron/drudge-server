import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import passport from "koa-passport";
import { Strategy as LocalStrategy } from "passport-local";
import Router from "@koa/router";
import { AccountService } from "../account/account.service";
import { routes as accountRoutes } from "../account";

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

  // addroutes from modules
  accountRoutes({ router, log });

  app.use(router.routes());
};

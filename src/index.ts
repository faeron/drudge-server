import Koa from "koa";

import config from "./config";
import loaders from "./loaders";
import Logger from "./loaders/logger";

async function startServer() {
  const app = new Koa();
  await loaders({ app, log: Logger });
  setTimeout(() => {
    Logger.level = "debug";
  }, 5000);

  app.listen(config.port, () => {
    Logger.info(`Server started on http://localhost:${config.port}/playground`);
  });
}

startServer();

import type { Express } from "express";

import users from "./users";

/** @todo migrate to app routes */
export default (app: Express) => {
  app.use("/users", users);
};

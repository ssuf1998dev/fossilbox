import type { Express } from "express";

import users from "./users";

export default (app: Express) => {
  app.use("/users", users);
};

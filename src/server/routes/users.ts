import { DatabaseNotSupported } from "@server/errors";
import express from "express";

import sqliteUsersTable from "../db/schema/sqlite/users";

const router = express.Router();

router.get("/", async (req, resp) => {
  const db = req.app.get("db") as FossilboxServer.DatabaseInstance;
  const config = req.app.get("config") as FossilboxServer.UserConfig;

  if (config.db === "sqlite") {
    const users = await db.select().from(sqliteUsersTable);
    resp.json(users);
    return;
  }

  resp.json(new DatabaseNotSupported(config.db).cause).status(501);
});

router.post("/", express.json(), async (req, resp) => {
  const db = req.app.get("db") as FossilboxServer.DatabaseInstance;
  const config = req.app.get("config") as FossilboxServer.UserConfig;

  if (config.db === "sqlite") {
    const user = req.body;
    await db.insert(sqliteUsersTable).values(user);
    resp.json(user);
    return;
  }

  resp.json(new DatabaseNotSupported(config.db).cause).status(501);
});

export default router;

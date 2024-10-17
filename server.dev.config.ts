import "./server/env.d";
import configFormEnv from "./utils/config-form-env";

export default <FossilboxServer.UserConfig>{
  host: "127.0.0.1",
  db: "sqlite",
  sqlite: {
    file: "tmp/db.sqlite",
  },
  ...configFormEnv(),
};

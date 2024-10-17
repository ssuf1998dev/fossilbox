import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { sessionStorage } from "./session";

interface User {
  email: string;
};

export const authenticator = new Authenticator<User>(sessionStorage, { sessionErrorKey: "sessionError" });

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    if (password !== "a") {
      throw new Error("wrong password");
    }
    const user = { email: email?.toString() ?? "" };
    // const user = await login(email, password);
    return user;
  }),
  "user",
);

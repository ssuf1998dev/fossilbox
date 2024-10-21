import { $, type Options as ExecaOptions } from "execa";

export async function push(options: {
  dialect: "sqlite";
  schema: string;
} & Partial<{
  casing: "camelCase" | "snake_case";
  tablesFilter: string;
  schemaFilters: string;
  extensionsFilters: string;
  url: string;
  host: string;
  port: string | number;
  user: string;
  password: string;
  database: string;
  ssl: string;
  authToken: string;
  driver: "d1-http" | "expo" | "aws-data-api" | "pglite";
  strict: boolean;
  force: boolean;
}>) {
  const args = Object.entries(options).map(([key, value]) => {
    const finalKey = `--${{
      authToken: "auth-token",
    }[key] || key}`;

    if (typeof value === "boolean") {
      return value ? [finalKey] : [];
    }
    return [finalKey, value.toString()];
  }).flat(1);

  await $(<ExecaOptions>{ verbose: "full" })`pnpm drizzle-kit push ${args}`;
}

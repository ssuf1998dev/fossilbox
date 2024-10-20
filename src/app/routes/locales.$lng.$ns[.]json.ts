import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { resources } from "../locales/server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { lng, ns } = params;
  const resource = resources[lng!]?.[ns!];
  return resource ? json(resource) : new Response(undefined, { status: 404 });
}

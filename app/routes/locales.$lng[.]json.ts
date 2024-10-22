import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { resources } from "@server/modules/locales";

export async function loader({ params }: LoaderFunctionArgs) {
  const { lng } = params;
  const resource = resources[lng!].common;
  return resource ? json(resource) : new Response(undefined, { status: 404 });
}

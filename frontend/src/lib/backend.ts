export * from "../openapi";
export { DefaultService as Backend } from "../openapi";
import { OpenAPI } from "../openapi";
import { env } from "$env/dynamic/public";

export const BACKEND_URL = env["PUBLIC_BACKEND_URL"];
if (!BACKEND_URL) throw new Error("PUBLIC_BACKEND_URL is not set in .env");
OpenAPI.BASE = BACKEND_URL;

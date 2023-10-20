export * from "../openapi";
export { DefaultService as Backend } from "../openapi";
import { OpenAPI } from "../openapi";

const BACKEND_PORT = 8000;
const BACKEND_HOST = "localhost";
OpenAPI.BASE = `http://${BACKEND_HOST}:${BACKEND_PORT}`; // backend server

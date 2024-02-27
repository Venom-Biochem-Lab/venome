export * from "./openapi";
export { DefaultService as Backend } from "./openapi";
import { OpenAPI } from "./openapi";
import Cookies from "js-cookie";

export const BACKEND_URL = "http://localhost:8000";
OpenAPI.BASE = BACKEND_URL;

// Sets the token header to the stored authentication token from the cookie
export function setToken() {
	console.log("Setting Token")
	OpenAPI.TOKEN = Cookies.get("auth")
}

// Sets the token header to nothing.
export function clearToken() {
	console.log("Clearing token.")
	OpenAPI.TOKEN = undefined
}

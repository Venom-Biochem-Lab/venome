export * from "./openapi";
export { DefaultService as Backend } from "./openapi";
import { OpenAPI } from "./openapi";
import { BACKEND_REQUEST_URL } from "../../buildConstants";
import Cookies from "js-cookie";

OpenAPI.BASE = BACKEND_REQUEST_URL; // sets url for all Backend.func() calls

// Sets the token header to the stored authentication token from the cookie
export function setToken() {
	console.log("Setting Token");
	OpenAPI.TOKEN = Cookies.get("auth");
}

// Sets the token header to nothing.
export function clearToken() {
	console.log("Clearing token.");
	OpenAPI.TOKEN = undefined;
}

export function backendUrl(endpoint: string) {
	return `${BACKEND_REQUEST_URL}/${endpoint}`;
}


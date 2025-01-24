import { writable } from "svelte/store";

export const user = writable({
	loggedIn: false,
	id: 0,
	admin: true,
});

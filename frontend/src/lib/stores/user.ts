import {writable} from 'svelte/store';

export const user = writable({
    loggedIn: 0,
    username: "",
    admin: 0
})
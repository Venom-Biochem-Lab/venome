import { goto } from "$app/navigation";
import { writable, type Writable } from "svelte/store";

export function numberWithCommas(x: number, round = 0) {
	const formatter = new Intl.NumberFormat("en-US");
	return formatter.format(+x.toFixed(round));
}

export function fileToString(f: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsText(f);
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
	});
}

/**
 * When I have a url parameter, I want to first set it to that
 * Then, if the url parameter changes in svelte, I want to change the url in the browser parameter too
 */
export function writableUrlParams(
	searchParams: URLSearchParams,
	name: string
): Writable<any> {
	const param = writable(searchParams.get(name) ?? "");
	return {
		subscribe: param.subscribe,
		set(searchBy) {
			searchParams.set(name, searchBy); // update url
			goto(`?${searchParams.toString()}`, {
				keepFocus: true,
				replaceState: true,
				noScroll: true,
			}); // update browser top
		},
		update() {
			const searchBy = searchParams.get(name) ?? "";
			searchParams.set(name, searchBy); // update url
			goto(`?${searchParams.toString()}`, {
				keepFocus: true,
				replaceState: true,
				noScroll: true,
			}); // update browser top
		},
	};
}

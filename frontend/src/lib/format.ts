export function numberWithCommas(x: number, round = 0) {
	const formatter = new Intl.NumberFormat("en-US");
	return formatter.format(+x.toFixed(round));
}

export function formatProteinName(name: string) {
	return name.replaceAll(" ", "_");
}

export function humanReadableProteinName(name: string) {
	return name.replaceAll("_", " ");
}

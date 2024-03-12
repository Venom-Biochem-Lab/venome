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

export function formatProteinName(name: string) {
	return name.replaceAll(" ", "_");
}
export function undoFormatProteinName(name: string) {
	return name.replaceAll("_", " ");
}

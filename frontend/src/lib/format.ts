export function numberWithCommas(x: number, round = 0) {
	const formatter = new Intl.NumberFormat("en-US");
	return formatter.format(+x.toFixed(round));
}

export function fileToBase64String(f: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(f);
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
	});
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

/**
 * @param date for example: '2024-04-03 18:52:04.878603+00:00'
 */
export function dbDateToMonthDayYear(date: string) {
	const d = new Date(date);
	// weirdly enough, the month is 0-indexed, but not others
	return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
}

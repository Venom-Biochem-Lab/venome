/**
 * This scrapes the data from the route
 * ie. /protein/1 -> { proteinId: 1 }
 */
export function load({ params }) {
	return { proteinId: params.proteinId };
}

/**
 * This scrapes the data from the route
 * ie. /protein/1 -> { id: 1 }
 */
export function load({ params }) {
	return { id: params.id };
}

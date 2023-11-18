/**
 * This scrapes the data from the route
 * ie. /protein/your_mom -> { proteinName: "your_mom" }
 */
export function load({ params }) {
	return { proteinName: params.proteinName };
}

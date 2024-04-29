<script lang="ts">
	import * as d3 from "d3";

	// query, 0 to ogLength
	export let ogLength: number;
	// alignment within query
	export let qstart: number;
	export let qend: number;
	export let width: number;
	export let height: number;

	const alnToWidthScaler = d3
		.scaleLinear()
		.domain([1, ogLength])
		.range([0, width]);
</script>

<svg {width} {height} id="aln" style="overflow: visible;">
	<rect {width} {height} fill="var(--primary-100)" />
	<line
		x1={alnToWidthScaler(qstart)}
		y1={height / 2}
		x2={alnToWidthScaler(qend)}
		y2={height / 2}
		stroke-width={height}
		stroke="var(--primary-700)"
	/>
	<text
		x={alnToWidthScaler(qend) + 3}
		y={height / 2 + 3}
		style="font-size: 10px;"
		text-anchor="start"
		fill="var(--primary-700)">{qend}</text
	>
	<text
		x={alnToWidthScaler(qstart) - 3}
		y={height / 2 + 3}
		style="font-size: 10px;"
		text-anchor="end"
		fill="var(--primary-700)">{qstart}</text
	>
</svg>

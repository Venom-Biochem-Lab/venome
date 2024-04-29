<script lang="ts">
	export let maxColor: string;
	export let normalizedValue: number;
	export let diameter: number;
	const radius = diameter / 2;
</script>

<div>
	<svg width={diameter} height={diameter}>
		<circle
			cx={radius}
			cy={radius}
			r={radius}
			opacity={normalizedValue}
			fill={maxColor}
		/>
	</svg>
</div>

<style>
	circle {
		transition: opacity ease-in-out 400ms;
	}
</style>

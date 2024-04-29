import { BACKEND_URL } from "./backend";
import { PDBeMolstarPlugin } from "../../venome-molstar/lib";
import type { InitParams } from "../../venome-molstar/lib/spec";
import type { QueryParam } from "../../venome-molstar/lib/helpers";
import * as d3 from "d3";

export type ResidueColor = { r: number; g: number; b: number };
export type ChainId = string;
export type ChainColors = { [chainId: ChainId]: ResidueColor[] };
export type ChainpLDDT = { [chainId: ChainId]: number[] };

export async function screenshotMolstar(initParams: Partial<InitParams>) {
	const { div, molstar } = await renderHeadless(initParams);
	const imgData = await getPreview(molstar);

	// cleanup
	loseWebGLContext(div.querySelector("canvas")!);
	molstar.plugin.dispose();
	div.remove();

	return imgData;
}

export function loseWebGLContext(canvas: HTMLCanvasElement) {
	const gl = canvas.getContext("webgl");
	if (gl) {
		const loseContext = gl.getExtension("WEBGL_lose_context");
		if (loseContext) {
			loseContext.loseContext();
		}
	}
}

async function getPreview(m: PDBeMolstarPlugin, checkDelayMs = 25) {
	const blankPreview =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAYAAADNkKWqAAAAAXNSR0IArs4c6QAACUJJREFUeF7t1AENADAMAsHNv2iWzMZfHXA03G07jgABAkGBawCDrYtMgMAXMIAegQCBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AgAH0AwQIZAUMYLZ6wQkQMIB+gACBrIABzFYvOAECBtAPECCQFTCA2eoFJ0DAAPoBAgSyAgYwW73gBAgYQD9AgEBWwABmqxecAAED6AcIEMgKGMBs9YITIGAA/QABAlkBA5itXnACBAygHyBAICtgALPVC06AwAM7Tfx9MOLD/gAAAABJRU5ErkJggg==";
	while (true) {
		const imgData = m.plugin.helpers.viewportScreenshot
			?.getPreview()!
			.canvas.toDataURL()!;
		if (imgData !== blankPreview) {
			return imgData;
		}
		await delay(checkDelayMs);
	}
}

async function renderHeadless(initParams: Partial<InitParams>) {
	const molstar = new PDBeMolstarPlugin();
	const div = document.createElement("div");
	await molstar.render(div, initParams);
	return { div, molstar };
}

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const defaultInitParams = (name: string): Partial<InitParams> => ({
	customData: {
		url: `${BACKEND_URL}/protein/pdb/${name}`,
		format: "pdb",
		binary: false,
	},
	subscribeEvents: false,
	bgColor: {
		r: 255,
		g: 255,
		b: 255,
	},
	selectInteraction: false,
	alphafoldView: true,
	reactive: false,
	sequencePanel: false,
	hideControls: true,
	hideCanvasControls: [
		"animation",
		"expand",
		"selection",
		"controlToggle",
		"controlInfo",
	],
});

export function colorResidues({
	colors = [],
	entity_id = undefined,
	struct_asym_id = "A",
}: {
	colors?: { r: number; g: number; b: number }[];
	entity_id?: string;
	struct_asym_id?: string;
} = {}): QueryParam[] {
	let selections: QueryParam[] = [];
	for (let i = 0; i < colors.length; i++) {
		const color = colors[i];
		const residueIndex = i + 1;
		const residueColoring = {
			entity_id,
			struct_asym_id,
			color,
			start_residue_number: residueIndex,
			end_residue_number: residueIndex,
		};
		selections.push(residueColoring);
	}
	return selections;
}

export const alphafoldThresholds = ["> 90", "> 70", "> 50", "< 50"];
export const alphafoldColorscheme = [
	"rgb(1,83,214)", // > 90
	"rgb(100,203,243)", // > 70
	"rgb(255,219,18)", // > 50
	"rgb(255,125,69)", // < 50
];
export function pLDDTToAlphaFoldResidueColors(pLDDT: number[]): ResidueColor[] {
	const colors = pLDDT.map((d) => {
		if (d > 90) {
			return alphafoldColorscheme[0];
		} else if (d > 70) {
			return alphafoldColorscheme[1];
		} else if (d > 50) {
			return alphafoldColorscheme[2];
		} else {
			return alphafoldColorscheme[3];
		}
	});
	return colors.map((c) => {
		const rgb = d3.color(c)!.rgb()!;
		return { r: rgb.r, g: rgb.g, b: rgb.b };
	});
}

export function pLDDTToResidueColors(pLDDT: number[]): ResidueColor[] {
	const interpolate = d3.interpolateSpectral;
	const colors = pLDDT.map((d) => interpolate(d / 100));
	return colors.map((c) => {
		const rgb = d3.color(c)!.rgb()!;
		return { r: rgb.r, g: rgb.g, b: rgb.b };
	});
}

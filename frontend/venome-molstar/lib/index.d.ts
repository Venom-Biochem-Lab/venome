import { Canvas3DProps } from "molstar/lib/mol-canvas3d/canvas3d";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { Color } from "molstar/lib/mol-util/color/color";
import { LoadParams, QueryParam } from "./helpers";
import { ColorParams, InitParams } from "./spec";
import "molstar/lib/mol-plugin-ui/skin/dark.scss";
import "./overlay.scss";
export declare class PDBeMolstarPlugin {
    private _ev;
    readonly events: {
        loadComplete: import("rxjs").Subject<boolean>;
    };
    plugin: PluginContext;
    initParams: InitParams;
    targetElement: HTMLElement;
    assemblyRef: string;
    selectedParams: any;
    defaultRendererProps: Canvas3DProps["renderer"];
    defaultMarkingProps: Canvas3DProps["marking"];
    isHighlightColorUpdated: boolean;
    isSelectedColorUpdated: boolean;
    /** Extract InitParams from attributes of an HTML element */
    static initParamsFromHtmlAttributes(element: HTMLElement): Partial<InitParams>;
    render(target: string | HTMLElement, options: Partial<InitParams>): Promise<void>;
    getMoleculeSrcUrl(): {
        url: string;
        format: string;
        isBinary: boolean;
    };
    screenshotData(): Promise<string> | undefined;
    get state(): import("molstar/lib/mol-state/state").State;
    createLigandStructure(isBranched: boolean): Promise<void>;
    load({ url, format, isBinary, assemblyId, progressMessage, }: LoadParams, fullLoad?: boolean): Promise<void>;
    applyVisualParams: () => void;
    canvas: {
        toggleControls: (isVisible?: boolean) => void;
        toggleExpanded: (isExpanded?: boolean) => void;
        setBgColor: (color?: {
            r: number;
            g: number;
            b: number;
        }) => Promise<void>;
        applySettings: (settings?: {
            color?: {
                r: number;
                g: number;
                b: number;
            };
            lighting?: string;
        }) => Promise<void>;
    };
    getLociForParams(params: QueryParam[], structureNumber?: number): import("molstar/lib/mol-model/structure/structure/element/loci").Loci | {
        kind: "empty-loci";
    };
    getLociByPLDDT(score: number, structureNumber?: number): import("molstar/lib/mol-model/structure/structure/element/loci").Loci | {
        kind: "empty-loci";
    };
    normalizeColor(colorVal: any, defaultColor?: Color): Color;
    visual: {
        highlight: (params: {
            data: QueryParam[];
            color?: any;
            focus?: boolean;
            structureNumber?: number;
        }) => void;
        clearHighlight: () => Promise<void>;
        select: (params: {
            data: QueryParam[];
            nonSelectedColor?: any;
            addedRepr?: boolean;
            structureNumber?: number;
        }) => Promise<void>;
        clearSelection: (structureNumber?: number) => Promise<void>;
        update: (options: Partial<InitParams>, fullLoad?: boolean) => Promise<false | undefined>;
        visibility: (data: {
            [key: string]: any;
            polymer?: boolean | undefined;
            het?: boolean | undefined;
            water?: boolean | undefined;
            carbs?: boolean | undefined;
            nonStandard?: boolean | undefined;
            maps?: boolean | undefined;
        }) => Promise<void>;
        toggleSpin: (isSpinning?: boolean, resetCamera?: boolean) => Promise<void>;
        focus: (params: QueryParam[], structureNumber?: number) => Promise<void>;
        setColor: (param: {
            highlight?: ColorParams;
            select?: ColorParams;
        }) => Promise<void>;
        reset: (params: {
            camera?: boolean;
            theme?: boolean;
            highlightColor?: boolean;
            selectColor?: boolean;
        }) => Promise<void>;
    };
    clear(): Promise<void>;
}

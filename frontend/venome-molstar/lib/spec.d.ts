import { Loci } from "molstar/lib/mol-model/loci";
import { PluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import { DefaultFocusLociBindings } from "molstar/lib/mol-plugin/behavior/dynamic/camera";
import { DefaultSelectLociBindings } from "molstar/lib/mol-plugin/behavior/dynamic/representation";
import { PluginSpec } from "molstar/lib/mol-plugin/spec";
import { LigandQueryParam, MapParams, QueryParam } from "./helpers";
export declare const DefaultPluginSpec: () => PluginSpec;
export declare const DefaultPluginUISpec: () => PluginUISpec;
/** RGB color (r, g, b values 0-255) */
export interface ColorParams {
    r: number;
    g: number;
    b: number;
}
export declare const Preset: readonly ["default", "unitcell", "all-models", "supercell"];
export type Preset = (typeof Preset)[number];
export declare const Lighting: readonly ["flat", "matte", "glossy", "metallic", "plastic"];
export type Lighting = (typeof Lighting)[number];
export declare const VisualStyle: readonly ["cartoon", "ball-and-stick", "carbohydrate", "ellipsoid", "gaussian-surface", "molecular-surface", "point", "putty", "spacefill"];
export type VisualStyle = (typeof VisualStyle)[number];
export declare const Encoding: readonly ["cif", "bcif"];
export type Encoding = (typeof Encoding)[number];
/** Options for initializing `PDBeMolstarPlugin` */
export interface InitParams {
    /** PDB ID (example: '1cbs'), or UniProt ID if `superposition` is `true`. Leave `undefined` only when setting `customData` */
    moleculeId?: string;
    /** Load data from a specific data source.
     * Example: `{ url: 'https://www.ebi.ac.uk/pdbe/model-server/v1/1cbs/atoms?label_entity_id=1&auth_asym_id=A&encoding=bcif', format: 'cif', binary: true }` */
    customData?: {
        url: string;
        format: string;
        binary: boolean;
    };
    /** Leave `undefined` to load deposited model structure. Use assembly identifier to load assembly structure. or 'preferred' to load default assembly (i.e. the first assembly). */
    assemblyId?: string;
    /** Specify type of structure to be loaded */
    defaultPreset: Preset;
    /** Use to display the PDBe ligand page 3D view like here (https://www.ebi.ac.uk/pdbe/entry/pdb/1cbs/bound/REA).
     * Example: `{ label_comp_id: 'REA' }`. At least one is required of `label_comp_id` and `auth_seq_id` */
    ligandView?: LigandQueryParam;
    /** This applies AlphaFold confidence score colouring theme for AlphaFold model */
    alphafoldView: boolean;
    /** Display the superposed structures view like the one on the PDBe-KB pages. */
    superposition: boolean;
    /** Customize the superposed structures view. Example: `{ matrixAccession: 'P08684', segment: 1, ligandView: true, ligandColor: { r: 255, g: 255, b: 50} }`. */
    superpositionParams?: {
        matrixAccession?: string;
        segment?: number;
        cluster?: number[];
        superposeCompleteCluster?: boolean;
        ligandView?: boolean;
        superposeAll?: boolean;
        ligandColor?: ColorParams;
    };
    /** Specify parts of the structure to highlight with different colors */
    selection?: {
        data: QueryParam[];
        nonSelectedColor?: ColorParams;
        clearPrevious?: boolean;
    };
    /** Leave `undefined` to keep both cartoon and ball-and-sticks based on component type */
    visualStyle?: VisualStyle;
    /** Molstar renders multiple visuals (polymer, ligand, water...) visuals by default. This option is to exclude any of these default visuals */
    hideStructure: ("polymer" | "het" | "water" | "carbs" | "nonStandard" | "coarse")[];
    /** Load electron density (or EM) maps from Volume Server if value is set to true */
    loadMaps: boolean;
    /** Customize map style (opacity and solid/wireframe) */
    mapSettings?: MapParams;
    /** Canvas background color */
    bgColor: ColorParams;
    /** Color appearing on mouse-over */
    highlightColor?: ColorParams;
    /** Color for marking the selected part of structure (when Selection Mode is active) */
    selectColor?: ColorParams;
    /** Default lighting (I don't think it really works) */
    lighting?: Lighting;
    /** Load Validation Report Annotations. Adds 'Annotations' control in the menu */
    validationAnnotation: boolean;
    /** Load Domain Annotations. Adds 'Annotations' control in the menu */
    domainAnnotation: boolean;
    /** Load Assembly Symmetry Annotations. Adds 'Annotations' control in the menu */
    symmetryAnnotation: boolean;
    /** This option is to set the default base URL for the data source. Mostly used internally to test the plugin on different environments */
    pdbeUrl: string;
    /** Preferred encoding of input structural data */
    encoding: Encoding;
    /** Load low precision coordinates from Model Server */
    lowPrecisionCoords: boolean;
    /** Controls the action performed when clicking a residue. `true` (default) will zoom the residue
     * and show ball-and-stick visual for its surroundings, `false` will only zoom the residue.
     * If `ligandView` or `superposition` option is set, `selectInteraction` behaves as if `false`. */
    selectInteraction: boolean;
    /** Override mouse selection behavior */
    selectBindings?: typeof DefaultSelectLociBindings;
    /** Override mouse click focus behaviour */
    focusBindings?: typeof DefaultFocusLociBindings;
    /** Structure granularity level for interactions like highlight, focus, select.
     * (Granularity levels ending with `Instances` treat multiple copies of the same element/residue/chain in an assembly as one object). */
    granularity?: Loci.Granularity;
    /** Subscribe to other PDB Web-components custom events */
    subscribeEvents: boolean;
    /** Hide all control panels by default (can be shown by the Toggle Controls Panel button (wrench icon)) */
    hideControls: boolean;
    /** Hide individual icon buttons in the top-right corner of the canvas */
    hideCanvasControls: ("expand" | "selection" | "animation" | "controlToggle" | "controlInfo")[];
    /** Display Sequence panel */
    sequencePanel: boolean;
    /** Display PDBe entry link in top right corner of the canvas */
    pdbeLink: boolean;
    /** Show overlay with PDBe logo while the initial structure is being loaded */
    loadingOverlay: boolean;
    /** Display full-screen by default on load */
    expanded: boolean;
    /** Set landscape layout (control panels on the sides instead of above and under the canvas) */
    landscape: boolean;
    /** Set reactive layout (switching between landscape and portrait based on the browser window size). Overrides `landscape`. */
    reactive: boolean;
}
/** Default values for `InitParams` */
export declare const DefaultParams: InitParams;
/** Return `undefined` if `params` are valid, an error message otherwise. */
export declare function validateInitParams(params: Partial<InitParams>): string | undefined;

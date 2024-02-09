import { StateActions } from "molstar/lib/mol-plugin-state/actions";
import { VolumeStreamingCustomControls } from "molstar/lib/mol-plugin-ui/custom/volume";
import { PluginBehaviors } from "molstar/lib/mol-plugin/behavior";
import { CreateVolumeStreamingBehavior } from "molstar/lib/mol-plugin/behavior/dynamic/volume-streaming/transformers";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PDBeLociLabelProvider } from "./labels";
import { PDBeSIFTSMapping } from "./sifts-mappings-behaviour";
export const DefaultPluginSpec = () => ({
    actions: [
        PluginSpec.Action(StateActions.Structure.EnableStructureCustomProps),
    ],
    behaviors: [
        PluginSpec.Behavior(PluginBehaviors.Representation.HighlightLoci),
        PluginSpec.Behavior(PluginBehaviors.Representation.SelectLoci),
        PluginSpec.Behavior(PDBeLociLabelProvider),
        PluginSpec.Behavior(PluginBehaviors.Representation.FocusLoci),
        PluginSpec.Behavior(PluginBehaviors.Camera.FocusLoci),
        PluginSpec.Behavior(PluginBehaviors.Camera.CameraAxisHelper),
        PluginSpec.Behavior(PluginBehaviors.CustomProps.StructureInfo),
        PluginSpec.Behavior(PluginBehaviors.CustomProps.AccessibleSurfaceArea),
        PluginSpec.Behavior(PDBeSIFTSMapping, {
            autoAttach: true,
            showTooltip: true,
        }),
        PluginSpec.Behavior(PluginBehaviors.CustomProps.Interactions),
        PluginSpec.Behavior(PluginBehaviors.CustomProps.SecondaryStructure),
        PluginSpec.Behavior(PluginBehaviors.CustomProps.ValenceModel),
        PluginSpec.Behavior(PluginBehaviors.CustomProps.CrossLinkRestraint),
    ],
    // animations: [],
    config: [
        [
            PluginConfig.VolumeStreaming.DefaultServer,
            "https://www.ebi.ac.uk/pdbe/volume-server",
        ],
        [
            PluginConfig.VolumeStreaming.EmdbHeaderServer,
            "https://files.wwpdb.org/pub/emdb/structures",
        ],
    ],
});
export const DefaultPluginUISpec = () => ({
    ...DefaultPluginSpec(),
    customParamEditors: [
        [CreateVolumeStreamingBehavior, VolumeStreamingCustomControls],
    ],
});
export const Preset = [
    "default",
    "unitcell",
    "all-models",
    "supercell",
];
export const Lighting = [
    "flat",
    "matte",
    "glossy",
    "metallic",
    "plastic",
];
export const VisualStyle = [
    "cartoon",
    "ball-and-stick",
    "carbohydrate",
    "ellipsoid",
    "gaussian-surface",
    "molecular-surface",
    "point",
    "putty",
    "spacefill",
];
export const Encoding = ["cif", "bcif"];
/** Default values for `InitParams` */
export const DefaultParams = {
    moleculeId: undefined,
    customData: undefined,
    assemblyId: undefined,
    defaultPreset: "default",
    ligandView: undefined,
    alphafoldView: false,
    superposition: false,
    superpositionParams: undefined,
    selection: undefined,
    visualStyle: undefined,
    hideStructure: [],
    loadMaps: false,
    mapSettings: undefined,
    bgColor: { r: 0, g: 0, b: 0 },
    highlightColor: undefined,
    selectColor: undefined,
    lighting: undefined,
    validationAnnotation: false,
    domainAnnotation: false,
    symmetryAnnotation: false,
    pdbeUrl: "https://www.ebi.ac.uk/pdbe/",
    encoding: "bcif",
    lowPrecisionCoords: false,
    selectInteraction: true,
    selectBindings: undefined,
    focusBindings: undefined,
    granularity: undefined,
    subscribeEvents: false,
    hideControls: false,
    hideCanvasControls: [],
    sequencePanel: false,
    pdbeLink: true,
    loadingOverlay: false,
    expanded: false,
    landscape: false,
    reactive: false,
};
/** Return `undefined` if `params` are valid, an error message otherwise. */
export function validateInitParams(params) {
    if (!params.moleculeId && !params.customData?.url)
        return "Option `moleculeId` or `customData` must be defined";
    if (params.customData) {
        if (!params.customData.url)
            return "Option `customData.url` must be a non-empty string";
        if (!params.customData.format)
            return "Option `customData.format` must be a non-empty string";
    }
    return undefined;
}

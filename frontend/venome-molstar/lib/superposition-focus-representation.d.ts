import { PluginBehavior } from "molstar/lib/mol-plugin/behavior";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PluginContext } from "molstar/lib/mol-plugin/context";
declare const SuperpositionFocusRepresentationParams: (plugin: PluginContext) => {
    expandRadius: PD.Numeric;
    surroundingsParams: PD.Group<PD.Normalize<{
        [x: string]: any;
    }>>;
};
type SuperpositionFocusRepresentationProps = PD.ValuesFor<ReturnType<typeof SuperpositionFocusRepresentationParams>>;
export declare enum SuperpositionFocusRepresentationTags {
    SurrSel = "superposition-focus-surr-sel",
    SurrRepr = "superposition-focus-surr-repr"
}
export declare const SuperpositionFocusRepresentation: import("molstar/lib/mol-state/transformer").StateTransformer<PluginBehavior.Category, PluginBehavior.Behavior, SuperpositionFocusRepresentationProps>;
export {};

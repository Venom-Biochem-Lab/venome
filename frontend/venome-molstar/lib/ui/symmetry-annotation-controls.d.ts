import { AssemblySymmetryParams, AssemblySymmetryProps } from 'molstar/lib/extensions/rcsb/assembly-symmetry/prop';
import { StructureRef } from 'molstar/lib/mol-plugin-state/manager/structure/hierarchy-state';
import { PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { UUID } from 'molstar/lib/mol-util';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
type SymmetryParams = {
    /** State of the visibility button */
    on: PD.BooleanParam;
    /** Index of the currently selected symmetry (in case there a more symmetries for an assembly), regardless of whether visibility is on of off */
    symmetryIndex: PD.Select<number>;
    /** `true` if symmetry data have been retrieved but do not contain any non-trivial symmetry */
    noSymmetries: PD.BooleanParam;
};
type SymmetryParamValues = PD.ValuesFor<SymmetryParams>;
interface SymmetryControlsState {
    params: SymmetryParams;
    values: SymmetryParamValues;
}
/** UI controls for showing Assembly Symmetry annotations (a row within Annotations section) */
export declare class SymmetryAnnotationControls extends PurePluginUIComponent<{}, SymmetryControlsState> {
    state: SymmetryControlsState;
    currentStructureId: UUID | undefined;
    componentDidMount(): void;
    /** Synchronize parameters and values in UI with real parameters currently applied in `AssemblySymmetryProvider` */
    syncParams(): void;
    /** Return `true` if symmetry data have been retrieved and do not contain any non-trivial symmetry. */
    noSymmetriesAvailable(): boolean;
    /** Get the first loaded structure, if any. */
    getPivotStructure(): StructureRef | undefined;
    /** Get parameters currently applied in `AssemblySymmetryProvider` */
    getRealParams(): AssemblySymmetryParams;
    /** Get parameter values currently applied in `AssemblySymmetryProvider` */
    getRealValues(): AssemblySymmetryProps;
    /** Return `true` if an `AssemblySymmetry3D` node existing in the   */
    hasAssemblySymmetry3D(): boolean;
    /** Run changes needed to set visibility on or off, and set UI accordingly */
    apply(applied: boolean): Promise<void>;
    /** Run changes needed to change parameter values, and set UI accordingly*/
    changeParamValues(values: SymmetryParamValues): Promise<void>;
    /** Try to retrieve symmetry data and create `AssemblySymmetry3D` representation */
    initSymmetry(initialSymmetryIndex?: number): Promise<void>;
    render(): import("react/jsx-runtime").JSX.Element;
}
export declare function isAssemblySymmetryAnnotationApplicable(plugin: PluginContext): boolean;
export {};

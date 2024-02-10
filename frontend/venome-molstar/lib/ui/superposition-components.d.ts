import { CollapsableControls, CollapsableState } from 'molstar/lib/mol-plugin-ui/base';
interface StructureComponentControlState extends CollapsableState {
    isDisabled: boolean;
}
export declare class SuperpositionComponentControls extends CollapsableControls<{}, StructureComponentControlState> {
    protected defaultState(): StructureComponentControlState;
    renderControls(): import("react/jsx-runtime").JSX.Element;
}
export {};

import { Mat4 } from 'molstar/lib/mol-math/linear-algebra';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { StateObjectRef } from 'molstar/lib/mol-state';
import { PluginCustomState } from '../plugin-custom-state';
export declare class SegmentTree extends PurePluginUIComponent<{}, {
    segment?: any;
    isBusy: boolean;
}> {
    componentDidMount(): void;
    get customState(): PluginCustomState;
    getSegmentParams: () => void;
    updateSegment: (val: any) => Promise<false | undefined>;
    hideStructures: (segmentIndex: number) => void;
    displayStructures: (segmentIndex: number) => Promise<void>;
    transform(s: StateObjectRef<PluginStateObject.Molecule.Structure>, matrix: Mat4): Promise<void>;
    render(): import("react/jsx-runtime").JSX.Element;
}

import { CollapsableControls, PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { PluginCustomState } from '../plugin-custom-state';
export declare function InfoIconSvg(): import("react/jsx-runtime").JSX.Element;
export declare class AlphafoldPaeControls extends CollapsableControls {
    private axisBoxRef;
    defaultState(): {
        isCollapsed: boolean;
        header: string;
        brand: {
            accent: "gray";
            svg: typeof import("molstar/lib/mol-plugin-ui/controls/icons").FlipToFrontSvg;
        };
        isHidden: boolean;
    };
    constructor(props: any, context: any);
    componentDidMount(): void;
    formatTicks(d: any): any;
    renderControls(): import("react/jsx-runtime").JSX.Element | null;
}
export declare class AlphafoldSuperpositionControls extends CollapsableControls {
    defaultState(): {
        isCollapsed: boolean;
        header: string;
        brand: {
            accent: "gray";
            svg: typeof import("molstar/lib/mol-plugin-ui/controls/icons").FlipToFrontSvg;
        };
        isHidden: boolean;
    };
    componentDidMount(): void;
    rmsdTable(): import("react/jsx-runtime").JSX.Element;
    renderControls(): import("react/jsx-runtime").JSX.Element;
}
export declare const AlphafoldSuperpositionParams: {
    traceOnly: PD.BooleanParam;
};
export type AlphafoldSuperpositionOptions = PD.ValuesFor<typeof AlphafoldSuperpositionParams>;
type AfSuperpositionControlsState = {
    isBusy: boolean;
    action?: 'byChains' | 'byAtoms' | 'options';
    canUseDb?: boolean;
    options: AlphafoldSuperpositionOptions;
};
export declare class AfSuperpositionControls extends PurePluginUIComponent<{}, AfSuperpositionControlsState> {
    state: AfSuperpositionControlsState;
    componentDidMount(): void;
    get selection(): import("molstar/lib/mol-plugin-state/manager/structure/selection").StructureSelectionManager;
    get customState(): PluginCustomState;
    superposeDb: () => Promise<void>;
    toggleOptions: () => void;
    superposeByDbMapping(): import("react/jsx-runtime").JSX.Element;
    private setOptions;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};

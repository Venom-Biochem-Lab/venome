import { PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
export declare function TextsmsOutlinedSvg(): import("react/jsx-runtime").JSX.Element;
type AnnotationType = 'validation' | 'domains' | 'symmetry';
interface AnnotationsComponentControlsState {
    isCollapsed: boolean;
    validationApplied: boolean;
    validationOptions: boolean;
    validationParams: any;
    domainsApplied: boolean;
    domainsOptions: boolean;
    domainsParams: any;
    showSymmetryAnnotation: boolean;
    description?: string;
}
export declare class AnnotationsComponentControls extends PurePluginUIComponent<{}, AnnotationsComponentControlsState> {
    state: AnnotationsComponentControlsState;
    componentDidMount(): void;
    initOptionParams: () => void;
    getStructure: () => import("molstar/lib/mol-state/object").StateObject<any, import("molstar/lib/mol-state/object").StateObject.Type<any>> | undefined;
    toggleCollapsed: () => void;
    applyAnnotation: (type: 'validation' | 'domains', visibleState: boolean, params?: any) => void;
    toggleAnnotation: (type: AnnotationType) => void;
    updateValidationParams: (val: any) => void;
    updateDomainParams: (val: any) => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};

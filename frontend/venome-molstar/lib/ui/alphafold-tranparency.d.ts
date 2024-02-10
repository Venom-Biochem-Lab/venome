import { CollapsableControls } from 'molstar/lib/mol-plugin-ui/base';
export declare class AlphafoldTransparencyControls extends CollapsableControls<{}, {
    transpareny: any;
}> {
    defaultState(): {
        isCollapsed: boolean;
        header: string;
        brand: {
            accent: "gray";
            svg: typeof import("molstar/lib/mol-plugin-ui/controls/icons").FlipToFrontSvg;
        };
        isHidden: boolean;
        transpareny: {
            score: number;
            opacity: number;
        };
    };
    componentDidMount(): void;
    updateTransparency: (val: any) => Promise<void>;
    renderControls(): import("react/jsx-runtime").JSX.Element;
}

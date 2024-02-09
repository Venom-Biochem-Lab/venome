/// <reference types="react" />
import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
export declare function WavesIconSvg(): import("react/jsx-runtime").JSX.Element;
type LeftPanelTabName = 'none' | 'root' | 'data' | 'states' | 'settings' | 'help' | 'segments';
export declare class LeftPanelControls extends PluginUIComponent<{}, {
    tab: LeftPanelTabName;
}> {
    state: {
        tab: LeftPanelTabName;
    };
    componentDidMount(): void;
    set: (tab: LeftPanelTabName) => void;
    tabs: {
        [K in LeftPanelTabName]: JSX.Element;
    };
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};

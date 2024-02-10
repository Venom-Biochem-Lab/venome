import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
export declare class PDBeStructureTools extends PluginUIComponent {
    render(): import("react/jsx-runtime").JSX.Element;
}
export declare class CustomStructureControls extends PluginUIComponent<{
    initiallyCollapsed?: boolean;
    takeKeys?: string[];
    skipKeys?: string[];
}> {
    componentDidMount(): void;
    render(): import("react/jsx-runtime").JSX.Element | null;
}
export declare class PDBeLigandViewStructureTools extends PluginUIComponent {
    render(): import("react/jsx-runtime").JSX.Element;
}
export declare class PDBeSuperpositionStructureTools extends PluginUIComponent {
    render(): import("react/jsx-runtime").JSX.Element;
}

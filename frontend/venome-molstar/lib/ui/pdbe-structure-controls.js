import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { StructureComponentControls } from 'molstar/lib/mol-plugin-ui/structure/components';
import { StructureMeasurementsControls } from 'molstar/lib/mol-plugin-ui/structure/measurements';
import { StructureSourceControls } from 'molstar/lib/mol-plugin-ui/structure/source';
import { VolumeStreamingControls, VolumeSourceControls } from 'molstar/lib/mol-plugin-ui/structure/volume';
import { AnnotationsComponentControls } from './annotation-controls';
import { Icon, BuildSvg } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { SuperpositionComponentControls } from './superposition-components';
import { StructureQuickStylesControls } from 'molstar/lib/mol-plugin-ui/structure/quick-styles';
import { AlphafoldPaeControls, AlphafoldSuperpositionControls } from './alphafold-superposition';
import { SuperpositionModelExportUI } from './export-superposition';
import { AlphafoldTransparencyControls } from './alphafold-tranparency';
import { AssemblySymmetry } from 'molstar/lib/extensions/rcsb/assembly-symmetry/prop';
export class PDBeStructureTools extends PluginUIComponent {
    render() {
        const AssemblySymmetryKey = AssemblySymmetry.Tag.Representation;
        return _jsxs(_Fragment, { children: [_jsxs("div", { className: 'msp-section-header', children: [_jsx(Icon, { svg: BuildSvg }), "Structure Tools"] }), _jsx(StructureSourceControls, {}), _jsx(AnnotationsComponentControls, {}), _jsx(StructureQuickStylesControls, {}), _jsx(StructureComponentControls, {}), _jsx(VolumeStreamingControls, {}), _jsx(VolumeSourceControls, {}), _jsx(StructureMeasurementsControls, {}), _jsx(CustomStructureControls, { skipKeys: [AssemblySymmetryKey] })] });
    }
}
export class CustomStructureControls extends PluginUIComponent {
    componentDidMount() {
        this.subscribe(this.plugin.state.behaviors.events.changed, () => this.forceUpdate());
    }
    render() {
        const takeKeys = this.props.takeKeys ?? Array.from(this.plugin.customStructureControls.keys());
        const result = [];
        for (const key of takeKeys) {
            if (this.props.skipKeys?.includes(key))
                continue;
            const Controls = this.plugin.customStructureControls.get(key);
            if (!Controls)
                continue;
            result.push(_jsx(Controls, { initiallyCollapsed: this.props.initiallyCollapsed }, key));
        }
        return result.length > 0 ? _jsx(_Fragment, { children: result }) : null;
    }
}
export class PDBeLigandViewStructureTools extends PluginUIComponent {
    render() {
        return _jsxs(_Fragment, { children: [_jsxs("div", { className: 'msp-section-header', children: [_jsx(Icon, { svg: BuildSvg }), "Structure Tools"] }), _jsx(StructureComponentControls, {}), _jsx(VolumeStreamingControls, {}), _jsx(StructureMeasurementsControls, {}), _jsx(CustomStructureControls, {})] });
    }
}
export class PDBeSuperpositionStructureTools extends PluginUIComponent {
    render() {
        return _jsxs(_Fragment, { children: [_jsxs("div", { className: 'msp-section-header', children: [_jsx(Icon, { svg: BuildSvg }), "Structure Tools"] }), _jsx(SuperpositionComponentControls, {}), _jsx(AlphafoldTransparencyControls, {}), _jsx(AlphafoldPaeControls, {}), _jsx(AlphafoldSuperpositionControls, {}), _jsx(StructureMeasurementsControls, {}), _jsx(SuperpositionModelExportUI, {}), _jsx(CustomStructureControls, {})] });
    }
}

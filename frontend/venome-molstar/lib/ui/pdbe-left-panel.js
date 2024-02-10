import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Canvas3DParams } from 'molstar/lib/mol-canvas3d/canvas3d';
import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { IconButton, SectionHeader } from 'molstar/lib/mol-plugin-ui/controls/common';
import { AccountTreeOutlinedSvg, DeleteOutlinedSvg, HelpOutlineSvg, HomeOutlinedSvg, TuneSvg } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { ParameterControls } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import { StateObjectActions } from 'molstar/lib/mol-plugin-ui/state/actions';
import { RemoteStateSnapshots, StateSnapshots } from 'molstar/lib/mol-plugin-ui/state/snapshots';
import { StateTree } from 'molstar/lib/mol-plugin-ui/state/tree';
import { HelpContent, HelpGroup, HelpText } from 'molstar/lib/mol-plugin-ui/viewport/help';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { StateTransform } from 'molstar/lib/mol-state';
import { PluginCustomState } from '../plugin-custom-state';
import { SegmentTree } from './segment-tree';
const _WavesIcon = _jsx("svg", { width: '24px', height: '24px', viewBox: '0 0 24 24', children: _jsx("path", { d: "M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.95c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm0-4.45c-1.35 0-2.2.43-2.95.8-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.32-1.17.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm2.95-8.08c-.75-.38-1.58-.8-2.95-.8s-2.2.42-2.95.8c-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.37-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.93c1.35 0 2.2-.43 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V5.04c-.9 0-1.4-.25-2.05-.58zM17 8.09c-1.35 0-2.2.43-2.95.8-.65.35-1.15.6-2.05.6s-1.4-.25-2.05-.6c-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.35-1.15.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.32 1.18-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V9.49c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8z" }) });
export function WavesIconSvg() { return _WavesIcon; }
export class LeftPanelControls extends PluginUIComponent {
    state = { tab: this.plugin.behaviors.layout.leftPanelTabName.value };
    componentDidMount() {
        this.subscribe(this.plugin.behaviors.layout.leftPanelTabName, tab => {
            if (this.state.tab !== tab)
                this.setState({ tab });
            if (tab === 'none' && this.plugin.layout.state.regionState.left !== 'collapsed') {
                PluginCommands.Layout.Update(this.plugin, { state: { regionState: { ...this.plugin.layout.state.regionState, left: 'collapsed' } } });
            }
        });
        this.subscribe(this.plugin.state.data.events.changed, ({ state }) => {
            if (this.state.tab !== 'data')
                return;
            if (state.cells.size === 1)
                this.set('root');
        });
    }
    set = (tab) => {
        if (this.state.tab === tab) {
            this.setState({ tab: 'none' }, () => this.plugin.behaviors.layout.leftPanelTabName.next('none'));
            PluginCommands.Layout.Update(this.plugin, { state: { regionState: { ...this.plugin.layout.state.regionState, left: 'collapsed' } } });
            return;
        }
        this.setState({ tab }, () => this.plugin.behaviors.layout.leftPanelTabName.next(tab));
        if (this.plugin.layout.state.regionState.left !== 'full') {
            PluginCommands.Layout.Update(this.plugin, { state: { regionState: { ...this.plugin.layout.state.regionState, left: 'full' } } });
        }
    };
    tabs = {
        'none': _jsx(_Fragment, {}),
        'root': _jsxs(_Fragment, { children: [_jsx(SectionHeader, { icon: HomeOutlinedSvg, title: 'Home' }), _jsx(StateObjectActions, { state: this.plugin.state.data, nodeRef: StateTransform.RootRef, hideHeader: true, initiallyCollapsed: true, alwaysExpandFirst: true }), this.plugin.spec.components?.remoteState !== 'none' && _jsx(RemoteStateSnapshots, { listOnly: true })] }),
        'data': _jsxs(_Fragment, { children: [_jsx(SectionHeader, { icon: AccountTreeOutlinedSvg, title: _jsxs(_Fragment, { children: [_jsx(RemoveAllButton, {}), " State Tree"] }) }), _jsx(StateTree, { state: this.plugin.state.data })] }),
        'segments': _jsx(_Fragment, { children: _jsx(SegmentTree, {}) }),
        'states': _jsx(StateSnapshots, {}),
        'settings': _jsxs(_Fragment, { children: [_jsx(SectionHeader, { icon: TuneSvg, title: 'Plugin Settings' }), _jsx(FullSettings, {})] }),
        'help': _jsxs(_Fragment, { children: [_jsx(SectionHeader, { icon: HelpOutlineSvg, title: 'Help' }), _jsx(HelpContent, {}), _jsx(SuperpositionHelpContent, {})] })
    };
    render() {
        const tab = this.state.tab;
        const customState = PluginCustomState(this.plugin);
        return _jsxs("div", { className: 'msp-left-panel-controls', children: [_jsxs("div", { className: 'msp-left-panel-controls-buttons', children: [_jsx(IconButton, { svg: HelpOutlineSvg, toggleState: tab === 'help', transparent: true, onClick: () => this.set('help'), title: 'Help' }), customState && customState.initParams && customState.initParams.superposition && _jsx(IconButton, { svg: WavesIconSvg, toggleState: tab === 'segments', transparent: true, onClick: () => this.set('segments'), title: 'Superpose segments' }), _jsx("div", { className: 'msp-left-panel-controls-buttons-bottom', children: _jsx(IconButton, { svg: TuneSvg, toggleState: tab === 'settings', transparent: true, onClick: () => this.set('settings'), title: 'Settings' }) })] }), _jsx("div", { className: 'msp-scrollable-container', children: this.tabs[tab] })] });
    }
}
// class DataIcon extends PluginUIComponent<{ set: (tab: LeftPanelTabName) => void }, { changed: boolean }> {
//     state = { changed: false };
//     get tab() {
//         return this.plugin.behaviors.layout.leftPanelTabName.value;
//     }
//     componentDidMount() {
//         this.subscribe(this.plugin.behaviors.layout.leftPanelTabName, tab => {
//             if (this.tab === 'data') this.setState({ changed: false });
//             else this.forceUpdate();
//         });
//         this.subscribe(this.plugin.state.data.events.changed, state => {
//             if (this.tab !== 'data') this.setState({ changed: true });
//         });
//     }
//     render() {
//         return <IconButton
//             svg={AccountTreeOutlinedSvg} toggleState={this.tab === 'data'} transparent onClick={() => this.props.set('data')} title='State Tree'
//             style={{ position: 'relative' }} extraContent={this.state.changed ? <div className='msp-left-panel-controls-button-data-dirty' /> : void 0} />;
//     }
// }
class FullSettings extends PluginUIComponent {
    setSettings = (p) => {
        PluginCommands.Canvas3D.SetSettings(this.plugin, { settings: { [p.name]: p.value } });
    };
    componentDidMount() {
        this.subscribe(this.plugin.events.canvas3d.settingsUpdated, () => this.forceUpdate());
        this.subscribe(this.plugin.layout.events.updated, () => this.forceUpdate());
        this.subscribe(this.plugin.canvas3d.camera.stateChanged, state => {
            if (state.radiusMax !== undefined || state.radius !== undefined) {
                this.forceUpdate();
            }
        });
    }
    render() {
        return _jsx(_Fragment, { children: this.plugin.canvas3d && _jsxs(_Fragment, { children: [_jsx(SectionHeader, { title: 'Viewport' }), _jsx(ParameterControls, { params: Canvas3DParams, values: this.plugin.canvas3d.props, onChange: this.setSettings })] }) });
    }
}
class RemoveAllButton extends PluginUIComponent {
    componentDidMount() {
        this.subscribe(this.plugin.state.events.cell.created, e => {
            if (e.cell.transform.parent === StateTransform.RootRef)
                this.forceUpdate();
        });
        this.subscribe(this.plugin.state.events.cell.removed, e => {
            if (e.parent === StateTransform.RootRef)
                this.forceUpdate();
        });
    }
    remove = (e) => {
        e.preventDefault();
        PluginCommands.State.RemoveObject(this.plugin, { state: this.plugin.state.data, ref: StateTransform.RootRef });
    };
    render() {
        const count = this.plugin.state.data.tree.children.get(StateTransform.RootRef).size;
        if (count === 0)
            return null;
        return _jsx(IconButton, { svg: DeleteOutlinedSvg, onClick: this.remove, title: 'Remove All', style: { display: 'inline-block' }, small: true, className: 'msp-no-hover-outline', transparent: true });
    }
}
function HelpSection(props) {
    return _jsx("div", { className: 'msp-simple-help-section', children: props.header });
}
class SuperpositionHelpContent extends PluginUIComponent {
    componentDidMount() {
        this.subscribe(this.plugin.events.canvas3d.settingsUpdated, () => this.forceUpdate());
    }
    render() {
        return _jsxs("div", { children: [_jsx(HelpSection, { header: 'Superposition' }), _jsx(HelpGroup, { header: 'Segment', children: _jsx(HelpText, { children: _jsx("p", { children: "Discrete UniProt sequence range mapped to the structure" }) }) }), _jsx(HelpGroup, { header: 'Cluster', children: _jsx(HelpText, { children: _jsx("p", { children: "Structural chains that possess significantly close superposition Q-score" }) }) }), _jsx(HelpGroup, { header: 'Representative chain', children: _jsx(HelpText, { children: _jsx("p", { children: "The best-ranked chain within a cluster chosen based on the model quality, resolution, observed residues ratio and UniProt sequence coverage" }) }) })] });
    }
}

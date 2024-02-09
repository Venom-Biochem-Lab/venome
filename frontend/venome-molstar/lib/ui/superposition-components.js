import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { State } from 'molstar/lib/mol-state';
import { ParamDefinition } from 'molstar/lib/mol-util/param-definition';
import { CollapsableControls, PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { Button, IconButton } from 'molstar/lib/mol-plugin-ui/controls/common';
import { CubeOutlineSvg, VisibilityOffOutlinedSvg, VisibilityOutlinedSvg, MoreHorizSvg, CheckSvg, CloseSvg } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { ParameterControls } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PluginCustomState } from '../plugin-custom-state';
export class SuperpositionComponentControls extends CollapsableControls {
    defaultState() {
        return {
            header: 'Components',
            isCollapsed: false,
            isDisabled: false,
            brand: { accent: 'blue', svg: CubeOutlineSvg }
        };
    }
    renderControls() {
        return _jsx(_Fragment, { children: _jsx(ComponentListControls, {}) });
    }
}
;
class ComponentListControls extends PurePluginUIComponent {
    state = {
        segmentWatch: false,
        ligSearchText: '',
        carbSearchText: '',
        componentGroups: { nonLigGroups: [], ligGroups: [], carbGroups: [], alphafold: [] },
        ligGroups: [],
        isLigCollapsed: false,
        carbGroups: [],
        isCarbCollapsed: false,
        isBusy: false
    };
    ligInputStream = new Subject();
    handleLigInputStream = (inputStr) => {
        this.setState({ ligSearchText: inputStr });
        const filteredRes = this.state.componentGroups.ligGroups.filter((g) => {
            const gKeys = g[0].key.split(',');
            const cId1Arr = gKeys[0].split('-');
            return cId1Arr[2].toLowerCase().indexOf(inputStr.toLowerCase()) >= 0;
        });
        this.setState({ ligGroups: filteredRes });
    };
    carbInputStream = new Subject();
    handleCarbInputStream = (inputStr) => {
        this.setState({ carbSearchText: inputStr });
        const filteredRes = this.state.componentGroups.carbGroups.filter((g) => {
            const gKeys = g[0].key.split(',');
            const cId1Arr = gKeys[0].split('-');
            cId1Arr.splice(0, 2);
            cId1Arr.pop();
            return cId1Arr.join('-').toLowerCase().indexOf(inputStr.toLowerCase()) >= 0;
        });
        this.setState({ carbGroups: filteredRes });
    };
    componentDidMount() {
        this.subscribe(this.plugin.managers.structure.hierarchy.behaviors.selection, () => {
            this.categoriseGroups();
            this.forceUpdate();
        });
        this.subscribe(this.plugin.behaviors.state.isBusy, v => {
            this.setState({ isBusy: v });
        });
    }
    componentDidUpdate() {
        const customState = PluginCustomState(this.plugin);
        if (customState.events && !this.state.segmentWatch) {
            this.setState({ segmentWatch: true });
            this.subscribe(customState.events.segmentUpdate, () => {
                this.categoriseGroups();
                this.forceUpdate();
            });
        }
        this.subscribe(this.ligInputStream.pipe(debounceTime(1000 / 24)), e => this.handleLigInputStream(e));
        this.subscribe(this.carbInputStream.pipe(debounceTime(1000 / 24)), e => this.handleCarbInputStream(e));
    }
    categoriseGroups() {
        const componentGroupsVal = { nonLigGroups: [], ligGroups: [], carbGroups: [], alphafold: [] };
        const componentGroups = this.plugin.managers.structure.hierarchy.currentComponentGroups;
        const customState = PluginCustomState(this.plugin);
        componentGroups.forEach((g) => {
            const superpositionState = customState.superpositionState;
            if (!superpositionState)
                throw new Error('customState.superpositionState has not been initialized');
            let isLigandView = false;
            if (customState.initParams && customState.initParams.superpositionParams && customState.initParams.superpositionParams.ligandView) {
                isLigandView = true;
            }
            if (isLigandView) {
                const gKeys = g[0].key.split(',');
                const cId1Arr = gKeys[0].split('-');
                if (gKeys.indexOf('superposition-focus-surr-sel') === -1) {
                    if (cId1Arr[cId1Arr.length - 1] !== (superpositionState.activeSegment - 1) + '')
                        return;
                    if (gKeys.indexOf('superposition-ligand-sel') >= 0) {
                        componentGroupsVal.ligGroups.push(g);
                    }
                    else if (gKeys.indexOf('superposition-carb-sel') >= 0) {
                        componentGroupsVal.carbGroups.push(g);
                    }
                    else if (gKeys.indexOf('alphafold-chain') >= 0) {
                        componentGroupsVal.alphafold.push(g);
                    }
                    else {
                        componentGroupsVal.nonLigGroups.push(g);
                    }
                }
                else {
                    componentGroupsVal.nonLigGroups.push(g);
                }
            }
            else {
                const gKeys = g[0].key.split(',');
                if (gKeys.indexOf('superposition-focus-surr-sel') >= 0 || gKeys.indexOf(`Chain-${superpositionState.activeSegment - 1}`) >= 0) {
                    componentGroupsVal.nonLigGroups.push(g);
                }
                else if (gKeys.indexOf('alphafold-chain') >= 0) {
                    componentGroupsVal.alphafold.push(g);
                }
            }
        });
        this.setState({ componentGroups: componentGroupsVal, ligGroups: componentGroupsVal.ligGroups, carbGroups: componentGroupsVal.carbGroups, ligSearchText: '', carbSearchText: '' });
    }
    toggleVisible = (e, action, type) => {
        e.preventDefault();
        e.currentTarget.blur();
        const customState = PluginCustomState(this.plugin);
        customState.events?.isBusy.next(true);
        const visualEntites = (type === 'ligands') ? this.state.ligGroups : this.state.carbGroups;
        setTimeout(async () => {
            for await (const visualEntity of visualEntites) {
                this.plugin.managers.structure.hierarchy.toggleVisibility(visualEntity, action);
            }
            ;
            customState.events?.isBusy.next(false);
        });
    };
    showHideAllControls = (type) => {
        return _jsxs(_Fragment, { children: [_jsx(Button, { icon: CheckSvg, flex: true, onClick: (e) => this.toggleVisible(e, 'show', type), style: { flex: '0 0 50px', textAlign: 'center', fontSize: '80%', color: '#9cacc3', padding: 0 }, title: `Show all ${type}`, disabled: false, children: "All" }), _jsx(Button, { icon: CloseSvg, flex: true, onClick: (e) => this.toggleVisible(e, 'hide', type), style: { flex: '0 0 50px', textAlign: 'center', fontSize: '80%', color: '#9cacc3', padding: 0 }, title: `Hide all ${type}`, disabled: false, children: "None" })] });
    };
    clearLigSearch = (e) => {
        e.preventDefault();
        this.setState({ ligSearchText: '' });
        this.ligInputStream.next('');
        e.currentTarget.blur();
    };
    clearCarbSearch = (e) => {
        e.preventDefault();
        this.setState({ carbSearchText: '' });
        this.carbInputStream.next('');
        e.currentTarget.blur();
    };
    collapseSection = (e, type) => {
        e.preventDefault();
        e.currentTarget.blur();
        if (type === 'ligands') {
            this.setState({ isLigCollapsed: !this.state.isLigCollapsed });
        }
        else {
            this.setState({ isCarbCollapsed: !this.state.isCarbCollapsed });
        }
    };
    sectionHeader = (type) => {
        const showHideAllControls = (type === 'ligands') ? this.showHideAllControls('ligands') : this.showHideAllControls('carbohydrates');
        const title = (type === 'ligands') ? 'Ligand' : 'Carbohydrates';
        const visibleVisuals = (type === 'ligands') ? this.state.ligGroups.length : this.state.carbGroups.length;
        const totalVisuals = (type === 'ligands') ? this.state.componentGroups.ligGroups.length : this.state.componentGroups.carbGroups.length;
        return _jsxs("div", { className: 'msp-flex-row', style: { marginTop: '6px' }, children: [_jsxs("button", { className: 'msp-form-control msp-control-button-label msp-transform-header-brand-gray', style: { textAlign: 'left' }, onClick: (e) => this.collapseSection(e, type), children: [_jsx("span", { children: _jsx("strong", { children: title }) }), _jsxs("small", { style: { color: '#7d91b0' }, children: [" ( ", visibleVisuals, visibleVisuals < totalVisuals ? ` / ${totalVisuals}` : '', " )"] })] }), visibleVisuals > 1 && showHideAllControls] });
    };
    render() {
        const ligSearchControls = _jsxs("div", { className: 'msp-mapped-parameter-group', style: { fontSize: '90%' }, children: [_jsxs("div", { className: 'msp-control-row msp-transform-header-brand-gray', style: { height: '33px' }, children: [_jsx("span", { className: 'msp-control-row-label', children: "Search Ligand" }), _jsx("div", { className: 'msp-control-row-ctrl', children: _jsx("input", { type: 'text', placeholder: 'Enter HET code', disabled: this.state.isBusy, onChange: e => this.ligInputStream.next(e.target.value), value: this.state.ligSearchText, maxLength: 3 }) })] }), _jsx(IconButton, { svg: CloseSvg, flex: true, onClick: this.clearLigSearch, style: { flex: '0 0 24px', padding: 0 }, disabled: this.state.ligSearchText === '' || this.state.isBusy, toggleState: this.state.ligSearchText !== '', title: 'Clear search input' })] });
        const carbSearchControls = _jsxs("div", { className: 'msp-mapped-parameter-group', style: { fontSize: '90%' }, children: [_jsxs("div", { className: 'msp-control-row msp-transform-header-brand-gray', style: { height: '33px' }, children: [_jsx("span", { className: 'msp-control-row-label', children: "Search Carbohydrate" }), _jsx("div", { className: 'msp-control-row-ctrl', children: _jsx("input", { type: 'text', placeholder: 'Enter HET code', disabled: this.state.isBusy, onChange: e => this.carbInputStream.next(e.target.value), value: this.state.carbSearchText, maxLength: 3 }) })] }), _jsx(IconButton, { svg: CloseSvg, flex: true, onClick: this.clearCarbSearch, style: { flex: '0 0 24px', padding: 0 }, disabled: this.state.carbSearchText === '' || this.state.isBusy, toggleState: this.state.carbSearchText !== '', title: 'Clear search input' })] });
        const ligSectionHeader = this.sectionHeader('ligands');
        const carbSectionHeader = this.sectionHeader('carbohydrates');
        return _jsxs(_Fragment, { children: [(this.state.componentGroups.nonLigGroups.length > 0) && _jsx("div", { children: this.state.componentGroups.nonLigGroups.map((g) => _jsx(StructureComponentGroup, { group: g, boldHeader: true }, g[0].cell.transform.ref)) }), (this.state.componentGroups.alphafold.length > 0) && _jsx("div", { children: this.state.componentGroups.alphafold.map((g) => _jsx(StructureComponentGroup, { group: g, boldHeader: true, type: 'alphafold' }, g[0].cell.transform.ref)) }), (this.state.componentGroups.ligGroups.length > 0) && ligSectionHeader, (!this.state.isLigCollapsed && this.state.componentGroups.ligGroups.length > 5) && ligSearchControls, (this.state.componentGroups.ligGroups.length > 0) && _jsx("div", { className: 'msp-control-offset', style: { maxHeight: '800px', overflowY: 'auto' }, children: !this.state.isLigCollapsed && this.state.ligGroups.map((g) => _jsx(StructureComponentGroup, { group: g, boldHeader: false }, g[0].cell.transform.ref)) }), (this.state.componentGroups.carbGroups.length > 0) && carbSectionHeader, (!this.state.isCarbCollapsed && this.state.componentGroups.carbGroups.length > 5) && carbSearchControls, (this.state.componentGroups.carbGroups.length > 0) && _jsx("div", { className: 'msp-control-offset', style: { maxHeight: '800px', overflowY: 'auto' }, children: !this.state.isCarbCollapsed && this.state.carbGroups.map((g) => _jsx(StructureComponentGroup, { group: g, boldHeader: false }, g[0].cell.transform.ref)) })] });
    }
}
class StructureComponentGroup extends PurePluginUIComponent {
    state = {
        action: void 0,
        isHidden: false,
        isBusy: false
    };
    get pivot() {
        return this.props.group[0];
    }
    checkAllHidden = async () => {
        let allHidden = true;
        for (const c of this.props.group) {
            if (!c.cell.state.isHidden) {
                allHidden = false;
                break;
            }
        }
        if (allHidden)
            this.setState({ isHidden: true });
    };
    componentDidMount() {
        this.checkAllHidden();
        this.subscribe(this.plugin.state.events.cell.stateUpdated, e => {
            // if (State.ObjectEvent.isCell(e, this.pivot.cell)) this.forceUpdate();
            if (this.pivot.cell.obj?.label === e.cell.obj?.label) {
                if (!e.cell.state.isHidden) {
                    this.setState({ isHidden: false });
                }
                else {
                    this.checkAllHidden();
                }
            }
        });
        this.subscribe(this.plugin.behaviors.state.isBusy, v => {
            this.setState({ isBusy: v });
        });
        this.subscribe(PluginCustomState(this.plugin).events.isBusy, (e) => {
            this.setState({ isBusy: e });
        });
    }
    toggleVisible = (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        this.plugin.managers.structure.component.toggleVisibility(this.props.group);
        this.setState({ isHidden: !this.state.isHidden });
        if (this.props.type === 'alphafold') {
            const spState = PluginCustomState(this.plugin).superpositionState;
            if (!spState)
                throw new Error('customState.superpositionState has not been initialized');
            spState.alphafold.visibility[spState.activeSegment - 1] = this.state.isHidden;
        }
    };
    toggleAction = () => this.setState({ action: this.state.action === 'action' ? void 0 : 'action' });
    highlight = (e) => {
        e.preventDefault();
        if (!this.props.group[0].cell.parent)
            return;
        PluginCommands.Interactivity.Object.Highlight(this.plugin, { state: this.props.group[0].cell.parent, ref: this.props.group.map(c => c.cell.transform.ref) });
    };
    clearHighlight = (e) => {
        e.preventDefault();
        PluginCommands.Interactivity.ClearHighlights(this.plugin);
    };
    focus = () => {
        let allHidden = true;
        for (const c of this.props.group) {
            if (!c.cell.state.isHidden) {
                allHidden = false;
                break;
            }
        }
        if (allHidden) {
            this.plugin.managers.structure.hierarchy.toggleVisibility(this.props.group, 'show');
        }
        this.plugin.managers.camera.focusSpheres(this.props.group, e => {
            if (e.cell.state.isHidden)
                return;
            return e.cell.obj?.data.boundary.sphere;
        });
    };
    render() {
        const component = this.pivot;
        const cell = component.cell;
        const label = cell.obj?.label;
        const labelEle = this.props.boldHeader ? _jsx("strong", { children: label }) : label;
        return _jsxs(_Fragment, { children: [_jsxs("div", { className: 'msp-flex-row', children: [_jsx(Button, { noOverflow: true, className: 'msp-control-button-label', title: `${label} - Click to focus.`, onClick: this.focus, style: { textAlign: 'left' }, disabled: this.state.isBusy, children: labelEle }), _jsx(IconButton, { disabled: this.state.isBusy, svg: this.state.isHidden ? VisibilityOffOutlinedSvg : VisibilityOutlinedSvg, toggleState: false, onClick: this.toggleVisible, title: `${this.state.isHidden ? 'Show' : 'Hide'} component`, small: true, className: 'msp-form-control', flex: true }), _jsx(IconButton, { disabled: this.state.isBusy, svg: MoreHorizSvg, onClick: this.toggleAction, title: 'Actions', toggleState: this.state.action === 'action', className: 'msp-form-control', flex: true })] }), this.state.action === 'action' && _jsx("div", { className: 'msp-accent-offset', children: _jsx("div", { style: { marginBottom: '6px' }, children: component.representations.map(r => _jsx(StructureRepresentationEntry, { group: this.props.group, representation: r }, r.cell.transform.ref)) }) })] });
    }
}
class StructureRepresentationEntry extends PurePluginUIComponent {
    state = {
        isBusy: false,
        clusterVal: { cluster: 'All' }
    };
    remove = () => this.plugin.managers.structure.component.removeRepresentations(this.props.group, this.props.representation);
    toggleVisible = (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        this.plugin.managers.structure.component.toggleVisibility(this.props.group, this.props.representation);
    };
    componentDidMount() {
        this.subscribe(this.plugin.state.events.cell.stateUpdated, e => {
            if (State.ObjectEvent.isCell(e, this.props.representation.cell))
                this.forceUpdate();
        });
        this.subscribe(this.plugin.behaviors.state.isBusy, v => {
            this.setState({ isBusy: v });
        });
        this.subscribe(PluginCustomState(this.plugin).events.isBusy, (e) => {
            this.setState({ isBusy: e });
        });
    }
    updateRepresentations(components, pivot, params) {
        if (components.length === 0)
            return Promise.resolve();
        const index = components[0].representations.indexOf(pivot);
        if (index < 0)
            return Promise.resolve();
        const superpositionState = PluginCustomState(this.plugin).superpositionState;
        if (!superpositionState)
            throw new Error('customState.superpositionState has not been initialized');
        let filteredComps = [];
        if (this.state.clusterVal.cluster !== 'All') {
            if (!superpositionState.segmentData)
                throw new Error('customState.superpositionState.segmentData has not been initialized');
            const clusterData = superpositionState.segmentData[superpositionState.activeSegment - 1].clusters[parseInt(this.state.clusterVal.cluster) - 1];
            filteredComps = clusterData.map((s) => {
                return `${s.pdb_id}_${s.struct_asym_id}`;
            });
            if (filteredComps.length === 0)
                return;
        }
        const update = this.plugin.state.data.build();
        for (const c of components) {
            // TODO: is it ok to use just the index here? Could possible lead to ugly edge cases, but perhaps not worth the trouble to "fix".
            const repr = c.representations[index];
            if (!repr)
                continue;
            if (repr.cell.transform.transformer !== pivot.cell.transform.transformer)
                continue;
            if (this.state.clusterVal.cluster !== 'All') {
                const rmIndex = filteredComps.indexOf(superpositionState.refMaps[repr.cell.transform.parent]);
                if (rmIndex === -1)
                    continue;
            }
            const updatedParams = {
                type: params.type ? params.type : repr.cell.params?.values.type,
                colorTheme: params.colorTheme ? params.colorTheme : repr.cell.params?.values.colorTheme,
                sizeTheme: params.sizeTheme ? params.sizeTheme : repr.cell.params?.values.sizeTheme
            };
            update.to(repr.cell).update(updatedParams);
        }
        return update.commit({ canUndo: 'Update Representation' });
    }
    update = (params) => {
        return this.updateRepresentations(this.props.group, this.props.representation, params);
    };
    selectCluster = (params) => {
        this.setState({ clusterVal: { cluster: params.cluster } });
    };
    render() {
        const repr = this.props.representation.cell;
        const superpositionState = PluginCustomState(this.plugin).superpositionState;
        const clusterSelectArr = [['All', 'All']];
        if (!superpositionState?.segmentData)
            throw new Error('customState.superpositionState.segmentData has not been initialized');
        superpositionState.segmentData[superpositionState.activeSegment - 1].clusters.forEach((c, i) => {
            clusterSelectArr.push([(i + 1) + '', (i + 1) + '']);
        });
        const clusterOptions = {
            cluster: ParamDefinition.Select('All', clusterSelectArr, { label: 'Select Cluster' })
        };
        let isSurrVisual = false;
        let isAlphafold = false;
        if (repr && repr.obj) {
            const reprObj = repr.obj;
            if (reprObj.tags && reprObj.tags.indexOf('superposition-focus-surr-repr') >= 0)
                isSurrVisual = true;
            if (reprObj.tags && reprObj.tags.indexOf('af-superposition-visual') >= 0)
                isAlphafold = true;
        }
        return _jsx("div", { className: 'msp-representation-entry', children: repr.parent && _jsxs("div", { children: [(clusterSelectArr.length > 2 && !isSurrVisual && !isAlphafold) && _jsx("div", { className: 'msp-representation-entry', children: _jsx(ParameterControls, { params: clusterOptions, values: this.state.clusterVal, onChangeValues: this.selectCluster, isDisabled: this.state.isBusy }) }), _jsx("div", { className: 'msp-representation-entry', children: _jsx(ParameterControls, { params: { type: repr.params?.definition.type }, values: { type: repr.params?.values.type }, onChangeValues: this.update, isDisabled: this.state.isBusy }) }), _jsx("div", { className: 'msp-representation-entry', children: _jsx(ParameterControls, { params: { colorTheme: repr.params?.definition.colorTheme }, values: { colorTheme: repr.params?.values.colorTheme }, onChangeValues: this.update, isDisabled: this.state.isBusy }) }), _jsx("div", { className: 'msp-representation-entry', children: _jsx(ParameterControls, { params: { sizeTheme: repr.params?.definition.sizeTheme }, values: { sizeTheme: repr.params?.values.sizeTheme }, onChangeValues: this.update, isDisabled: this.state.isBusy }) })] }) });
    }
}

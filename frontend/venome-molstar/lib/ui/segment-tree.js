import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { StateTransforms } from 'molstar/lib/mol-plugin-state/transforms';
import { PluginUIComponent, PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { Button, ExpandGroup, IconButton, SectionHeader } from 'molstar/lib/mol-plugin-ui/controls/common';
import { ArrowDropDownSvg, ArrowRightSvg, CheckSvg, CloseSvg, VisibilityOffOutlinedSvg, VisibilityOutlinedSvg } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { ParameterControls } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import { UpdateTransformControl } from 'molstar/lib/mol-plugin-ui/state/update-transform';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder';
import { State, StateObjectRef, StateSelection } from 'molstar/lib/mol-state';
import { Color } from 'molstar/lib/mol-util/color';
import { ColorLists } from 'molstar/lib/mol-util/color/lists';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { PluginCustomState } from '../plugin-custom-state';
import { renderSuperposition, superposeAf } from '../superposition';
const SuperpositionTag = 'SuperpositionTransform';
export class SegmentTree extends PurePluginUIComponent {
    componentDidMount() {
        this.subscribe(PluginCustomState(this.plugin).events.superpositionInit, () => {
            const customState = this.customState;
            if (customState && !customState.superpositionError) {
                this.getSegmentParams();
            }
            this.forceUpdate();
        });
        this.subscribe(PluginCustomState(this.plugin).events.isBusy, (e) => {
            this.setState({ isBusy: e });
            if (e) {
                PluginCommands.Toast.Show(this.plugin, {
                    title: 'Process',
                    message: 'Loading / computing large dataset!',
                    key: 'is-busy-toast'
                });
            }
            else {
                PluginCommands.Toast.Hide(this.plugin, { key: 'is-busy-toast' });
            }
        });
        this.subscribe(this.plugin.behaviors.layout.leftPanelTabName, (e) => {
            if (e !== 'segments')
                return;
            this.getSegmentParams();
            this.forceUpdate();
        });
    }
    get customState() {
        return PluginCustomState(this.plugin);
    }
    getSegmentParams = () => {
        const customState = this.customState;
        if (!customState.superpositionState || !customState.superpositionState.segmentData)
            return;
        const segmentData = customState.superpositionState.segmentData;
        const segmentArr = segmentData.map((segment, i) => {
            const segmentLabel = `${i + 1} ( ${segment.segment_start} - ${segment.segment_end} )`;
            return [segmentLabel, segmentLabel];
        });
        const segmentOptions = {
            segment: PD.Select('', segmentArr, { label: 'Select Segment', description: 'Select segment to view its clusters below' })
        };
        const segmentIndex = customState.superpositionState.activeSegment - 1;
        this.setState({
            segment: {
                params: segmentOptions,
                value: { segment: segmentArr[segmentIndex][0] }
            }
        });
        this.setState({ isBusy: false });
    };
    updateSegment = async (val) => {
        if (!this.state.segment)
            return;
        if (!this.state.segment)
            return;
        const customState = this.customState;
        if (!customState.superpositionState)
            throw new Error('customState.superpositionState has not been initialized');
        customState.events?.isBusy.next(true);
        // Hide pervious segement structures
        this.hideStructures(customState.superpositionState.activeSegment - 1);
        // Set current segment params
        const updatedParams = { ...this.state.segment };
        updatedParams.value = val;
        this.setState({ segment: updatedParams });
        setTimeout(async () => {
            const updatedSegmentIndex = parseInt(val.segment.split(' ')[0]);
            customState.superpositionState.activeSegment = updatedSegmentIndex;
            // Display current segment visible structures
            await this.displayStructures(customState.superpositionState.activeSegment - 1);
            customState.events?.isBusy.next(false);
            customState.events?.segmentUpdate.next(true);
        }, 100);
        return false;
    };
    hideStructures = (segmentIndex) => {
        // clear selections
        this.plugin.managers.interactivity.lociSelects.deselectAll();
        // clear Focus
        this.plugin.managers.structure.focus.clear();
        // remove measurements
        const measurements = this.plugin.managers.structure.measurement.state;
        const measureTypes = ['labels', 'distances', 'angles', 'dihedrals'];
        let measurementCell = void 0;
        measureTypes.forEach((type) => {
            if (measurementCell)
                return;
            if (measurements[type][0]) {
                measurementCell = this.plugin.state.data.cells.get(measurements[type][0].transform.parent);
            }
        });
        if (measurementCell) {
            PluginCommands.State.RemoveObject(this.plugin, { state: measurementCell.parent, ref: measurementCell.transform.parent, removeParentGhosts: true });
        }
        // hide structures
        const customState = this.customState;
        if (!customState.superpositionState)
            throw new Error('customState.superpositionState has not been initialized');
        customState.superpositionState.visibleRefs[segmentIndex] = [];
        for (const struct of customState.superpositionState.loadedStructs[segmentIndex]) {
            const structRef = customState.superpositionState.models[struct];
            if (structRef) {
                const structHierarchy = this.plugin.managers.structure.hierarchy.current.refs.get(structRef);
                if (structHierarchy && structHierarchy.components) {
                    for (const c of structHierarchy.components) {
                        if (c && c.cell && !c.cell.state.isHidden) {
                            customState.superpositionState.visibleRefs[segmentIndex].push(c.cell.transform.ref);
                            PluginCommands.State.ToggleVisibility(this.plugin, { state: c.cell.parent, ref: c.cell.transform.ref });
                        }
                    }
                }
            }
        }
        if (customState.superpositionState.alphafold.ref) {
            const afStr = this.plugin.managers.structure.hierarchy.current.refs.get(customState.superpositionState.alphafold.ref);
            if (afStr && afStr.components) {
                for (const c of afStr.components) {
                    if (c && c.cell && !c.cell.state.isHidden) {
                        PluginCommands.State.ToggleVisibility(this.plugin, { state: c.cell.parent, ref: c.cell.transform.ref });
                    }
                }
            }
        }
    };
    displayStructures = async (segmentIndex) => {
        const customState = this.customState;
        const spState = customState.superpositionState;
        if (!spState)
            throw new Error('customState.superpositionState has not been initialized');
        if (spState.visibleRefs[segmentIndex].length === 0) {
            const loadStrs = [];
            spState.segmentData?.[segmentIndex].clusters.forEach(cluster => {
                let entryList = [cluster[0]];
                if (customState.initParams?.superpositionParams?.superposeAll) {
                    entryList = cluster;
                }
                entryList.forEach((str) => {
                    const structStateId = `${str.pdb_id}_${str.struct_asym_id}`;
                    const structRef = spState.models[structStateId];
                    if (structRef) {
                        const cell = this.plugin.state.data.cells.get(structRef);
                        const isHidden = cell.state.isHidden ? true : false;
                        if (isHidden) {
                            PluginCommands.State.ToggleVisibility(this.plugin, { state: cell.parent, ref: structRef });
                            // PluginCommands.State.ToggleVisibility(this.plugin, { state: cell.parent!, ref: cell.transform.parent });
                        }
                    }
                    else {
                        loadStrs.push(str);
                    }
                });
            });
            PluginCommands.Camera.Reset(this.plugin);
            if (loadStrs.length > 0) {
                await renderSuperposition(this.plugin, segmentIndex, loadStrs);
                PluginCommands.Camera.Reset(this.plugin);
            }
        }
        else {
            for (const ref of spState.visibleRefs[segmentIndex]) {
                const cell = this.plugin.state.data.cells.get(ref);
                if (cell && cell.state.isHidden) {
                    PluginCommands.State.ToggleVisibility(this.plugin, { state: cell.parent, ref });
                }
            }
            PluginCommands.Camera.Reset(this.plugin);
        }
        if (spState.alphafold.ref) {
            superposeAf(this.plugin, spState.alphafold.traceOnly);
            PluginCommands.Camera.Reset(this.plugin);
        }
        if (spState.alphafold.ref && spState.alphafold.visibility[segmentIndex]) {
            const afStr = this.plugin.managers.structure.hierarchy.current.refs.get(spState.alphafold.ref);
            if (afStr && afStr.components) {
                for (const c of afStr.components) {
                    if (c && c.cell && c.cell.state.isHidden) {
                        PluginCommands.State.ToggleVisibility(this.plugin, { state: c.cell.parent, ref: c.cell.transform.ref });
                    }
                }
            }
        }
    };
    async transform(s, matrix) {
        const r = StateObjectRef.resolveAndCheck(this.plugin.state.data, s);
        if (!r)
            return;
        // TODO should find any TransformStructureConformation decorator instance
        const o = StateSelection.findTagInSubtree(this.plugin.state.data.tree, r.transform.ref, SuperpositionTag);
        const params = {
            transform: {
                name: 'matrix',
                params: { data: matrix, transpose: false }
            }
        };
        // TODO add .insertOrUpdate to StateBuilder?
        const b = o
            ? this.plugin.state.data.build().to(o).update(params)
            : this.plugin.state.data.build().to(s)
                .insert(StateTransforms.Model.TransformStructureConformation, params, { tags: SuperpositionTag });
        await this.plugin.runTask(this.plugin.state.data.updateTree(b));
    }
    render() {
        let sectionHeader = _jsx(SectionHeader, { title: `Structure clusters` });
        const customState = this.customState;
        if (customState && customState.initParams && !customState.initParams.superposition) {
            return _jsxs(_Fragment, { children: [sectionHeader, _jsx("div", { children: "Functionality unavailable!" })] });
        }
        else {
            if (customState && customState.initParams && customState.initParams.superposition) {
                sectionHeader = _jsx(SectionHeader, { title: `Structure clusters - ${customState.initParams.moleculeId}` });
                if (customState.superpositionError) {
                    return _jsxs(_Fragment, { children: [sectionHeader, _jsx("div", { style: { textAlign: 'center' }, children: customState.superpositionError })] });
                }
                else if (!customState.superpositionState || !customState.superpositionState.segmentData) {
                    return _jsxs(_Fragment, { children: [sectionHeader, _jsx("div", { style: { textAlign: 'center' }, children: "Loading Segment Data!" })] });
                }
            }
        }
        if (this.state) {
            const segmentIndex = parseInt(this.state.segment.value.segment.split(' ')[0]) - 1;
            if (!customState.superpositionState?.segmentData)
                throw new Error('customState.superpositionState.segmentData has not been initialized');
            const segmentData = customState.superpositionState.segmentData;
            const fullSegmentRange = `( ${segmentData[0].segment_start} - ${segmentData[segmentData.length - 1].segment_end} )`;
            sectionHeader = _jsx(SectionHeader, { title: `Structure clusters ${customState.initParams.moleculeId}`, desc: fullSegmentRange });
            return _jsxs(_Fragment, { children: [sectionHeader, _jsx(ParameterControls, { params: this.state.segment.params, values: this.state.segment.value, onChangeValues: this.updateSegment, isDisabled: this.state.isBusy }), segmentData[segmentIndex].clusters.map((c, i) => _jsx(ClusterNode, { cluster: c, totalClusters: segmentData[segmentIndex].clusters.length, segmentIndex: segmentIndex, clusterIndex: i }, `cluster-${segmentIndex}-${i}`))] });
        }
        return _jsx(_Fragment, {});
    }
}
class ClusterNode extends PluginUIComponent {
    state = {
        isCollapsed: false,
        showAll: false,
        showNone: false,
        showSearch: false,
        isBusy: false,
        cluster: this.props.cluster,
        searchText: ''
    };
    inputStream = new Subject();
    handleInputStream = (inputStr) => {
        this.setState({ searchText: inputStr });
        const filteredRes = this.props.cluster.filter((item) => {
            return item.pdb_id.toLowerCase().indexOf(inputStr.toLowerCase()) >= 0;
        });
        this.setState({ cluster: filteredRes });
    };
    componentDidMount() {
        this.subscribe(PluginCustomState(this.plugin).events.isBusy, (e) => {
            this.setState({ isBusy: e, showAll: false, showNone: false });
        });
        this.subscribe(this.inputStream.pipe(debounceTime(1000 / 24)), (e) => this.handleInputStream(e));
    }
    get customState() {
        return PluginCustomState(this.plugin);
    }
    toggleExpanded = (e) => {
        e.preventDefault();
        this.setState({ isCollapsed: !this.state.isCollapsed });
        e.currentTarget.blur();
    };
    selectAll = (e) => {
        e.preventDefault();
        this.setState({ showAll: !this.state.showAll, showNone: false });
        e.currentTarget.blur();
    };
    selectNone = (e) => {
        e.preventDefault();
        this.setState({ showAll: false, showNone: !this.state.showNone });
        e.currentTarget.blur();
    };
    applyAction = async (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        const customState = this.customState;
        customState.events?.isBusy.next(true);
        const currentState = { ...this.state };
        this.setState({ showAll: false, showNone: false });
        setTimeout(async () => {
            const loadStrs = [];
            for await (const str of this.state.cluster) {
                const structStateId = `${str.pdb_id}_${str.struct_asym_id}`;
                let structRef = undefined;
                if (customState && customState.superpositionState && customState.superpositionState.models[structStateId]) {
                    structRef = customState.superpositionState.models[structStateId];
                }
                if (structRef) {
                    const cell = this.plugin.state.data.cells.get(structRef);
                    if (cell) {
                        const isHidden = cell.state.isHidden ? true : false;
                        if ((isHidden && currentState.showAll) || (!isHidden && currentState.showNone)) {
                            await PluginCommands.State.ToggleVisibility(this.plugin, { state: cell.parent, ref: structRef });
                            // await PluginCommands.State.ToggleVisibility(this.plugin, { state: cell.parent!, ref: cell.transform.parent });
                        }
                    }
                }
                else {
                    if (currentState.showAll)
                        loadStrs.push(str);
                }
            }
            ;
            PluginCommands.Camera.Reset(this.plugin);
            if (loadStrs.length > 0) {
                await renderSuperposition(this.plugin, this.props.segmentIndex, loadStrs);
            }
            customState.events?.isBusy.next(false);
        });
    };
    cancelAction = (e) => {
        e.preventDefault();
        this.setState({ showAll: false, showNone: false });
        e.currentTarget.blur();
    };
    clearSearch = (e) => {
        e.preventDefault();
        this.setState({ searchText: '' });
        this.inputStream.next('');
        e.currentTarget.blur();
    };
    render() {
        const customState = this.customState;
        if (!customState.superpositionState || !customState.superpositionState.segmentData)
            return _jsx(_Fragment, {});
        const expand = _jsx(IconButton, { svg: this.state.isCollapsed ? ArrowRightSvg : ArrowDropDownSvg, flex: '20px', onClick: this.toggleExpanded, transparent: true, disabled: this.state.isBusy, className: 'msp-no-hover-outline' });
        const title = `Segment ${customState.superpositionState.activeSegment} Cluster ${this.props.clusterIndex + 1}`;
        const label = _jsxs(Button, { className: `msp-btn-tree-label`, noOverflow: true, title: title, disabled: this.state.isBusy, children: [_jsxs("span", { children: ["Cluster ", this.props.clusterIndex + 1] }), " ", _jsxs("small", { children: [this.state.cluster.length < this.props.cluster.length ? `${this.state.cluster.length} / ` : '', this.props.cluster.length, " chain", this.props.cluster.length > 1 ? 's' : ''] })] });
        const selectionControls = _jsxs(_Fragment, { children: [_jsx(Button, { icon: CheckSvg, flex: true, onClick: this.selectAll, style: { flex: '0 0 50px', textAlign: 'center', fontSize: '80%', color: '#9cacc3', padding: 0 }, disabled: this.state.isBusy, title: `Show all chains`, children: "All" }), _jsx(Button, { icon: CloseSvg, flex: true, onClick: this.selectNone, style: { flex: '0 0 50px', textAlign: 'center', fontSize: '80%', color: '#9cacc3', padding: 0 }, disabled: this.state.isBusy, title: `Hide all chains`, children: "None" })] });
        const mainRow = _jsxs("div", { className: `msp-flex-row msp-tree-row`, style: { marginTop: '10px' }, children: [expand, label, this.props.cluster.length > 1 && selectionControls] });
        const searchControls = _jsxs("div", { className: 'msp-mapped-parameter-group', style: { fontSize: '90%' }, children: [_jsxs("div", { className: 'msp-control-row msp-transform-header-brand-gray', style: { height: '33px', marginLeft: '30px' }, children: [_jsx("span", { className: 'msp-control-row-label', children: "Search PDB ID" }), _jsx("div", { className: 'msp-control-row-ctrl', children: _jsx("input", { type: 'text', placeholder: 'Enter PDB ID..', disabled: this.state.isBusy, onChange: e => this.inputStream.next(e.target.value), value: this.state.searchText, maxLength: 4 }) })] }), _jsx(IconButton, { svg: CloseSvg, flex: true, onClick: this.clearSearch, style: { flex: '0 0 24px', padding: 0 }, disabled: this.state.isBusy || this.state.searchText === '', toggleState: this.state.searchText !== '', title: 'Clear search input' })] });
        return _jsxs(_Fragment, { children: [mainRow, (this.state.showAll || this.state.showNone) && _jsx("div", { children: _jsxs("div", { className: `msp-control-row msp-transform-header-brand-${this.state.showAll ? 'green' : 'red'}`, style: { display: 'flex', marginLeft: '20px', height: '35px' }, children: [_jsxs("span", { className: 'msp-control-row-label', style: { flex: '1 1 auto', textAlign: 'left', fontSize: '85%' }, children: [this.state.showAll ? 'Display' : 'Hide', " ", this.state.cluster.length < this.props.cluster.length ? `${this.state.cluster.length} / ` : 'all ', this.props.cluster.length, " chains"] }), _jsx(Button, { icon: CheckSvg, flex: true, onClick: this.applyAction, style: { flex: '0 0 60px', textAlign: 'center', fontSize: '78%', color: '#9cacc3', padding: 0, margin: '0 1px' }, title: `Apply action`, children: "Apply" }), _jsx(Button, { icon: CloseSvg, flex: true, onClick: this.cancelAction, style: { flex: '0 0 60px', textAlign: 'center', fontSize: '78%', color: '#9cacc3', padding: 0, margin: '0 1px' }, title: `Cancel action`, children: "Cancel" })] }) }), (!this.state.isCollapsed && this.props.cluster.length > 5) && searchControls, !this.state.isCollapsed && _jsx("div", { className: 'msp-tree-updates-wrapper', style: { maxHeight: (this.props.totalClusters > 1) ? '330px' : '87%', overflowY: 'auto' }, children: this.state.cluster.map((s, i) => _jsx(StructureNode, { segmentIndex: this.props.segmentIndex, structure: s, isRep: i === 0 ? true : false }, `str-${s.pdb_id}${s.struct_asym_id}${i}`)) })] });
    }
}
class StructureNode extends PluginUIComponent {
    state = {
        showControls: false,
        isBusy: false,
        isProcessing: false,
        isHidden: true,
    };
    get customState() {
        return PluginCustomState(this.plugin);
    }
    get ref() {
        if (this.customState && this.customState.superpositionState && this.customState.superpositionState.models[`${this.props.structure.pdb_id}_${this.props.structure.struct_asym_id}`]) {
            return this.customState.superpositionState.models[`${this.props.structure.pdb_id}_${this.props.structure.struct_asym_id}`];
        }
        else {
            return undefined;
        }
    }
    get modelCell() {
        if (this.ref) {
            return this.plugin.state.data.cells.get(this.ref);
        }
        else {
            return undefined;
        }
    }
    get isAllHidden() {
        let isHidden = true;
        if (this.ref) {
            const structHierarchy = this.plugin.managers.structure.hierarchy.current.refs.get(this.ref);
            if (structHierarchy && structHierarchy.components) {
                for (const c of structHierarchy.components) {
                    if (c && c.cell && !c.cell.state.isHidden) {
                        isHidden = false;
                        break;
                    }
                }
            }
            else {
                isHidden = false;
            }
        }
        return isHidden;
    }
    checkRelation(ref) {
        let isRelated = false;
        const cell = this.plugin.state.data.cells.get(ref);
        if (cell && cell.transform.parent) {
            if (cell && cell.transform.parent === this.ref) {
                isRelated = true;
            }
            else {
                const pcell = this.plugin.state.data.cells.get(cell.transform.parent);
                if (pcell && pcell.transform.parent === this.ref)
                    isRelated = true;
            }
        }
        else {
            const currentNodeCell = this.plugin.state.data.cells.get(this.ref);
            if (currentNodeCell && currentNodeCell.transform.parent === cell.transform.parent) {
                isRelated = true;
            }
        }
        return isRelated;
    }
    is(e) {
        if (!this.ref)
            return false;
        let isRelated = false;
        if (this.ref && e.ref !== this.ref) {
            isRelated = this.checkRelation(e.ref);
        }
        if (e.ref === this.ref || isRelated) {
            return true;
        }
        else {
            const id = `${this.props.structure.pdb_id}_${this.props.structure.struct_asym_id}`;
            const invalidStruct = this.customState.superpositionState?.invalidStruct.includes(id) ?? false;
            return invalidStruct;
        }
    }
    componentDidMount() {
        this.setState({ isHidden: this.isAllHidden });
        this.subscribe(PluginCustomState(this.plugin).events.isBusy, (e) => {
            this.setState({ isBusy: e, showControls: false });
        });
        this.subscribe(this.plugin.state.events.cell.stateUpdated.pipe(filter(e => this.is(e)), debounceTime(33)), e => {
            this.setState({ isHidden: this.isAllHidden });
            // this.forceUpdate();
        });
    }
    toggleVisible = async (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        this.setState({ isProcessing: true, showControls: false });
        if (this.ref) {
            const structHierarchy = this.plugin.managers.structure.hierarchy.current.refs.get(this.ref);
            if (structHierarchy && structHierarchy.components) {
                for (const c of structHierarchy.components) {
                    const currentHiddenState = c.cell.state.isHidden ? true : false;
                    if (currentHiddenState === this.state.isHidden) {
                        PluginCommands.State.ToggleVisibility(this.plugin, { state: c.cell.parent, ref: c.cell.transform.ref });
                    }
                }
                this.setState({ isHidden: !this.state.isHidden });
            }
        }
        else {
            await renderSuperposition(this.plugin, this.props.segmentIndex, [this.props.structure]);
        }
        this.setState({ isProcessing: false });
        PluginCommands.Camera.Reset(this.plugin);
    };
    selectAction = item => {
        if (!item)
            return;
        this.setState({ showControls: false });
        (item?.value)();
    };
    getTagRefs(tags) {
        const TagSet = new Set(tags);
        const tree = this.plugin.state.data.tree;
        return StateSelection.findUniqueTagsInSubtree(tree, this.modelCell.transform.ref, TagSet);
    }
    ;
    getRandomColor() {
        const clList = ColorLists;
        const spState = PluginCustomState(this.plugin).superpositionState;
        if (!spState)
            throw new Error('customState.superpositionState has not been initialized');
        let palleteIndex = spState.colorState[this.props.segmentIndex].palleteIndex;
        let colorIndex = spState.colorState[this.props.segmentIndex].colorIndex;
        if (clList[spState.colorPalette[palleteIndex]].list[colorIndex + 1]) {
            colorIndex += 1;
        }
        else {
            colorIndex = 0;
            palleteIndex = spState.colorPalette[palleteIndex + 1] ? palleteIndex + 1 : 0;
        }
        const palleteName = spState.colorPalette[palleteIndex];
        spState.colorState[this.props.segmentIndex].palleteIndex = palleteIndex;
        spState.colorState[this.props.segmentIndex].colorIndex = colorIndex;
        return clList[palleteName].list[colorIndex];
    }
    async addChainRepr() {
        const uniformColor1 = this.getRandomColor();
        const strInstance = this.plugin.state.data.select(this.ref)[0];
        const query = MS.struct.generator.atomGroups({
            'chain-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_asym_id(), this.props.structure.struct_asym_id])
        });
        const chainSel = await this.plugin.builders.structure.tryCreateComponentFromExpression(strInstance, query, `Chain-${this.props.segmentIndex}`, { label: `Chain`, tags: [`superposition-sel`] });
        if (chainSel) {
            await this.plugin.builders.structure.representation.addRepresentation(chainSel, { type: 'cartoon', color: 'uniform', colorParams: { value: uniformColor1 } }, { tag: `superposition-visual` });
        }
    }
    updates() {
        const structHierarchy = this.plugin.managers.structure.hierarchy.current.refs.get(this.ref);
        if (structHierarchy && structHierarchy.components) {
            const representations = [];
            let showAddChainBtn = true;
            structHierarchy.components.forEach((comps) => {
                const gKeys = comps.key.split(',');
                const cId1Arr = gKeys[0].split('-');
                if (cId1Arr[2] === 'Chain')
                    showAddChainBtn = false;
                if (comps.representations) {
                    comps.representations.forEach((repr) => {
                        representations.push(repr);
                    });
                }
            });
            const customState = PluginCustomState(this.plugin);
            if (customState.initParams?.superpositionParams && !customState.initParams.superpositionParams.ligandView) {
                showAddChainBtn = false;
            }
            if (representations.length > 0) {
                return _jsxs("div", { className: 'msp-accent-offset', style: { marginLeft: '40px' }, children: [representations.length > 0 && representations.map((r, i) => _jsx(StructureRepresentationEntry, { group: [structHierarchy], representation: r }, `${r.cell.transform.ref}-${i}`)), showAddChainBtn && _jsx("div", { className: 'msp-control-group-header', style: { marginTop: '1px' }, children: _jsxs(Button, { noOverflow: true, className: 'msp-control-button-label', title: `Click to add chain representaion`, onClick: () => this.addChainRepr(), children: ["\u00A0\u00A0Add Chain ", this.props.structure.struct_asym_id, " Representation"] }) })] });
            }
        }
        return _jsx(_Fragment, {});
    }
    highlight = (e) => {
        e.preventDefault();
        if (this.ref) {
            const cell = this.plugin.state.data.cells.get(this.ref);
            PluginCommands.Interactivity.Object.Highlight(this.plugin, { state: cell.parent, ref: this.ref });
        }
        e.currentTarget.blur();
    };
    clearHighlight = (e) => {
        e.preventDefault();
        PluginCommands.Interactivity.ClearHighlights(this.plugin);
        e.currentTarget.blur();
    };
    toggleControls = (e) => {
        e.preventDefault();
        this.setState({ showControls: !this.state.showControls });
        e.currentTarget.blur();
    };
    getSubtitle() {
        if (!this.customState.superpositionState)
            throw new Error('customState.superpositionState has not been initialized');
        const hetList = this.customState.superpositionState.hets[`${this.props.structure.pdb_id}_${this.props.structure.struct_asym_id}`];
        let subtitle;
        if (hetList) {
            const hetLimit = this.props.structure.is_representative ? 1 : 4;
            const totalHets = hetList.length;
            let hetStr = hetList.join(', ');
            if (totalHets > hetLimit) {
                hetStr = hetList.slice(0, hetLimit).join(', ');
                hetStr += ` + ${totalHets - hetLimit}`;
            }
            subtitle = ` ( ${hetStr} )`;
            if (this.props.structure.is_representative)
                subtitle = ` ${subtitle} ( Representative )`;
        }
        else if (this.props.structure.is_representative) {
            subtitle = ' ( Representative )';
        }
        return subtitle;
    }
    get panelColor() {
        let panelColor = '#808080';
        if (!this.state.isHidden) {
            if (this.modelCell) {
                const refs = this.getTagRefs([`superposition-visual`, `superposition-ligand-visual`]);
                const visualRef = refs[`superposition-ligand-visual`] ? refs[`superposition-ligand-visual`] : refs[`superposition-visual`] ? refs[`superposition-visual`] : undefined;
                if (visualRef) {
                    const visualCell = this.plugin.state.data.cells.get(visualRef);
                    if (visualCell.params && visualCell.params.values && visualCell.params.values.colorTheme) {
                        const colorTheme = visualCell.params.values.colorTheme;
                        if (colorTheme.params && colorTheme.params.value) {
                            panelColor = `${Color.toStyle(colorTheme.params.value)}`;
                        }
                        else if (colorTheme.params && colorTheme.params.palette) {
                            const colorList1 = colorTheme.params.palette.params.list.colors;
                            panelColor = `${Color.toStyle(colorList1[0])}`;
                        }
                        else if (colorTheme.params && colorTheme.params.list) {
                            const colorList2 = colorTheme.params.list.colors;
                            panelColor = `${Color.toStyle(colorList2[0])}`;
                        }
                    }
                }
            }
        }
        return panelColor;
    }
    render() {
        const superpositionParams = this.customState.initParams.superpositionParams;
        const strutStateId = `${this.props.structure.pdb_id}_${this.props.structure.struct_asym_id}`;
        const invalidStruct = this.customState.superpositionState?.invalidStruct.includes(strutStateId);
        const noMatrixStruct = this.customState.superpositionState?.noMatrixStruct.includes(strutStateId);
        const subTitle = invalidStruct ? noMatrixStruct ? ` Matrix not available!` : ` No Ligand found!` : this.getSubtitle();
        let strTitle = `${this.props.structure.pdb_id} chain ${this.props.structure.auth_asym_id}`;
        if (superpositionParams && superpositionParams.ligandView) {
            strTitle = `${this.props.structure.pdb_id} ${this.props.structure.struct_asym_id}`;
        }
        const label = _jsxs(Button, { className: `msp-btn-tree-label`, style: { borderLeftColor: this.panelColor }, noOverflow: true, title: strTitle, disabled: (invalidStruct || this.state.isBusy || this.state.isProcessing) ? true : false, onMouseEnter: this.highlight, onMouseLeave: this.clearHighlight, children: [_jsx("span", { children: strTitle }), subTitle && _jsx("small", { children: subTitle })] });
        const expand = _jsx(IconButton, { svg: !this.state.showControls ? ArrowRightSvg : ArrowDropDownSvg, flex: '20px', onClick: this.toggleControls, transparent: true, className: 'msp-no-hover-outline', disabled: (invalidStruct || this.state.isBusy || this.state.isProcessing) ? true : false });
        const visibility = _jsx(IconButton, { svg: this.state.isHidden ? VisibilityOffOutlinedSvg : VisibilityOutlinedSvg, toggleState: false, small: true, onClick: this.toggleVisible, disabled: (invalidStruct || this.state.isBusy || this.state.isProcessing) ? true : false, title: this.state.isHidden ? `Show chain` : `Hide chain` });
        const row = _jsxs("div", { className: `msp-flex-row msp-tree-row`, style: { marginLeft: !this.state.isHidden ? '10px' : '31px' }, children: [!this.state.isHidden && expand, label, visibility] });
        return _jsxs("div", { style: { marginBottom: '1px' }, children: [row, this.state.showControls && this.updates()] });
    }
}
class StructureRepresentationEntry extends PurePluginUIComponent {
    componentDidMount() {
        this.subscribe(this.plugin.state.events.cell.stateUpdated, e => {
            if (State.ObjectEvent.isCell(e, this.props.representation.cell))
                this.forceUpdate();
        });
    }
    toggleVisible = (e) => {
        e.preventDefault();
        e.currentTarget.blur();
        const cell = this.props.representation.cell;
        PluginCommands.State.ToggleVisibility(this.plugin, { state: cell.parent, ref: cell.transform.parent });
    };
    render() {
        const repr = this.props.representation.cell;
        let label = repr.obj?.label;
        if (repr.obj?.data.repr && repr.obj?.data.repr.label) {
            let sourceLabel = (repr.obj?.data.repr.label.indexOf('[Focus]') >= 0) ? '[Focus]' : repr.obj?.data.repr.label;
            const isLargeLabel = sourceLabel.length > 10 ? true : false;
            sourceLabel = `${isLargeLabel ? `${sourceLabel.substring(0, 28)}...` : sourceLabel}`;
            if (isLargeLabel) {
                label = sourceLabel;
            }
            else {
                label = `${sourceLabel} ${(label && label.length < 21) ? ' - ' + label : ''}`;
            }
        }
        if (repr.obj?.data.repr && repr.obj?.data.repr.label === 'Custom Selection')
            label = 'Custom Selection';
        return _jsxs("div", { className: 'msp-representation-entry', children: [repr.parent && _jsx(ExpandGroup, { header: `${label || 'Representation'}`, noOffset: true, headerStyle: { overflow: 'hidden' }, children: _jsx(UpdateTransformControl, { state: repr.parent, transform: repr.transform, customHeader: 'none', noMargin: true }) }), _jsx(IconButton, { svg: this.props.representation.cell.state.isHidden ? VisibilityOffOutlinedSvg : VisibilityOutlinedSvg, toggleState: false, onClick: this.toggleVisible, title: this.props.representation.cell.state.isHidden ? `Show representation` : `Hide representation`, small: true, className: 'msp-default-bg', style: { position: 'absolute', top: 0, right: 0, lineHeight: '24px', height: '24px', textAlign: 'right', width: '32px', paddingRight: '6px', background: 'none' } })] });
    }
}
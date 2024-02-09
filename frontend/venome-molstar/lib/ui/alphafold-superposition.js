import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { CollapsableControls, PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { TuneSvg, SuperposeChainsSvg, SuperpositionSvg, Icon } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { Button, ToggleButton } from 'molstar/lib/mol-plugin-ui/controls/common';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { ParameterControls } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import { superposeAf } from '../superposition';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { axisBottom as d3AxisBotom, axisLeft as d3AxisLeft } from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import { PluginCustomState } from '../plugin-custom-state';
const _InfoIcon = _jsx("svg", { width: '24px', height: '24px', viewBox: '0 0 24 24', strokeWidth: '0.1px', children: _jsx("path", { fill: "currentColor", d: "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" }) });
export function InfoIconSvg() { return _InfoIcon; }
export class AlphafoldPaeControls extends CollapsableControls {
    axisBoxRef;
    defaultState() {
        return {
            isCollapsed: false,
            header: 'AlphaFold PAE',
            brand: { accent: 'gray', svg: SuperpositionSvg },
            isHidden: true
        };
    }
    constructor(props, context) {
        super(props, context);
        this.axisBoxRef = React.createRef();
    }
    componentDidMount() {
        this.subscribe(this.plugin.managers.structure.hierarchy.behaviors.selection, sel => {
            const superpositionState = PluginCustomState(this.plugin).superpositionState;
            if (superpositionState && superpositionState.alphafold.ref && superpositionState.alphafold.apiData.pae && superpositionState.alphafold.apiData.pae !== '' && superpositionState.alphafold.apiData.pae !== '') {
                this.setState({ isHidden: false });
                const domainMax = superpositionState.alphafold.apiData.length;
                const x = d3ScaleLinear().domain([0, domainMax]).range([0, 200]);
                const xAxis = d3AxisBotom(x).ticks(6).tickFormat(this.formatTicks).tickSizeOuter(0);
                const yAxis = d3AxisLeft(x).ticks(6).tickFormat(this.formatTicks).tickSizeOuter(0);
                const axisContainer = d3Select(this.axisBoxRef.current);
                axisContainer.append('svg:svg')
                    .attr('width', 220)
                    .attr('height', 30)
                    .attr('class', 'pae-x-axis')
                    .style('z-index', '1')
                    .style('position', 'absolute')
                    .attr('transform', `translate(-93,202)`)
                    .append('g')
                    .attr('transform', `translate(6,0)`)
                    .call(xAxis);
                axisContainer.append('svg:svg')
                    .attr('width', 50)
                    .attr('height', 220)
                    .attr('class', 'pae-y-axis')
                    .style('z-index', '1')
                    .style('position', 'absolute')
                    .attr('transform', `translate(-123,0)`)
                    .append('g')
                    .attr('transform', `translate(36,4)`)
                    .call(yAxis);
            }
        });
    }
    formatTicks(d) {
        return d > 999 ? d / 1000 + 'k' : d;
    }
    renderControls() {
        const superpositionState = PluginCustomState(this.plugin).superpositionState;
        if (!superpositionState || !superpositionState.alphafold)
            return null;
        const errorScale = [0, 5, 10, 15, 20, 25, 30];
        return _jsxs("div", { className: 'msp-flex-row', style: { height: 'auto', textAlign: 'center', justifyContent: 'center', padding: '15px 0', position: 'relative', fontSize: '12px' }, children: [_jsx("div", { ref: this.axisBoxRef, className: 'pae-axis-box', style: { position: 'absolute', width: '100%', height: '100%' } }), _jsx("span", { style: { transform: 'rotate(270deg)', position: 'absolute', transformOrigin: '0 0', left: '10px', top: '165px', fontWeight: 500 }, children: "Aligned residue" }), _jsxs("div", { className: 'msp-flex-row', style: { height: 'auto', flexDirection: 'column' }, children: [_jsx("div", { style: { width: '200px', height: '200px', border: '1px solid #6a635a', margin: '2px 0 25px 25px', position: 'relative' }, children: _jsx("img", { style: { width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }, src: `${superpositionState.alphafold.apiData.pae}`, alt: "PAE" }) }), _jsx("div", { style: { textAlign: 'center', paddingLeft: '30px', marginBottom: '20px', fontWeight: 500 }, children: "Scored residue" }), _jsx("img", { style: { width: '200px', height: '10px', border: '1px solid #6a635a', margin: '2px 0 25px 25px', transform: 'rotate(180deg)' }, src: 'https://alphafold.ebi.ac.uk/assets/img/horizontal_colorbar.png', alt: "PAE Scale" }), _jsx("ul", { style: { listStyleType: 'none', fontWeight: 500, margin: 0, display: 'inline-block', position: 'absolute', top: '292px', marginLeft: '24px' }, children: errorScale.map((errValue) => _jsx("li", { style: { float: 'left', marginRight: '18px' }, children: errValue }, errValue)) }), _jsx("div", { style: { textAlign: 'center', paddingLeft: '20px', fontWeight: 500 }, children: "Expected position error (\u00C5ngstr\u00F6ms)" })] })] });
    }
}
export class AlphafoldSuperpositionControls extends CollapsableControls {
    defaultState() {
        return {
            isCollapsed: false,
            header: 'AlphaFold Superposition',
            brand: { accent: 'gray', svg: SuperpositionSvg },
            isHidden: true
        };
    }
    componentDidMount() {
        this.subscribe(this.plugin.managers.structure.hierarchy.behaviors.selection, sel => {
            const superpositionState = PluginCustomState(this.plugin).superpositionState;
            if (superpositionState && superpositionState.alphafold.apiData.cif && superpositionState.alphafold.apiData.cif !== '') {
                this.setState({ isHidden: false });
            }
        });
    }
    rmsdTable() {
        const spData = PluginCustomState(this.plugin).superpositionState;
        if (!spData)
            throw new Error('customState.superpositionState has not been initialized');
        const { activeSegment } = spData;
        const { rmsds } = spData.alphafold;
        return _jsxs("div", { className: 'msp-control-offset', children: [(rmsds.length === 0 || !rmsds[activeSegment - 1]) && _jsx("div", { className: 'msp-flex-row', style: { padding: '5px 0 0 10px' }, children: _jsx("strong", { children: "No overlap found!" }) }), rmsds[activeSegment - 1] && _jsxs("div", { className: 'msp-flex-row', children: [_jsx("div", { style: { width: '40%', borderRight: '1px solid rgb(213 206 196)', padding: '5px 0 0 5px' }, children: _jsx("strong", { children: "Entry" }) }), _jsx("div", { style: { padding: '5px 0 0 5px' }, children: _jsx("strong", { children: "RMSD (\u212B)" }) })] }), rmsds[activeSegment - 1] && rmsds[activeSegment - 1].map((d) => {
                    const details = d.split(':');
                    return details[1] !== '-' ? _jsxs("div", { className: 'msp-flex-row', children: [_jsx("div", { className: 'msp-control-row-label', style: { width: '40%', borderRight: '1px solid rgb(213 206 196)', padding: '5px 0 0 5px' }, children: details[0] }), _jsx("div", { style: { padding: '5px 0 0 5px' }, children: details[1] })] }, d) : null;
                })] });
    }
    renderControls() {
        const superpositionState = PluginCustomState(this.plugin).superpositionState;
        if (!superpositionState)
            throw new Error('customState.superpositionState has not been initialized');
        return _jsxs(_Fragment, { children: [superpositionState.alphafold.ref !== '' && this.rmsdTable(), superpositionState.alphafold.ref === '' && _jsx(AfSuperpositionControls, {})] });
    }
}
export const AlphafoldSuperpositionParams = {
    // alignSequences: PD.Boolean(true, { isEssential: true, description: 'For Chain-based 3D superposition, perform a sequence alignment and use the aligned residue pairs to guide the 3D superposition.' }),
    traceOnly: PD.Boolean(true, { description: 'For Chain- and Uniprot-based 3D superposition, base superposition only on CA (and equivalent) atoms.' })
};
const DefaultAlphafoldSuperpositionOptions = PD.getDefaultValues(AlphafoldSuperpositionParams);
export class AfSuperpositionControls extends PurePluginUIComponent {
    state = {
        isBusy: false,
        canUseDb: true,
        action: undefined,
        options: DefaultAlphafoldSuperpositionOptions
    };
    componentDidMount() {
        this.subscribe(this.plugin.behaviors.state.isBusy, v => {
            this.setState({ isBusy: v });
        });
    }
    get selection() {
        return this.plugin.managers.structure.selection;
    }
    get customState() {
        return PluginCustomState(this.plugin);
    }
    superposeDb = async () => {
        this.setState({ isBusy: true });
        const spData = this.customState.superpositionState;
        if (!spData)
            throw new Error('customState.superpositionState has not been initialized');
        spData.alphafold.traceOnly = this.state.options.traceOnly;
        superposeAf(this.plugin, this.state.options.traceOnly);
    };
    toggleOptions = () => this.setState({ action: this.state.action === 'options' ? void 0 : 'options' });
    superposeByDbMapping() {
        return _jsx(_Fragment, { children: _jsx(Button, { icon: SuperposeChainsSvg, title: 'Superpose AlphaFold structure using intersection of residues from SIFTS UNIPROT mapping.', className: 'msp-btn msp-btn-block', onClick: this.superposeDb, style: { marginTop: '1px', textAlign: 'left' }, disabled: this.state.isBusy, children: "Load AlphaFold structure" }) });
    }
    setOptions = (values) => {
        this.setState({ options: values });
    };
    render() {
        return _jsxs(_Fragment, { children: [_jsx("div", { style: { backgroundColor: '#dce54e', fontWeight: 500, padding: '5px 12px' }, children: "New Feature!" }), _jsx("div", { className: 'msp-help-text', style: { margin: '2px 0' }, children: _jsxs("div", { className: 'msp-help-description', children: [_jsx(Icon, { svg: InfoIconSvg, inline: true }), "Load and superpose AlphaFold structure against representative chains."] }) }), _jsxs("div", { className: 'msp-flex-row', children: [this.state.canUseDb && this.superposeByDbMapping(), _jsx(ToggleButton, { icon: TuneSvg, label: '', title: 'Options', toggle: this.toggleOptions, isSelected: this.state.action === 'options', disabled: this.state.isBusy, style: { flex: '0 0 40px', padding: 0 } })] }), this.state.action === 'options' && _jsx("div", { className: 'msp-control-offset', children: _jsx(ParameterControls, { params: AlphafoldSuperpositionParams, values: this.state.options, onChangeValues: this.setOptions, isDisabled: this.state.isBusy }) })] });
    }
}

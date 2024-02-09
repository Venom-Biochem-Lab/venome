import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { PDBeStructureQualityReport } from 'molstar/lib/extensions/pdbe/structure-quality-report/behavior';
import { StructureQualityReportColorThemeProvider } from 'molstar/lib/extensions/pdbe/structure-quality-report/color';
import { StructureHierarchyManager } from 'molstar/lib/mol-plugin-state/manager/structure/hierarchy';
import { PurePluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { Button } from 'molstar/lib/mol-plugin-ui/controls/common';
import { ArrowDropDownSvg, ArrowRightSvg, Icon } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { StateSelection, StateTransform } from 'molstar/lib/mol-state';
import { PDBeDomainAnnotations } from '../domain-annotations/behavior';
import { DomainAnnotationsColorThemeProvider } from '../domain-annotations/color';
import { PluginCustomState } from '../plugin-custom-state';
import { AnnotationRowControls } from './annotation-row-controls';
import { SymmetryAnnotationControls, isAssemblySymmetryAnnotationApplicable } from './symmetry-annotation-controls';
const _TextsmsOutlined = _jsxs("svg", { width: '24px', height: '24px', viewBox: '0 0 24 24', children: [_jsx("path", { fill: "none", d: "M0 0h24v24H0V0z" }), _jsxs("g", { children: [_jsx("path", { d: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" }), _jsx("path", { d: "M7 9h2v2H7zM11 9h2v2h-2zM15 9h2v2h-2z" })] })] });
export function TextsmsOutlinedSvg() { return _TextsmsOutlined; }
export class AnnotationsComponentControls extends PurePluginUIComponent {
    state = {
        isCollapsed: false,
        validationApplied: false,
        validationOptions: false,
        validationParams: undefined,
        domainsApplied: false,
        domainsOptions: false,
        domainsParams: undefined,
        showSymmetryAnnotation: false,
    };
    componentDidMount() {
        this.subscribe(this.plugin.managers.structure.hierarchy.behaviors.selection, () => {
            this.initOptionParams();
            this.forceUpdate();
        });
        this.subscribe(this.plugin.managers.structure.hierarchy.behaviors.selection, c => this.setState({
            description: StructureHierarchyManager.getSelectedStructuresDescription(this.plugin)
        }));
    }
    initOptionParams = () => {
        const initParams = PluginCustomState(this.plugin).initParams;
        const validationAnnotationCtrl = !!initParams?.validationAnnotation;
        const domainAnnotationCtrl = !!initParams?.domainAnnotation;
        const symmetryAnnotationCtrl = !!initParams?.symmetryAnnotation && isAssemblySymmetryAnnotationApplicable(this.plugin);
        this.setState({ showSymmetryAnnotation: symmetryAnnotationCtrl });
        if ((validationAnnotationCtrl && !this.state.validationParams) || (domainAnnotationCtrl && !this.state.domainsParams)) {
            const structure = this.getStructure()?.data;
            if (structure) {
                const themeDataCtx = { structure };
                if (validationAnnotationCtrl && !this.state.validationParams) {
                    const validationActionsParams = StructureQualityReportColorThemeProvider.getParams(themeDataCtx);
                    if (validationActionsParams) {
                        this.setState({
                            validationParams: {
                                params: validationActionsParams,
                                values: { type: validationActionsParams.type.defaultValue }
                            }
                        });
                    }
                }
                if (domainAnnotationCtrl && !this.state.domainsParams) {
                    const domainActionsParams = DomainAnnotationsColorThemeProvider.getParams(themeDataCtx);
                    if (domainActionsParams) {
                        this.setState({
                            domainsParams: {
                                params: domainActionsParams,
                                values: { type: domainActionsParams.type.defaultValue }
                            }
                        });
                    }
                }
            }
        }
    };
    getStructure = () => {
        const groupRef = StateSelection.findTagInSubtree(this.plugin.state.data.tree, StateTransform.RootRef, 'structure-component-static-polymer');
        return groupRef ? this.plugin.state.data.select(groupRef)[0]?.obj : undefined;
    };
    toggleCollapsed = () => {
        this.setState({ isCollapsed: !this.state.isCollapsed });
    };
    applyAnnotation = (type, visibleState, params) => {
        // Defaults
        let themeName = 'chain-id';
        let themePropsToAdd = PDBeStructureQualityReport;
        let themePropsToRemove = this.state.domainsParams ? PDBeDomainAnnotations : void 0;
        // Set Theme Params
        if (type === 'validation') {
            if (visibleState) {
                themeName = 'pdbe-structure-quality-report';
            }
            this.setState({ validationApplied: visibleState });
            this.setState({ domainsApplied: false });
        }
        else if (type === 'domains') {
            themePropsToAdd = PDBeDomainAnnotations;
            themePropsToRemove = this.state.validationParams ? PDBeStructureQualityReport : void 0;
            if (visibleState)
                themeName = 'pdbe-domain-annotations';
            this.setState({ domainsApplied: visibleState });
            this.setState({ validationApplied: false });
        }
        // Update Tooltip
        if (visibleState && themeName !== 'chain-id') {
            const addTooltipUpdate = this.plugin.state.behaviors.build().to(themePropsToAdd.id).update(themePropsToAdd, (old) => { old.showTooltip = true; });
            this.plugin.runTask(this.plugin.state.behaviors.updateTree(addTooltipUpdate));
            if (themePropsToRemove) {
                const removeTooltipUpdate = this.plugin.state.behaviors.build().to(themePropsToRemove.id).update(themePropsToRemove, (old) => { old.showTooltip = false; });
                this.plugin.runTask(this.plugin.state.behaviors.updateTree(removeTooltipUpdate));
            }
        }
        let polymerGroup;
        const componentGroups = this.plugin.managers.structure.hierarchy.currentComponentGroups;
        componentGroups.forEach((compGrp) => {
            if (compGrp[0].key === 'structure-component-static-polymer')
                polymerGroup = compGrp;
        });
        if (polymerGroup) {
            this.plugin.managers.structure.component.updateRepresentationsTheme(polymerGroup, { color: themeName, colorParams: params ? params : void 0 });
        }
    };
    toggleAnnotation = (type) => {
        if (type === 'validation')
            this.applyAnnotation('validation', !this.state.validationApplied, this.state.validationParams.values);
        if (type === 'domains')
            this.applyAnnotation('domains', !this.state.domainsApplied, this.state.domainsParams.values);
    };
    updateValidationParams = (val) => {
        const updatedParams = { ...this.state.validationParams };
        updatedParams.values = val;
        this.setState({ validationParams: updatedParams });
        if (this.state.validationApplied)
            this.applyAnnotation('validation', this.state.validationApplied, val);
    };
    updateDomainParams = (val) => {
        const updatedParams = { ...this.state.domainsParams };
        updatedParams.values = val;
        this.setState({ domainsParams: updatedParams });
        if (this.state.domainsApplied)
            this.applyAnnotation('domains', this.state.domainsApplied, val);
    };
    render() {
        if (!this.state.validationParams && !this.state.domainsParams && !this.state.showSymmetryAnnotation)
            return _jsx(_Fragment, {});
        const brand = {
            accent: 'green',
            svg: TextsmsOutlinedSvg
        };
        const wrapClass = this.state.isCollapsed
            ? 'msp-transform-wrapper msp-transform-wrapper-collapsed'
            : 'msp-transform-wrapper';
        return _jsxs("div", { className: wrapClass, children: [_jsx("div", { className: 'msp-transform-header', children: _jsxs(Button, { icon: brand ? void 0 : this.state.isCollapsed ? ArrowRightSvg : ArrowDropDownSvg, noOverflow: true, onClick: this.toggleCollapsed, className: brand ? `msp-transform-header-brand msp-transform-header-brand-${brand.accent}` : void 0, title: `Click to ${this.state.isCollapsed ? 'expand' : 'collapse'}`, children: [_jsx(Icon, { svg: brand?.svg, inline: true }), "Annotations", _jsx("small", { style: { margin: '0 6px' }, children: this.state.isCollapsed ? '' : this.state.description })] }) }), !this.state.isCollapsed && _jsxs(_Fragment, { children: [_jsx(AnnotationRowControls, { title: 'Validation', params: this.state.validationParams?.params, values: this.state.validationParams?.values, onChangeValues: this.updateValidationParams, applied: this.state.validationApplied, onChangeApplied: () => this.toggleAnnotation('validation') }), _jsx(AnnotationRowControls, { title: 'Domain Annotations', shortTitle: 'Domains', params: this.state.domainsParams?.params, values: this.state.domainsParams?.values, onChangeValues: this.updateDomainParams, applied: this.state.domainsApplied, onChangeApplied: () => this.toggleAnnotation('domains') }), this.state.showSymmetryAnnotation &&
                            _jsx(SymmetryAnnotationControls, {})] })] });
    }
}

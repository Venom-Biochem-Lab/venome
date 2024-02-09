import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CollapsableControls } from 'molstar/lib/mol-plugin-ui/base';
import { Button } from 'molstar/lib/mol-plugin-ui/controls/common';
import { GetAppSvg } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { ParameterControls } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import { useBehavior } from 'molstar/lib/mol-plugin-ui/hooks/use-behavior';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { superpositionExportHierarchy } from '../superposition-export';
export class SuperpositionModelExportUI extends CollapsableControls {
    defaultState() {
        return {
            header: 'Export Models',
            isCollapsed: true,
            brand: { accent: 'cyan', svg: GetAppSvg }
        };
    }
    renderControls() {
        return _jsx(SuperpositionExportControls, { plugin: this.plugin });
    }
}
const Params = {
    format: PD.Select('cif', [['cif', 'mmCIF'], ['bcif', 'Binary mmCIF']])
};
const DefaultParams = PD.getDefaultValues(Params);
function SuperpositionExportControls({ plugin }) {
    const [params, setParams] = useState(DefaultParams);
    const [exporting, setExporting] = useState(false);
    useBehavior(plugin.managers.structure.hierarchy.behaviors.selection); // triggers UI update
    const isBusy = useBehavior(plugin.behaviors.state.isBusy);
    const hierarchy = plugin.managers.structure.hierarchy.current;
    let label = 'Nothing to Export';
    if (hierarchy.structures.length === 1) {
        label = 'Export';
    }
    if (hierarchy.structures.length > 1) {
        label = 'Export (as ZIP)';
    }
    const onExport = async () => {
        setExporting(true);
        try {
            await superpositionExportHierarchy(plugin, { format: params.format });
        }
        finally {
            setExporting(false);
        }
    };
    return _jsxs(_Fragment, { children: [_jsx(ParameterControls, { params: Params, values: params, onChangeValues: setParams, isDisabled: isBusy || exporting }), _jsx(Button, { onClick: onExport, style: { marginTop: 1 }, disabled: isBusy || hierarchy.structures.length === 0 || exporting, commit: hierarchy.structures.length > 0 ? 'on' : 'off', children: label })] });
}

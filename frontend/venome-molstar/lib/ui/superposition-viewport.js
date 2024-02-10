import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { LociLabels, StateSnapshotViewportControls, SelectionViewportControls } from 'molstar/lib/mol-plugin-ui/controls';
import { BackgroundTaskProgress } from 'molstar/lib/mol-plugin-ui/task';
import { Toasts } from 'molstar/lib/mol-plugin-ui/toast';
import { Viewport, ViewportControls } from 'molstar/lib/mol-plugin-ui/viewport';
export class SuperpostionViewport extends PluginUIComponent {
    render() {
        const VPControls = this.plugin.spec.components?.viewport?.controls || ViewportControls;
        return _jsxs(_Fragment, { children: [_jsx(Viewport, {}), _jsx("div", { className: 'msp-viewport-top-left-controls', children: _jsx(StateSnapshotViewportControls, {}) }), _jsx(SelectionViewportControls, {}), _jsx(VPControls, {}), _jsx(BackgroundTaskProgress, {}), _jsxs("div", { className: 'msp-highlight-toast-wrapper', children: [_jsx(LociLabels, {}), _jsx(Toasts, {})] })] });
    }
}

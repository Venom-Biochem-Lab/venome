import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, IconButton } from 'molstar/lib/mol-plugin-ui/controls/common';
import { MoreHorizSvg, VisibilityOffOutlinedSvg, VisibilityOutlinedSvg } from 'molstar/lib/mol-plugin-ui/controls/icons';
import { ParameterControls } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import React from 'react';
/** UI controls for a single annotation source (row) in Annotations section */
export class AnnotationRowControls extends React.PureComponent {
    state = { applied: false, optionsExpanded: false };
    // componentDidMount() {
    //     this.subscribe(this.plugin.state.events.cell.stateUpdated, e => {
    //         if (State.ObjectEvent.isCell(e, this.pivot.cell)) this.forceUpdate();
    //     });
    // }
    isApplied() {
        return this.props.applied ?? this.state.applied;
    }
    toggleApplied(applied) {
        const newState = applied ?? !this.isApplied();
        if (this.props.applied === undefined) {
            this.setState({ applied: newState });
        }
        this.props.onChangeApplied?.(newState);
    }
    toggleOptions() {
        this.setState(s => ({ optionsExpanded: !s.optionsExpanded }));
    }
    render() {
        if (!this.props.params)
            return null;
        return _jsxs(_Fragment, { children: [_jsxs("div", { className: 'msp-flex-row', children: [_jsx(Button, { noOverflow: true, className: 'msp-control-button-label', title: this.props.title, style: { textAlign: 'left' }, children: this.props.shortTitle ?? this.props.title }), _jsx(IconButton, { onClick: () => this.toggleApplied(), toggleState: false, svg: !this.isApplied() ? VisibilityOffOutlinedSvg : VisibilityOutlinedSvg, title: `Click to ${this.isApplied() ? 'hide' : 'show'} ${this.props.title}`, small: true, className: 'msp-form-control', flex: true }), _jsx(IconButton, { onClick: () => this.toggleOptions(), svg: MoreHorizSvg, title: 'Options', toggleState: this.state.optionsExpanded, className: 'msp-form-control', flex: true })] }), this.state.optionsExpanded &&
                    _jsx("div", { style: { marginBottom: '6px' }, children: _jsx("div", { className: "msp-accent-offset", children: _jsx("div", { className: 'msp-representation-entry', children: this.renderOptions() }) }) })] });
    }
    renderOptions() {
        return _jsx(ParameterControls, { params: this.props.params, onChange: this.props.onChange, values: this.props.values, onChangeValues: this.props.onChangeValues, onEnter: this.props.onEnter });
    }
}

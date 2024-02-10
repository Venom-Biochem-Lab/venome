import { ParameterControlsProps } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import React from 'react';
type AnnotationRowControlsProps<P extends PD.Params> = ParameterControlsProps<P> & {
    shortTitle?: string;
    title: string;
    applied?: boolean;
    onChangeApplied?: (applied: boolean) => void;
};
type AnnotationRowControlsState = {
    applied: boolean;
    optionsExpanded: boolean;
};
/** UI controls for a single annotation source (row) in Annotations section */
export declare class AnnotationRowControls<P extends PD.Params> extends React.PureComponent<AnnotationRowControlsProps<P>, AnnotationRowControlsState> {
    state: {
        applied: boolean;
        optionsExpanded: boolean;
    };
    isApplied(): boolean;
    toggleApplied(applied?: boolean): void;
    toggleOptions(): void;
    render(): import("react/jsx-runtime").JSX.Element | null;
    renderOptions(): import("react/jsx-runtime").JSX.Element;
}
export {};

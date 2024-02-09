import * as React from 'react';
import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
interface ImageControlsState {
    showPreview: boolean;
    isDisabled: boolean;
    imageData?: string;
}
export declare class DownloadScreenshotControls extends PluginUIComponent<{
    close: () => void;
}, ImageControlsState> {
    state: ImageControlsState;
    private download;
    private copy;
    private copyImg;
    componentDidMount(): void;
    componentWillUnmount(): void;
    open: (e: React.ChangeEvent<HTMLInputElement>) => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};

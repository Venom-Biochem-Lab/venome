import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ParameterControls } from 'molstar/lib/mol-plugin-ui/controls/parameters';
import { PluginUIComponent } from 'molstar/lib/mol-plugin-ui/base';
import { ScreenshotPreview } from 'molstar/lib/mol-plugin-ui/controls/screenshot';
import { Button, ToggleButton } from 'molstar/lib/mol-plugin-ui/controls/common';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { useBehavior } from 'molstar/lib/mol-plugin-ui/hooks/use-behavior';
import { GetAppSvg, CopySvg, CropOrginalSvg, CropSvg, CropFreeSvg } from 'molstar/lib/mol-plugin-ui/controls/icons';
export class DownloadScreenshotControls extends PluginUIComponent {
    state = {
        showPreview: true,
        isDisabled: false
    };
    download = () => {
        this.plugin.helpers.viewportScreenshot?.download();
        this.props.close();
    };
    copy = async () => {
        try {
            await this.plugin.helpers.viewportScreenshot?.copyToClipboard();
            PluginCommands.Toast.Show(this.plugin, {
                message: 'Copied to clipboard.',
                title: 'Screenshot',
                timeoutMs: 1500
            });
        }
        catch {
            return this.copyImg();
        }
    };
    copyImg = async () => {
        const src = await this.plugin.helpers.viewportScreenshot?.getImageDataUri();
        this.setState({ imageData: src });
    };
    componentDidMount() {
        this.subscribe(this.plugin.state.data.behaviors.isUpdating, v => {
            this.setState({ isDisabled: v });
        });
    }
    componentWillUnmount() {
        this.setState({ imageData: void 0 });
    }
    open = (e) => {
        if (!e.target.files || !e.target.files[0])
            return;
        PluginCommands.State.Snapshots.OpenFile(this.plugin, { file: e.target.files[0] });
    };
    render() {
        const hasClipboardApi = !!navigator.clipboard?.write;
        return _jsxs("div", { children: [this.state.showPreview && _jsxs("div", { className: 'msp-image-preview', children: [_jsx(ScreenshotPreview, { plugin: this.plugin }), _jsx(CropControls, { plugin: this.plugin })] }), _jsxs("div", { className: 'msp-flex-row', children: [!this.state.imageData && _jsx(Button, { icon: CopySvg, onClick: hasClipboardApi ? this.copy : this.copyImg, disabled: this.state.isDisabled, children: "Copy" }), this.state.imageData && _jsx(Button, { onClick: () => this.setState({ imageData: void 0 }), disabled: this.state.isDisabled, children: "Clear" }), _jsx(Button, { icon: GetAppSvg, onClick: this.download, disabled: this.state.isDisabled, children: "Download" })] }), this.state.imageData && _jsxs("div", { className: 'msp-row msp-copy-image-wrapper', children: [_jsx("div", { children: "Right click below + Copy Image" }), _jsx("img", { src: this.state.imageData, style: { width: '100%', height: 32, display: 'block' } })] }), _jsx(ScreenshotParams, { plugin: this.plugin, isDisabled: this.state.isDisabled })] });
    }
}
function ScreenshotParams({ plugin, isDisabled }) {
    const helper = plugin.helpers.viewportScreenshot;
    const values = useBehavior(helper.behaviors.values);
    return _jsx(ParameterControls, { params: helper.params, values: values, onChangeValues: v => helper.behaviors.values.next(v), isDisabled: isDisabled });
}
function CropControls({ plugin }) {
    const helper = plugin.helpers.viewportScreenshot;
    const cropParams = useBehavior(helper?.behaviors.cropParams);
    useBehavior(helper?.behaviors.relativeCrop);
    if (!helper)
        return null;
    return _jsxs("div", { style: { width: '100%', height: '24px', marginTop: '8px' }, children: [_jsx(ToggleButton, { icon: CropOrginalSvg, title: 'Auto-crop', inline: true, isSelected: cropParams.auto, style: { background: 'transparent', float: 'left', width: 'auto', height: '24px', lineHeight: '24px' }, toggle: () => helper.toggleAutocrop(), label: 'Auto-crop ' + (cropParams.auto ? 'On' : 'Off') }), !cropParams.auto && _jsx(Button, { icon: CropSvg, title: 'Crop', style: { background: 'transparent', float: 'right', height: '24px', lineHeight: '24px', width: '24px', padding: '0' }, onClick: () => helper.autocrop() }), !cropParams.auto && !helper.isFullFrame && _jsx(Button, { icon: CropFreeSvg, title: 'Reset Crop', style: { background: 'transparent', float: 'right', height: '24px', lineHeight: '24px', width: '24px', padding: '0' }, onClick: () => helper.resetCrop() })] });
}

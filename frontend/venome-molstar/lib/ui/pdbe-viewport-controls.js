import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ViewportControls } from 'molstar/lib/mol-plugin-ui/viewport';
import { PluginCustomState } from '../plugin-custom-state';
export class PDBeViewportControls extends ViewportControls {
    isBlack() {
        const bgColor = PluginCustomState(this.plugin).initParams?.bgColor;
        return bgColor !== undefined && bgColor.r === 0 && bgColor.g === 0 && bgColor.b === 0;
    }
    render() {
        const initParams = PluginCustomState(this.plugin).initParams;
        const showPDBeLink = initParams?.moleculeId && initParams?.pdbeLink && !initParams?.superposition;
        const pdbeLinkColor = this.isBlack() ? '#fff' : '#555';
        const pdbeLink = {
            parentStyle: { width: 'auto' },
            bgStyle: { position: 'absolute', height: '27px', width: '54px', marginLeft: '-33px' },
            containerStyle: { position: 'absolute', right: '10px', top: '10px', padding: '3px 3px 3px 18px' },
            style: { display: 'inline-block', fontSize: '14px', color: pdbeLinkColor, borderBottom: 'none', cursor: 'pointer', textDecoration: 'none', position: 'absolute', right: '5px' },
            pdbeImg: {
                src: 'https://www.ebi.ac.uk/pdbe/entry/static/images/logos/PDBe/logo_T_64.png',
                alt: 'PDBe logo',
                style: { height: '12px', width: '12px', border: 0, position: 'absolute', margin: '4px 0 0 -13px' }
            }
        };
        return _jsxs(_Fragment, { children: [showPDBeLink && _jsxs("div", { className: 'msp-viewport-controls-buttons', style: pdbeLink.containerStyle, children: [_jsx("div", { className: 'msp-semi-transparent-background', style: pdbeLink.bgStyle }), _jsxs("a", { className: 'msp-pdbe-link', style: pdbeLink.style, target: "_blank", href: `https://pdbe.org/${initParams.moleculeId}`, children: [_jsx("img", { src: pdbeLink.pdbeImg.src, alt: pdbeLink.pdbeImg.alt, style: pdbeLink.pdbeImg.style }), initParams.moleculeId] })] }), _jsx("div", { style: { position: 'absolute', top: showPDBeLink ? (27 + 4) : 0, right: 0 }, children: super.render() })] });
    }
}

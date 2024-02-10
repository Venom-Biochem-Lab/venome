import { Subject } from 'rxjs';
type OverlayEvents = 'resize' | 'hide';
/** Shows overlay layer with animated PDBe logo */
export declare class LoadingOverlay {
    private readonly target;
    private readonly subjects;
    private readonly overlayHtml;
    private readonly subscriptions;
    constructor(target: HTMLElement, subjects?: {
        readonly [key in OverlayEvents]?: Subject<any>;
    }, overlayHtml?: string);
    private getOverlayParent;
    show(): void;
    hide(): void;
}
export {};

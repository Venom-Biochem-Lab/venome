/// <reference types="react" />
import { CollapsableControls, CollapsableState } from 'molstar/lib/mol-plugin-ui/base';
export declare class SuperpositionModelExportUI extends CollapsableControls<{}, {}> {
    protected defaultState(): CollapsableState;
    protected renderControls(): JSX.Element | null;
}

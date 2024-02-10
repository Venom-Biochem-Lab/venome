import { Model, Structure } from "molstar/lib/mol-model/structure";
import { BuiltInTrajectoryFormat } from "molstar/lib/mol-plugin-state/formats/trajectory";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import Expression from "molstar/lib/mol-script/language/expression";
import { InitParams } from "./spec";
export type SupportedFormats = "mmcif" | "bcif" | "cif" | "pdb" | "sdf";
export type LoadParams = {
    url: string;
    format?: BuiltInTrajectoryFormat;
    assemblyId?: string;
    isHetView?: boolean;
    isBinary?: boolean;
    progressMessage?: string;
};
export type MapParams = {
    em?: MapStyle;
    "2fo-fc"?: MapStyle;
    "fo-fc(+ve)"?: MapStyle;
    "fo-fc(-ve)"?: MapStyle;
};
interface MapStyle {
    opacity?: number;
    wireframe?: boolean;
}
export declare namespace PDBeVolumes {
    function mapParams(defaultParams: any, mapParams?: MapParams, ref?: string | number): any;
    function displayUsibilityMessage(plugin: PluginContext): void;
    function toggle(plugin: PluginContext): void;
}
export declare namespace AlphafoldView {
    function getLociByPLDDT(score: number, contextData: Structure): import("molstar/lib/mol-model/structure/structure/element/loci").Loci;
}
export type LigandQueryParam = {
    label_comp_id_list?: any;
    auth_asym_id?: string;
    struct_asym_id?: string;
    label_comp_id?: string;
    auth_seq_id?: number;
    show_all?: boolean;
};
export declare namespace LigandView {
    function query(ligandViewParams: LigandQueryParam): {
        core: Expression.Expression;
        surroundings: Expression.Expression;
    };
    function branchedQuery(params: any): {
        core: Expression.Expression;
        surroundings: Expression.Expression;
    };
}
export type QueryParam = {
    auth_seq_id?: number;
    entity_id?: string;
    auth_asym_id?: string;
    struct_asym_id?: string;
    residue_number?: number;
    start_residue_number?: number;
    end_residue_number?: number;
    auth_residue_number?: number;
    auth_ins_code_id?: string;
    start_auth_residue_number?: number;
    start_auth_ins_code_id?: string;
    end_auth_residue_number?: number;
    end_auth_ins_code_id?: string;
    atoms?: string[];
    label_comp_id?: string;
    color?: any;
    sideChain?: boolean;
    representation?: string;
    representationColor?: any;
    focus?: boolean;
    tooltip?: string;
    start?: any;
    end?: any;
    atom_id?: number[];
    uniprot_accession?: string;
    uniprot_residue_number?: number;
    start_uniprot_residue_number?: number;
    end_uniprot_residue_number?: number;
};
export declare namespace QueryHelper {
    function getQueryObject(params: QueryParam[], contextData: any): Expression.Expression;
    function getInteractivityLoci(params: any, contextData: any): import("molstar/lib/mol-model/structure/structure/element/loci").Loci;
    function getHetLoci(queryExp: Expression.Expression, contextData: any): import("molstar/lib/mol-model/structure/structure/element/loci").Loci;
}
export interface ModelInfo {
    hetNames: string[];
    carbEntityCount: number;
}
export declare namespace ModelInfo {
    function get(model: Model, structures: any): Promise<ModelInfo>;
}
/** Run `action` with showing a message in the bottom-left corner of the plugin UI */
export declare function runWithProgressMessage(plugin: PluginContext, progressMessage: string | undefined, action: () => any): Promise<void>;
/** Parameters for a request to ModelServer */
export interface ModelServerRequest {
    pdbId: string;
    queryType: "full" | "residueSurroundings" | "atoms";
    queryParams?: Record<string, any>;
}
/** Return URL for a ModelServer request.
 * If `queryType` is 'full' and `lowPrecisionCoords` is false, return URL of the static file instead (updated mmCIF or bCIF). */
export declare function getStructureUrl(initParams: InitParams, request: ModelServerRequest): string;
/** Create a copy of object `object`, fill in missing/undefined keys using `defaults` */
export declare function addDefaults<T extends {}>(object: Partial<T> | undefined, defaults: T): T;
export {};

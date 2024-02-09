import { Bond } from "molstar/lib/mol-model/structure";
import { Loci } from "molstar/lib/mol-model/loci";
export type EventDetail = {
    models?: string[];
    entity_id?: string;
    label_asym_id?: string;
    asym_id?: string;
    auth_asym_id?: string;
    unp_accession?: string;
    unp_seq_id?: number;
    seq_id?: number;
    auth_seq_id?: number;
    ins_code?: string;
    comp_id?: string;
    atom_id?: string[];
    alt_id?: string;
    micro_het_comp_ids?: string[];
    seq_id_begin?: number;
    seq_id_end?: number;
    button?: number;
    modifiers?: any;
};
type LabelGranularity = "element" | "conformation" | "residue" | "chain" | "structure";
export declare function lociDetails(loci: Loci): EventDetail | undefined;
export declare function bondLabel(bond: Bond.Location, granularity: LabelGranularity): any;
export declare function _bundleLabel(bundle: Loci.Bundle<any>, granularity: LabelGranularity): EventDetail | (EventDetail | undefined)[];
export {};
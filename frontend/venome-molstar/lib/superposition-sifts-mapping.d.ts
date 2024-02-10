import { MinimizeRmsd } from "molstar/lib/mol-math/linear-algebra/3d/minimize-rmsd";
import { ElementIndex, ResidueIndex } from "molstar/lib/mol-model/structure/model/indexing";
import { StructureElement } from "molstar/lib/mol-model/structure/structure/element";
import { Structure } from "molstar/lib/mol-model/structure";
import { Unit } from "molstar/lib/mol-model/structure/structure/unit";
export interface AlignmentResultEntry {
    transform: MinimizeRmsd.Result;
    pivot: number;
    other: number;
}
export interface AlignmentResult {
    entries: AlignmentResultEntry[];
    zeroOverlapPairs: [number, number][];
    failedPairs: [number, number][];
}
type IncludeResidueTest = (traceElementOrFirstAtom: StructureElement.Location<Unit.Atomic>, residueIndex: ResidueIndex, startIndex: ElementIndex, endIndex: ElementIndex) => boolean;
export declare function alignAndSuperposeWithSIFTSMapping(structures: Structure[], options?: {
    traceOnly?: boolean;
    includeResidueTest?: IncludeResidueTest;
    applyTestIndex?: number[];
}): AlignmentResult;
export {};

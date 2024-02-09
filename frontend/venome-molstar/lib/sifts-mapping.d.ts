import { Model } from "molstar/lib/mol-model/structure";
import { StructureElement } from "molstar/lib/mol-model/structure/structure";
import { CustomModelProperty } from "molstar/lib/mol-model-props/common/custom-model-property";
export { SIFTSMapping as SIFTSMapping };
export interface SIFTSMappingMapping {
    readonly dbName: string[];
    readonly accession: string[];
    readonly num: string[];
    readonly residue: string[];
}
declare namespace SIFTSMapping {
    const Provider: CustomModelProperty.Provider<{}, SIFTSMappingMapping>;
    function isAvailable(model: Model): boolean;
    function getKey(loc: StructureElement.Location): string;
    function getLabel(loc: StructureElement.Location): string | undefined;
}

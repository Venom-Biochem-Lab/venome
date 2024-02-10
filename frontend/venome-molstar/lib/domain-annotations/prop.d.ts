import { Model, IndexedCustomProperty } from "molstar/lib/mol-model/structure";
import { StructureElement, Structure } from "molstar/lib/mol-model/structure/structure";
import { PropertyWrapper } from "molstar/lib/mol-model-props/common/wrapper";
import { CustomModelProperty } from "molstar/lib/mol-model-props/common/custom-model-property";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { CustomProperty } from "molstar/lib/mol-model-props/common/custom-property";
export { DomainAnnotations };
type DomainAnnotations = PropertyWrapper<{
    domains: IndexedCustomProperty.Residue<string[]>;
    domainNames: string[][];
    domainTypes: string[];
} | undefined>;
declare namespace DomainAnnotations {
    const DefaultServerUrl = "https://www.ebi.ac.uk/pdbe/api/mappings";
    function getEntryUrl(pdbId: string, serverUrl: string): string;
    function isApplicable(model?: Model): boolean;
    function fromJson(model: Model, data: any): {
        info: PropertyWrapper.Info;
        data: {
            domains: IndexedCustomProperty.Residue<string[]>;
            domainNames: string[][];
            domainTypes: string[];
        } | undefined;
    };
    function fromServer(ctx: CustomProperty.Context, model: Model, props: DomainAnnotationsProps): Promise<CustomProperty.Data<DomainAnnotations>>;
    function getDomains(e: StructureElement.Location): string[];
    function getDomainTypes(structure?: Structure): string[];
    function getDomainNames(structure?: Structure): string[] | string[][];
}
export declare const DomainAnnotationsParams: {
    serverUrl: PD.Text<string>;
};
export type DomainAnnotationsParams = typeof DomainAnnotationsParams;
export type DomainAnnotationsProps = PD.Values<DomainAnnotationsParams>;
export declare const DomainAnnotationsProvider: CustomModelProperty.Provider<DomainAnnotationsParams, DomainAnnotations>;

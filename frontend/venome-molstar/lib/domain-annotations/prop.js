import { Model, Unit, IndexedCustomProperty, } from "molstar/lib/mol-model/structure";
import { PropertyWrapper } from "molstar/lib/mol-model-props/common/wrapper";
import { CustomModelProperty } from "molstar/lib/mol-model-props/common/custom-model-property";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { arraySetAdd } from "molstar/lib/mol-util/array";
import { Asset } from "molstar/lib/mol-util/assets";
import { CustomPropertyDescriptor } from "molstar/lib/mol-model/custom-property";
export { DomainAnnotations };
var DomainAnnotations;
(function (DomainAnnotations) {
    DomainAnnotations.DefaultServerUrl = "https://www.ebi.ac.uk/pdbe/api/mappings";
    function getEntryUrl(pdbId, serverUrl) {
        return `${serverUrl}/${pdbId.toLowerCase()}`;
    }
    DomainAnnotations.getEntryUrl = getEntryUrl;
    function isApplicable(model) {
        return !!model && Model.hasPdbId(model);
    }
    DomainAnnotations.isApplicable = isApplicable;
    function fromJson(model, data) {
        const info = PropertyWrapper.createInfo();
        const domainMap = createdomainMapFromJson(model, data);
        return { info, data: domainMap };
    }
    DomainAnnotations.fromJson = fromJson;
    async function fromServer(ctx, model, props) {
        const url = Asset.getUrlAsset(ctx.assetManager, getEntryUrl(model.entryId, props.serverUrl));
        const json = await ctx.assetManager
            .resolve(url, "json")
            .runInContext(ctx.runtime);
        const data = json.data[model.entryId.toLowerCase()];
        if (!data)
            throw new Error("missing data");
        return { value: fromJson(model, data), assets: [json] };
    }
    DomainAnnotations.fromServer = fromServer;
    const _emptyArray = [];
    function getDomains(e) {
        if (!Unit.isAtomic(e.unit))
            return _emptyArray;
        const prop = DomainAnnotationsProvider.get(e.unit.model).value;
        if (!prop || !prop.data)
            return _emptyArray;
        const rI = e.unit.residueIndex[e.element];
        return prop.data.domains.has(rI)
            ? prop.data.domains.get(rI)
            : _emptyArray;
    }
    DomainAnnotations.getDomains = getDomains;
    function getDomainTypes(structure) {
        if (!structure)
            return _emptyArray;
        const prop = DomainAnnotationsProvider.get(structure.models[0]).value;
        if (!prop || !prop.data)
            return _emptyArray;
        return prop.data.domainTypes;
    }
    DomainAnnotations.getDomainTypes = getDomainTypes;
    function getDomainNames(structure) {
        if (!structure)
            return _emptyArray;
        const prop = DomainAnnotationsProvider.get(structure.models[0]).value;
        if (!prop || !prop.data)
            return _emptyArray;
        return prop.data.domainNames;
    }
    DomainAnnotations.getDomainNames = getDomainNames;
})(DomainAnnotations || (DomainAnnotations = {}));
export const DomainAnnotationsParams = {
    serverUrl: PD.Text(DomainAnnotations.DefaultServerUrl, {
        description: "JSON API Server URL",
    }),
};
export const DomainAnnotationsProvider = CustomModelProperty.createProvider({
    label: "Domain annotations",
    descriptor: CustomPropertyDescriptor({
        name: "domain_annotations",
    }),
    type: "static",
    defaultParams: DomainAnnotationsParams,
    getParams: (data) => DomainAnnotationsParams,
    isApplicable: (data) => DomainAnnotations.isApplicable(data),
    obtain: async (ctx, data, props) => {
        const p = { ...PD.getDefaultValues(DomainAnnotationsParams), ...props };
        return await DomainAnnotations.fromServer(ctx, data, p);
    },
});
function findChainLabel(map, label_entity_id, label_asym_id) {
    const entityIndex = map.entities.getEntityIndex;
    const eI = entityIndex(label_entity_id);
    if (eI < 0 || !map.entity_index_label_asym_id.has(eI))
        return -1;
    const cm = map.entity_index_label_asym_id.get(eI);
    if (!cm)
        return -1;
    return cm.has(label_asym_id) ? cm.get(label_asym_id) : -1;
}
function findResidue(modelData, map, label_entity_id, label_asym_id, label_seq_id) {
    const cI = findChainLabel(map, label_entity_id, label_asym_id);
    if (cI < 0)
        return -1;
    const rm = map.chain_index_auth_seq_id.get(cI);
    return rm.has(label_seq_id) ? rm.get(label_seq_id) : -1;
}
function createdomainMapFromJson(modelData, data) {
    const domainTypes = [];
    const domainNames = [];
    const ret = new Map();
    const defaultDomains = ["Pfam", "InterPro", "CATH", "SCOP"];
    for (const db_name of Object.keys(data)) {
        if (defaultDomains.indexOf(db_name) === -1)
            continue;
        const tempDomains = [];
        domainTypes.push(db_name);
        const db = data[db_name];
        for (const db_code of Object.keys(db)) {
            const domain = db[db_code];
            for (const map of domain.mappings) {
                arraySetAdd(tempDomains, domain.identifier);
                const indexData = modelData.atomicHierarchy.index;
                const indexMap = indexData.map;
                for (let i = map.start.residue_number; i <= map.end.residue_number; i++) {
                    const seq_id = i;
                    const idx = findResidue(modelData, indexMap, map.entity_id + "", map.chain_id, seq_id);
                    let addVal = [domain.identifier];
                    const prevVal = ret.get(idx);
                    if (prevVal) {
                        prevVal.push(domain.identifier);
                        addVal = prevVal;
                    }
                    ret.set(idx, addVal);
                }
            }
        }
        domainNames.push(tempDomains);
    }
    return {
        domains: IndexedCustomProperty.fromResidueMap(ret),
        domainNames,
        domainTypes,
    };
}

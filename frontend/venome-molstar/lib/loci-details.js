import { Unit, StructureElement, StructureProperties as Props, } from "molstar/lib/mol-model/structure";
import { OrderedSet } from "molstar/lib/mol-data/int";
import { SIFTSMapping as BestDatabaseSequenceMappingProp } from "molstar/lib/mol-model-props/sequence/sifts-mapping";
export function lociDetails(loci) {
    switch (loci.kind) {
        case "structure-loci":
            return {
                models: loci.structure.models
                    .map((m) => m.entry)
                    .filter((l) => !!l),
            };
        case "element-loci":
            return structureElementStatsDetail(StructureElement.Stats.ofLoci(loci));
        case "bond-loci":
            const bond = loci.bonds[0];
            return bond ? bondLabel(bond, "element") : "";
        default:
            return void 0;
    }
}
function structureElementStatsDetail(stats) {
    const { chainCount, residueCount, elementCount } = stats;
    if (elementCount === 1 && residueCount === 0 && chainCount === 0) {
        return getElementDetails(stats.firstElementLoc, "element");
    }
    else if (elementCount === 0 && residueCount === 1 && chainCount === 0) {
        return getElementDetails(stats.firstResidueLoc, "residue");
    }
    else {
        return void 0;
    }
}
function getElementDetails(location, granularity = "element") {
    const basicDetails = {};
    let entry = location.unit.model.entry;
    if (entry.length > 30)
        entry = entry.substr(0, 27) + "\u2026"; // ellipsis
    basicDetails["entry_id"] = entry; // entry
    if (granularity !== "structure") {
        basicDetails["model"] = location.unit.model.modelNum; // model
        basicDetails["instance"] = location.unit.conformation.operator.name; // instance
    }
    let elementDetails;
    if (Unit.isAtomic(location.unit)) {
        elementDetails = atomicElementDetails(location, granularity);
    }
    else if (Unit.isCoarse(location.unit)) {
        elementDetails = coarseElementDetails(location, granularity);
    }
    return { ...basicDetails, ...elementDetails };
}
function atomicElementDetails(location, granularity) {
    const elementDetails = {
        entity_id: Props.chain.label_entity_id(location),
        label_asym_id: Props.chain.label_asym_id(location),
        auth_asym_id: Props.chain.auth_asym_id(location),
        unp_accession: undefined,
        unp_seq_id: undefined,
        seq_id: Props.residue.label_seq_id(location),
        auth_seq_id: Props.residue.auth_seq_id(location),
        ins_code: Props.residue.pdbx_PDB_ins_code(location),
        comp_id: Props.atom.label_comp_id(location),
        atom_id: [Props.atom.label_atom_id(location)],
        alt_id: Props.atom.label_alt_id(location),
    };
    const unpLabel = BestDatabaseSequenceMappingProp.getLabel(location);
    if (unpLabel) {
        const unpLabelDetails = unpLabel.split(" ");
        if (unpLabelDetails[0] === "UNP") {
            elementDetails.unp_accession = unpLabelDetails[1];
            elementDetails.unp_seq_id = +unpLabelDetails[2];
        }
    }
    const microHetCompIds = Props.residue.microheterogeneityCompIds(location);
    elementDetails["micro_het_comp_ids"] =
        granularity === "residue" && microHetCompIds.length > 1
            ? microHetCompIds
            : [elementDetails["comp_id"]];
    return elementDetails;
}
function coarseElementDetails(location, granularity) {
    const elementDetails = {
        asym_id: Props.coarse.asym_id(location),
        seq_id_begin: Props.coarse.seq_id_begin(location),
        seq_id_end: Props.coarse.seq_id_end(location),
    };
    if (granularity === "residue") {
        if (elementDetails.seq_id_begin === elementDetails.seq_id_end) {
            const entityIndex = Props.coarse.entityKey(location);
            const seq = location.unit.model.sequence.byEntityKey[entityIndex];
            elementDetails["comp_id"] = seq.sequence.compId.value(elementDetails.seq_id_begin - 1); // 1-indexed
        }
    }
    return elementDetails;
}
export function bondLabel(bond, granularity) {
    return _bundleLabel({
        loci: [
            StructureElement.Loci(bond.aStructure, [
                {
                    unit: bond.aUnit,
                    indices: OrderedSet.ofSingleton(bond.aIndex),
                },
            ]),
            StructureElement.Loci(bond.bStructure, [
                {
                    unit: bond.bUnit,
                    indices: OrderedSet.ofSingleton(bond.bIndex),
                },
            ]),
        ],
    }, granularity);
}
export function _bundleLabel(bundle, granularity) {
    let isSingleElements = true;
    for (const l of bundle.loci) {
        if (!StructureElement.Loci.is(l) ||
            StructureElement.Loci.size(l) !== 1) {
            isSingleElements = false;
            break;
        }
    }
    if (isSingleElements) {
        const locations = bundle.loci.map((l) => {
            const { unit, indices } = l.elements[0];
            return StructureElement.Location.create(l.structure, unit, unit.elements[OrderedSet.start(indices)]);
        });
        const elementDetailsArr = locations.map((l) => getElementDetails(l, granularity));
        const atomIds = [
            elementDetailsArr[0].atom_id[0],
            elementDetailsArr[1].atom_id[0],
        ];
        const elementDetails = elementDetailsArr[0];
        elementDetails["atom_id"] = atomIds;
        return elementDetails;
    }
    else {
        const elementDetails = bundle.loci.map((l) => lociDetails(l));
        return elementDetails;
    }
}

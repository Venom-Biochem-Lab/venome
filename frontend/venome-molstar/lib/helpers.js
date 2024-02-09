import { QualityAssessment } from "molstar/lib/extensions/model-archive/quality-assessment/prop";
import { Queries, QueryContext, StructureProperties, StructureSelection, } from "molstar/lib/mol-model/structure";
import { StructureQuery } from "molstar/lib/mol-model/structure/query/query";
import { CreateVolumeStreamingInfo } from "molstar/lib/mol-plugin/behavior/dynamic/volume-streaming/transformers";
import { PluginCommands } from "molstar/lib/mol-plugin/commands";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
import { compile } from "molstar/lib/mol-script/runtime/query/compiler";
import { StateSelection } from "molstar/lib/mol-state";
import { Task } from "molstar/lib/mol-task";
import { SIFTSMapping } from "./sifts-mapping";
export var PDBeVolumes;
(function (PDBeVolumes) {
    function mapParams(defaultParams, mapParams, ref) {
        const pdbeParams = { ...defaultParams };
        pdbeParams.options.behaviorRef =
            "volume-streaming" +
                "" +
                Math.floor(Math.random() * Math.floor(100));
        pdbeParams.options.emContourProvider = "pdbe";
        pdbeParams.options.serverUrl =
            "https://www.ebi.ac.uk/pdbe/volume-server";
        const MAIN_MAP_DEFAULTS = { opacity: 0.49, wireframe: false };
        const DIFF_MAP_DEFAULTS = { opacity: 0.3, wireframe: true };
        pdbeParams.options.channelParams["em"] = addDefaults(mapParams?.["em"], MAIN_MAP_DEFAULTS);
        pdbeParams.options.channelParams["2fo-fc"] = addDefaults(mapParams?.["2fo-fc"], MAIN_MAP_DEFAULTS);
        pdbeParams.options.channelParams["fo-fc(+ve)"] = addDefaults(mapParams?.["fo-fc(+ve)"], DIFF_MAP_DEFAULTS);
        pdbeParams.options.channelParams["fo-fc(-ve)"] = addDefaults(mapParams?.["fo-fc(-ve)"], DIFF_MAP_DEFAULTS);
        return pdbeParams;
    }
    PDBeVolumes.mapParams = mapParams;
    function displayUsibilityMessage(plugin) {
        PluginCommands.Toast.Show(plugin, {
            title: "Volume",
            message: "Streaming enabled, click on a residue or an atom to view the data.",
            key: "toast-1",
            timeoutMs: 7000,
        });
    }
    PDBeVolumes.displayUsibilityMessage = displayUsibilityMessage;
    function toggle(plugin) {
        const state = plugin.state.data;
        const streamingState = state.select(StateSelection.Generators.ofTransformer(CreateVolumeStreamingInfo))[0];
        if (streamingState) {
            PluginCommands.State.ToggleVisibility(plugin, {
                state: state,
                ref: streamingState.transform.ref,
            });
            return;
        }
    }
    PDBeVolumes.toggle = toggle;
})(PDBeVolumes || (PDBeVolumes = {}));
export var AlphafoldView;
(function (AlphafoldView) {
    function getLociByPLDDT(score, contextData) {
        const queryExp = MS.struct.modifier.union([
            MS.struct.modifier.wholeResidues([
                MS.struct.modifier.union([
                    MS.struct.generator.atomGroups({
                        "chain-test": MS.core.rel.eq([
                            MS.ammp("objectPrimitive"),
                            "atomistic",
                        ]),
                        "residue-test": MS.core.rel.gr([
                            QualityAssessment.symbols.pLDDT.symbol(),
                            score,
                        ]),
                    }),
                ]),
            ]),
        ]);
        const query = compile(queryExp);
        const sel = query(new QueryContext(contextData));
        return StructureSelection.toLociWithSourceUnits(sel);
    }
    AlphafoldView.getLociByPLDDT = getLociByPLDDT;
})(AlphafoldView || (AlphafoldView = {}));
export var LigandView;
(function (LigandView) {
    function query(ligandViewParams) {
        const atomGroupsParams = {
            "group-by": MS.core.str.concat([
                MS.struct.atomProperty.core.operatorName(),
                MS.struct.atomProperty.macromolecular.residueKey(),
            ]),
        };
        // Residue Param
        let residueParam;
        if (ligandViewParams.auth_seq_id !== undefined) {
            residueParam = MS.core.rel.eq([
                MS.struct.atomProperty.macromolecular.auth_seq_id(),
                ligandViewParams.auth_seq_id,
            ]);
        }
        else if (ligandViewParams.label_comp_id) {
            residueParam = MS.core.rel.eq([
                MS.struct.atomProperty.macromolecular.label_comp_id(),
                ligandViewParams.label_comp_id,
            ]);
        }
        if (residueParam)
            atomGroupsParams["residue-test"] = residueParam;
        // Chain Param
        if (ligandViewParams.auth_asym_id) {
            atomGroupsParams["chain-test"] = MS.core.rel.eq([
                MS.struct.atomProperty.macromolecular.auth_asym_id(),
                ligandViewParams.auth_asym_id,
            ]);
        }
        else if (ligandViewParams.struct_asym_id) {
            atomGroupsParams["chain-test"] = MS.core.rel.eq([
                MS.struct.atomProperty.macromolecular.label_asym_id(),
                ligandViewParams.struct_asym_id,
            ]);
        }
        // Construct core query
        const core = ligandViewParams.show_all
            ? MS.struct.generator.atomGroups(atomGroupsParams)
            : MS.struct.filter.first([
                MS.struct.generator.atomGroups(atomGroupsParams),
            ]);
        // Construct surroundings query
        const surroundings = MS.struct.modifier.includeSurroundings({
            0: core,
            radius: 5,
            "as-whole-residues": true,
        });
        return {
            core,
            surroundings,
        };
    }
    LigandView.query = query;
    function branchedQuery(params) {
        const entityObjArray = [];
        params.atom_site.forEach((param) => {
            const qEntities = {
                "group-by": MS.core.str.concat([
                    MS.struct.atomProperty.core.operatorName(),
                    MS.struct.atomProperty.macromolecular.residueKey(),
                ]),
                "residue-test": MS.core.rel.eq([
                    MS.struct.atomProperty.macromolecular.auth_seq_id(),
                    param.auth_seq_id,
                ]),
            };
            entityObjArray.push(qEntities);
        });
        const atmGroupsQueries = [];
        entityObjArray.forEach((entityObj) => {
            atmGroupsQueries.push(MS.struct.generator.atomGroups(entityObj));
        });
        const core = MS.struct.modifier.union([
            atmGroupsQueries.length === 1
                ? atmGroupsQueries[0]
                : // Need to union before merge for fast performance
                    MS.struct.combinator.merge(atmGroupsQueries.map((q) => MS.struct.modifier.union([q]))),
        ]);
        // Construct surroundings query
        const surroundings = MS.struct.modifier.includeSurroundings({
            0: core,
            radius: 5,
            "as-whole-residues": true,
        });
        return {
            core,
            surroundings,
        };
    }
    LigandView.branchedQuery = branchedQuery;
})(LigandView || (LigandView = {}));
export var QueryHelper;
(function (QueryHelper) {
    function getQueryObject(params, contextData) {
        const selections = [];
        let siftMappings;
        let currentAccession;
        params.forEach((param) => {
            const selection = {};
            // entity
            if (param.entity_id)
                selection["entityTest"] = (l) => StructureProperties.entity.id(l.element) ===
                    param.entity_id;
            // chain
            if (param.struct_asym_id) {
                selection["chainTest"] = (l) => StructureProperties.chain.label_asym_id(l.element) ===
                    param.struct_asym_id;
            }
            else if (param.auth_asym_id) {
                selection["chainTest"] = (l) => StructureProperties.chain.auth_asym_id(l.element) ===
                    param.auth_asym_id;
            }
            // residues
            if (param.label_comp_id) {
                selection["residueTest"] = (l) => StructureProperties.atom.label_comp_id(l.element) ===
                    param.label_comp_id;
            }
            else if (param.uniprot_accession &&
                param.uniprot_residue_number !== undefined) {
                selection["residueTest"] = (l) => {
                    if (!siftMappings ||
                        currentAccession !== param.uniprot_accession) {
                        siftMappings = SIFTSMapping.Provider.get(contextData.models[0]).value;
                        currentAccession = param.uniprot_accession;
                    }
                    const rI = StructureProperties.residue.key(l.element);
                    return (!!siftMappings &&
                        param.uniprot_accession ===
                            siftMappings.accession[rI] &&
                        param.uniprot_residue_number === +siftMappings.num[rI]);
                };
            }
            else if (param.uniprot_accession &&
                param.start_uniprot_residue_number !== undefined &&
                param.end_uniprot_residue_number !== undefined) {
                selection["residueTest"] = (l) => {
                    if (!siftMappings ||
                        currentAccession !== param.uniprot_accession) {
                        siftMappings = SIFTSMapping.Provider.get(contextData.models[0]).value;
                        currentAccession = param.uniprot_accession;
                    }
                    const rI = StructureProperties.residue.key(l.element);
                    return (!!siftMappings &&
                        param.uniprot_accession ===
                            siftMappings.accession[rI] &&
                        param.start_uniprot_residue_number <=
                            +siftMappings.num[rI] &&
                        param.end_uniprot_residue_number >=
                            +siftMappings.num[rI]);
                };
            }
            else if (param.residue_number !== undefined) {
                selection["residueTest"] = (l) => StructureProperties.residue.label_seq_id(l.element) ===
                    param.residue_number;
            }
            else if (param.start_residue_number !== undefined &&
                param.end_residue_number !== undefined &&
                param.end_residue_number > param.start_residue_number) {
                selection["residueTest"] = (l) => {
                    const labelSeqId = StructureProperties.residue.label_seq_id(l.element);
                    return (labelSeqId >= param.start_residue_number &&
                        labelSeqId <= param.end_residue_number);
                };
            }
            else if (param.start_residue_number !== undefined &&
                param.end_residue_number !== undefined &&
                param.end_residue_number === param.start_residue_number) {
                selection["residueTest"] = (l) => StructureProperties.residue.label_seq_id(l.element) ===
                    param.start_residue_number;
            }
            else if (param.auth_seq_id !== undefined) {
                selection["residueTest"] = (l) => StructureProperties.residue.auth_seq_id(l.element) ===
                    param.auth_seq_id;
            }
            else if (param.auth_residue_number !== undefined &&
                !param.auth_ins_code_id) {
                selection["residueTest"] = (l) => StructureProperties.residue.auth_seq_id(l.element) ===
                    param.auth_residue_number;
            }
            else if (param.auth_residue_number !== undefined &&
                param.auth_ins_code_id) {
                selection["residueTest"] = (l) => StructureProperties.residue.auth_seq_id(l.element) ===
                    param.auth_residue_number;
            }
            else if (param.start_auth_residue_number !== undefined &&
                param.end_auth_residue_number !== undefined &&
                param.end_auth_residue_number > param.start_auth_residue_number) {
                selection["residueTest"] = (l) => {
                    const authSeqId = StructureProperties.residue.auth_seq_id(l.element);
                    return (authSeqId >= param.start_auth_residue_number &&
                        authSeqId <= param.end_auth_residue_number);
                };
            }
            else if (param.start_auth_residue_number !== undefined &&
                param.end_auth_residue_number !== undefined &&
                param.end_auth_residue_number ===
                    param.start_auth_residue_number) {
                selection["residueTest"] = (l) => StructureProperties.residue.auth_seq_id(l.element) ===
                    param.start_auth_residue_number;
            }
            // atoms
            if (param.atoms) {
                selection["atomTest"] = (l) => param.atoms.includes(StructureProperties.atom.label_atom_id(l.element));
            }
            if (param.atom_id) {
                selection["atomTest"] = (l) => param.atom_id.includes(StructureProperties.atom.id(l.element));
            }
            selections.push(selection);
        });
        const atmGroupsQueries = [];
        selections.forEach((selection) => {
            atmGroupsQueries.push(Queries.generators.atoms(selection));
        });
        return Queries.combinators.merge(atmGroupsQueries);
    }
    QueryHelper.getQueryObject = getQueryObject;
    function getInteractivityLoci(params, contextData) {
        const sel = StructureQuery.run(QueryHelper.getQueryObject(params, contextData), contextData);
        return StructureSelection.toLociWithSourceUnits(sel);
    }
    QueryHelper.getInteractivityLoci = getInteractivityLoci;
    function getHetLoci(queryExp, contextData) {
        const query = compile(queryExp);
        const sel = query(new QueryContext(contextData));
        return StructureSelection.toLociWithSourceUnits(sel);
    }
    QueryHelper.getHetLoci = getHetLoci;
})(QueryHelper || (QueryHelper = {}));
export var ModelInfo;
(function (ModelInfo) {
    async function get(model, structures) {
        const { _rowCount: residueCount } = model.atomicHierarchy.residues;
        const { offsets: residueOffsets } = model.atomicHierarchy.residueAtomSegments;
        const chainIndex = model.atomicHierarchy.chainAtomSegments.index;
        const hetNames = [];
        let carbEntityCount = 0;
        for (let rI = 0; rI < residueCount; rI++) {
            const cI = chainIndex[residueOffsets[rI]];
            const eI = model.atomicHierarchy.index.getEntityFromChain(cI);
            const entityType = model.entities.data.type.value(eI);
            if (entityType !== "non-polymer" && entityType !== "branched")
                continue;
            // const comp_id = model.atomicHierarchy.atoms.label_comp_id.value(rI);
            const comp_id = model.atomicHierarchy.atoms.label_comp_id.value(residueOffsets[rI]);
            if (entityType === "branched") {
                carbEntityCount++;
            }
            else {
                if (hetNames.indexOf(comp_id) === -1)
                    hetNames.push(comp_id);
            }
        }
        return {
            hetNames,
            carbEntityCount,
        };
    }
    ModelInfo.get = get;
})(ModelInfo || (ModelInfo = {}));
/** Run `action` with showing a message in the bottom-left corner of the plugin UI */
export async function runWithProgressMessage(plugin, progressMessage, action) {
    const task = Task.create(progressMessage ?? "Task", async (ctx) => {
        let done = false;
        try {
            if (progressMessage) {
                setTimeout(() => {
                    if (!done)
                        ctx.update(progressMessage);
                }, 1000); // Delay the first update to force showing message in UI
            }
            await action();
        }
        finally {
            done = true;
        }
    });
    await plugin.runTask(task);
}
/** Return URL for a ModelServer request.
 * If `queryType` is 'full' and `lowPrecisionCoords` is false, return URL of the static file instead (updated mmCIF or bCIF). */
export function getStructureUrl(initParams, request) {
    const pdbeUrl = initParams.pdbeUrl.replace(/\/$/, ""); // without trailing slash
    const useStaticFile = request.queryType === "full" && !initParams.lowPrecisionCoords;
    if (useStaticFile) {
        const suffix = initParams.encoding === "bcif" ? ".bcif" : "_updated.cif";
        return `${pdbeUrl}/entry-files/download/${request.pdbId}${suffix}`;
    }
    else {
        const queryParams = {
            ...request.queryParams,
            encoding: initParams.encoding,
            lowPrecisionCoords: initParams.lowPrecisionCoords ? 1 : undefined,
        };
        const queryString = Object.entries(queryParams)
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        const url = `${pdbeUrl}/model-server/v1/${request.pdbId}/${request.queryType}`;
        return queryString !== "" ? `${url}?${queryString}` : url;
    }
}
/** Create a copy of object `object`, fill in missing/undefined keys using `defaults` */
export function addDefaults(object, defaults) {
    const result = { ...object };
    for (const key in defaults) {
        result[key] ??= defaults[key];
    }
    return result;
}

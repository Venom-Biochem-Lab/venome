import { StructureElement } from "molstar/lib/mol-model/structure";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { StructureComponentRef, StructureRef } from "molstar/lib/mol-plugin-state/manager/structure/hierarchy-state";
export declare function applyAFTransparency(plugin: PluginContext, structure: Readonly<StructureRef>, transparency: number, pLDDT?: number): Promise<void>;
export declare function setStructureTransparency(plugin: PluginContext, components: StructureComponentRef[], value: number, loci: StructureElement.Loci, types?: string[]): Promise<void>;
export declare function clearStructureTransparency(plugin: PluginContext, components: StructureComponentRef[], types?: string[]): Promise<void>;

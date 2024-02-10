import { PluginContext } from "molstar/lib/mol-plugin/context";
import { Subject } from "rxjs";
import { ClusterMember } from "./plugin-custom-state";
export declare function initSuperposition(plugin: PluginContext, completeSubject?: Subject<boolean>): Promise<void>;
export declare function loadAfStructure(plugin: PluginContext): Promise<string | false>;
export declare function superposeAf(plugin: PluginContext, traceOnly: boolean, segmentIndex?: number): Promise<true | undefined>;
export declare function renderSuperposition(plugin: PluginContext, segmentIndex: number, entryList: ClusterMember[]): Promise<void>;

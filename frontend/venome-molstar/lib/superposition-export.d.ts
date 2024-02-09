import { PluginContext } from "molstar/lib/mol-plugin/context";
export declare function superpositionExportHierarchy(plugin: PluginContext, options?: {
    format?: "cif" | "bcif";
}): Promise<void>;

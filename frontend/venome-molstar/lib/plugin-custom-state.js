/** Access `plugin.customState` only through this function to get proper typing.
 * Supports getting and setting properties. */
export function PluginCustomState(plugin) {
    return (plugin.customState ??= {});
}

import { OrderedSet } from "molstar/lib/mol-data/int";
import { SIFTSMapping as BestDatabaseSequenceMappingProp } from "./sifts-mapping";
import { SIFTSMappingColorThemeProvider } from "molstar/lib/mol-model-props/sequence/themes/sifts-mapping";
import { StructureElement } from "molstar/lib/mol-model/structure";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PluginBehavior } from "molstar/lib/mol-plugin/behavior";
export const PDBeSIFTSMapping = PluginBehavior.create({
    name: "pdbe-sifts-mapping-prop",
    category: "custom-props",
    display: { name: "PDBe SIFTS Mapping" },
    ctor: class extends PluginBehavior.Handler {
        provider = BestDatabaseSequenceMappingProp.Provider;
        labelProvider = {
            label: (loci) => {
                if (!this.params.showTooltip)
                    return;
                return PDBeBestDatabaseSequenceMappingLabel(loci);
            },
        };
        update(p) {
            const updated = this.params.autoAttach !== p.autoAttach ||
                this.params.showTooltip !== p.showTooltip;
            this.params.autoAttach = p.autoAttach;
            this.params.showTooltip = p.showTooltip;
            this.ctx.customStructureProperties.setDefaultAutoAttach(this.provider.descriptor.name, this.params.autoAttach);
            return updated;
        }
        register() {
            this.ctx.customModelProperties.register(this.provider, this.params.autoAttach);
            this.ctx.representation.structure.themes.colorThemeRegistry.add(SIFTSMappingColorThemeProvider);
            this.ctx.managers.lociLabels.addProvider(this.labelProvider);
        }
        unregister() {
            this.ctx.customModelProperties.unregister(this.provider.descriptor.name);
            this.ctx.representation.structure.themes.colorThemeRegistry.remove(SIFTSMappingColorThemeProvider);
            this.ctx.managers.lociLabels.removeProvider(this.labelProvider);
        }
    },
    params: () => ({
        autoAttach: PD.Boolean(true),
        showTooltip: PD.Boolean(true),
    }),
});
//
function PDBeBestDatabaseSequenceMappingLabel(loci) {
    if (loci.kind === "element-loci") {
        if (loci.elements.length === 0)
            return;
        const e = loci.elements[0];
        const u = e.unit;
        const se = StructureElement.Location.create(loci.structure, u, u.elements[OrderedSet.getAt(e.indices, 0)]);
        return BestDatabaseSequenceMappingProp.getLabel(se);
    }
}

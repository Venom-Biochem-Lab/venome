import { PluginBehavior } from "molstar/lib/mol-plugin/behavior";
import { StructureElement, StructureProperties, } from "molstar/lib/mol-model/structure";
import { lociLabel } from "molstar/lib/mol-theme/label";
import { PluginCustomState } from "./plugin-custom-state";
export const PDBeLociLabelProvider = PluginBehavior.create({
    name: "pdbe-loci-label-provider",
    category: "interaction",
    ctor: class {
        ctx;
        f = {
            label: (loci) => {
                const superpositionView = PluginCustomState(this.ctx)
                    .initParams.superposition;
                const label = [];
                if (!superpositionView &&
                    StructureElement.Loci.is(loci) &&
                    loci.elements.length === 1) {
                    const entityNames = new Set();
                    for (const { unit: u } of loci.elements) {
                        const l = StructureElement.Location.create(loci.structure, u, u.elements[0]);
                        const name = StructureProperties.entity
                            .pdbx_description(l)
                            .join(", ");
                        entityNames.add(name);
                    }
                    if (entityNames.size === 1)
                        entityNames.forEach((name) => label.push(name));
                }
                label.push(lociLabel(loci));
                return label.filter((l) => !!l).join("</br>");
            },
            group: (label) => label.toString().replace(/Model [0-9]+/g, "Models"),
            priority: 100,
        };
        register() {
            this.ctx.managers.lociLabels.addProvider(this.f);
        }
        unregister() {
            this.ctx.managers.lociLabels.removeProvider(this.f);
        }
        constructor(ctx) {
            this.ctx = ctx;
        }
    },
    display: { name: "Provide PDBe Loci Label" },
});

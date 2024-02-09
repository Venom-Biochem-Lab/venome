import { DomainAnnotations, DomainAnnotationsProvider } from "./prop";
import { StructureElement } from "molstar/lib/mol-model/structure";
import { ColorTheme } from "molstar/lib/mol-theme/color";
import { Color } from "molstar/lib/mol-util/color";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
const DomainColors = [
    Color.fromRgb(170, 170, 170),
    Color.fromRgb(255, 112, 3),
];
export const DomainAnnotationsColorThemeParams = {
    type: PD.MappedStatic("", {
        "": PD.EmptyGroup(),
    }),
};
export function DomainAnnotationsColorTheme(ctx, props) {
    let color;
    if (ctx.structure &&
        !ctx.structure.isEmpty &&
        ctx.structure.models[0].customProperties.has(DomainAnnotationsProvider.descriptor)) {
        const getDomains = DomainAnnotations.getDomains;
        const issue = props.type.params.kind;
        color = (location) => {
            if (StructureElement.Location.is(location) &&
                getDomains(location).indexOf(issue) >= 0) {
                return DomainColors[1];
            }
            return DomainColors[0];
        };
    }
    else {
        color = () => DomainColors[0];
    }
    return {
        factory: DomainAnnotationsColorTheme,
        granularity: "group",
        color: color,
        props: props,
        description: "Highlights Sequnece and Structure Domain Annotations. Data obtained via PDBe.",
    };
}
export const DomainAnnotationsColorThemeProvider = {
    name: "pdbe-domain-annotations",
    label: "Domain annotations",
    category: ColorTheme.Category.Misc,
    factory: DomainAnnotationsColorTheme,
    getParams: (ctx) => {
        const domainNames = DomainAnnotations.getDomainNames(ctx.structure);
        const domainTypes = DomainAnnotations.getDomainTypes(ctx.structure);
        const optionObj = {};
        domainTypes.forEach((tp, index) => {
            if (domainNames[index].length > 0) {
                optionObj[tp] = PD.Group({
                    kind: PD.Select(domainNames[index][0], PD.arrayToOptions(domainNames[index])),
                }, { isFlat: true });
            }
        });
        if (Object.keys(optionObj).length > 0) {
            return {
                type: PD.MappedStatic(optionObj[0], optionObj),
            };
        }
        else {
            return {
                type: PD.MappedStatic("", {
                    "": PD.EmptyGroup(),
                }),
            };
        }
    },
    defaultValues: PD.getDefaultValues(DomainAnnotationsColorThemeParams),
    isApplicable: (ctx) => DomainAnnotations.isApplicable(ctx.structure?.models[0]),
    ensureCustomProperties: {
        attach: (ctx, data) => {
            return data.structure
                ? DomainAnnotationsProvider.attach(ctx, data.structure.models[0], void 0, true)
                : Promise.resolve();
        },
        detach: (data) => data.structure &&
            data.structure.models[0].customProperties.reference(DomainAnnotationsProvider.descriptor, false),
    },
};

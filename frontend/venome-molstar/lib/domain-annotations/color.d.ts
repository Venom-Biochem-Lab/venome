import { ColorTheme } from "molstar/lib/mol-theme/color";
import { ThemeDataContext } from "molstar/lib/mol-theme/theme";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
export declare const DomainAnnotationsColorThemeParams: {
    type: PD.Mapped<PD.NamedParams<PD.Normalize<unknown>, "">>;
};
type Params = any;
export declare function DomainAnnotationsColorTheme(ctx: ThemeDataContext, props: PD.Values<Params>): ColorTheme<Params>;
export declare const DomainAnnotationsColorThemeProvider: ColorTheme.Provider<Params, "pdbe-domain-annotations">;
export {};

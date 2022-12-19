import {BC, BernieComponent} from "./BernieComponent";
import {ConfirmationConfig, ConfirmationType} from "./ConfirmationConfig";
import {VM} from "./style/ObjectVisualMeaning";
import {Flex, FlexBox} from "../components/lo/FlexBox";
import {DrawerHeader} from "../components/lo/DrawerHeader";
import {percent, px} from "./style/DimensionalMeasured";
import {Button} from "../components/lo/Button";
import {LiteGrid} from "../components/lo/LiteGrid";
import {utilizeGlobalTheme} from "./app/App";
import {AF} from "../components/logic/ArrayFragment";
import React from "react";
import {StaticDrawerMenu} from "../components/lo/StaticDrawerMenu";
import {ConfirmationDialog} from "../components/lo/ConfirmationDialog";

export class ComponentHelper<RProps, RState, LState extends object, Implementation extends BernieComponent<any, any, any> = any> {

    private readonly component: () => BC<RProps, RState, LState, Implementation>;

    constructor(component: () => BC<RProps, RState, LState, Implementation>) {
        this.component = component;
    }

    public confirm(
        config: Partial<ConfirmationConfig>,
        renderer: (config: ConfirmationConfig, caller: BC<RProps, RState, LState, Implementation>) => JSX.Element
    ) {
        const c: ConfirmationConfig = {
            ...{
                title: "Confirmation required",
                description: "An action required a confirmation by the user. This is a security measure",
                type: ConfirmationType.CONFIRM_OR_CANCEL,
                vm: VM.UI_NO_HIGHLIGHT,
                actions: {
                    onConfirm(component: BernieComponent<any, any, any>) {
                        component.closeLocalDialog();
                    },
                    onCancel(component: BernieComponent<any, any, any>) {
                        component.closeLocalDialog();
                    }
                }
            } as ConfirmationConfig,
            ...config
        }

        this.component().dialog(renderer(c, this.component()));
    }
}

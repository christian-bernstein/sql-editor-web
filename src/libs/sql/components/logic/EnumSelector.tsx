import {BernieComponent} from "../../logic/BernieComponent";
import {StaticDrawerMenu} from "../lo/StaticDrawerMenu";
import {FlexBox} from "../lo/FlexBox";
import {DrawerHeader} from "../lo/DrawerHeader";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Align} from "../../logic/style/Align";
import {AnomalyLevel} from "../../logic/data/AnomalyLevel";
import {AF} from "./ArrayFragment";
import {Button} from "../lo/Button";
import {AnomalyInfo} from "../ho/anomalyInfo/AnomalyInfo";
import React from "react";
import {LiteGrid} from "../lo/LiteGrid";

export type EnumSelectorProps<T> = {
    from: T,
    onSubmit: (element: string) => void;
}

export class EnumSelector<T extends object> extends BernieComponent<EnumSelectorProps<T>, any, any> {

    componentRender(p: EnumSelectorProps<T>, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={() => (
                <FlexBox width={percent(100)} align={Align.CENTER}>
                    <DrawerHeader
                        header={"Select enum"}
                        enableBadge
                        badgeVM={ObjectVisualMeaning.INFO}
                        badgeText={"development"}
                        description={"Select an element from the enum"}
                    />

                    <LiteGrid gap={t.gaps.smallGab} style={{marginTop: 40}} columns={2} children={
                        <AF elements={
                            Object.keys(p.from).filter((item: string) => isNaN(Number(item))).map(level => (
                                <Button width={percent(100)} text={level} onClick={() => {
                                    p.onSubmit?.(level);
                                }}/>
                            ))
                        }/>
                    }/>

                </FlexBox>
            )}/>
        );
    }
}

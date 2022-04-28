import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {percent} from "../../logic/style/DimensionalMeasured";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {Text} from "./Text";
import {Button} from "./Button";
import React from "react";
import {If} from "../logic/If";

export type ContextMenuElementProps = {
    title?: string,
    customTitleRenderer?: () => JSX.Element,
    onClick?: () => void,
    icon?: () => JSX.Element
}

export class ContextMenuElement extends BernieComponent<ContextMenuElementProps, any, any> {

    constructor(props: ContextMenuElementProps) {
        super(props, undefined, undefined);
    }

    componentRender(p: ContextMenuElementProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Button highlight={false} bgColorOnDefault={false} border={false} width={percent(100)} onClick={p.onClick}>
                <FlexBox gap={t.gaps.defaultGab} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)}>
                    <If condition={p.customTitleRenderer === undefined} ifFalse={p.customTitleRenderer?.()} ifTrue={
                        <Text text={String(p.title)}/>
                    }/>
                    <If condition={p.icon === undefined} ifFalse={p.icon?.()} ifTrue={
                        <span style={{width: "16px", height: "16px"}}/>
                    }/>
                </FlexBox>
            </Button>
        );
    }
}

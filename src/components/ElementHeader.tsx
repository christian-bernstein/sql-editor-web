import {BernieComponent} from "../logic/BernieComponent";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {FlexBox} from "./FlexBox";
import {percent} from "../logic/DimensionalMeasured";
import React from "react";
import {FlexDirection} from "../logic/FlexDirection";
import {Justify} from "../logic/Justify";
import {Align} from "../logic/Align";
import {Icon} from "./Icon";
import {If} from "./If";
import {Text} from "./Text";
import {Badge} from "./Badge";

export type ElementHeaderProps = {
    icon?: JSX.Element,
    disableIcon: boolean,
    title: string,
    disableTitle: boolean,
    beta: boolean
    appendix: JSX.Element,
    // means: should the 'icon'-prop be wrapped in a <Icon icon={}/> component (use wrapIcon = false if you like to customise the icon by yourself.)
    wrapIcon: boolean
}

export type ElementHeaderPropsPartial = Partial<ElementHeaderProps>;

export class ElementHeader extends BernieComponent<ElementHeaderPropsPartial, any, any> {

    private readonly defaults: ElementHeaderProps = {
        icon: undefined,
        disableIcon: false,
        title: "",
        disableTitle: false,
        beta: false,
        appendix: <></>,
        wrapIcon: true
    }

    componentRender(p: ElementHeaderPropsPartial, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const props: ElementHeaderProps = {...this.defaults, ...p};
        return (
            <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER}>
                <FlexBox height={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} gap={t.gaps.smallGab}>
                    <If condition={!props.disableIcon && props.icon !== undefined} ifTrue={(
                        (() => {
                            const icon = props.icon as JSX.Element;
                            return props.wrapIcon ? <Icon icon={icon}/> : icon;
                        })()
                    )}/>
                    <If condition={props.disableTitle} ifFalse={
                        <Text text={props.title}/>
                    }/>
                    <If condition={props.beta} ifTrue={Badge.beta(t)}/>
                </FlexBox>
                {props.appendix}
            </FlexBox>
        )
    }
}

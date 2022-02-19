import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../Themeable";
import {Assembly} from "../../logic/Assembly";
import React from "react";
import {PageV2} from "../../components/Page";
import {AppHeader} from "../../components/AppHeader";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {Icon} from "../../components/Icon";
import {App, utilizeGlobalTheme} from "../../logic/App";
import {percent, px} from "../../logic/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {RoadmapEntry} from "../../components/RoadmapEntry";
import {ReactComponent as Logo} from "../../assets/logo.svg";

export class RoadmapDialog extends BernieComponent<any, any, any> {

    private renderHeader(): JSX.Element {
        return (
            <AppHeader title={"Roadmap"} left={
                <Icon icon={<Logo/>} size={px(20)}/>
            } right={
                <FlexBox flexDir={FlexDirection.ROW}>
                    <Icon icon={<CloseIcon/>} onClick={() => App.app().toggleMainDialog("closed")}/>
                </FlexBox>
            }/>
        );
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

        return (
            <PageV2>
                {this.renderHeader()}
                <FlexBox height={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    <FlexBox gap={t.gaps.defaultGab}>
                        <RoadmapEntry status={"completed"}/>
                        <RoadmapEntry status={"completed"}/>
                        <RoadmapEntry status={"working"}/>
                        <RoadmapEntry status={"future"}/>
                        <RoadmapEntry status={"future"}/>
                    </FlexBox>
                </FlexBox>
            </PageV2>
        );
    }
}

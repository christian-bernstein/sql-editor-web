import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../Themeable";
import {Assembly} from "../../logic/Assembly";
import {PageV2} from "../../components/Page";
import {AppHeader} from "../../components/AppHeader";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {Icon} from "../../components/Icon";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import React from "react";
import {App} from "../../logic/App";

export class ServerInfoDialog extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <PageV2>
                <AppHeader title={"Server information"} right={
                    <FlexBox flexDir={FlexDirection.ROW}>
                        <Icon icon={<CloseIcon/>} onClick={() => App.app().toggleMainDialog("closed")}/>
                    </FlexBox>
                }/>
            </PageV2>
        );
    }
}

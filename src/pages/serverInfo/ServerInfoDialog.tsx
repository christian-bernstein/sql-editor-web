import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {PageV2} from "../../components/lo/Page";
import {AppHeader} from "../../components/lo/AppHeader";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import React from "react";
import {App} from "../../logic/app/App";
import {CodeEditor} from "../../components/lo/CodeEditor";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Group} from "../../components/lo/Group";
import {Orientation} from "../../logic/style/Orientation";

export class ServerInfoDialog extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <PageV2>
                <AppHeader title={"Server information"} right={
                    <FlexBox flexDir={FlexDirection.ROW}>
                        <Icon icon={<CloseIcon/>} onClick={() => App.app().callAction("close-main-dialog")}/>
                    </FlexBox>
                }/>

                <Group orientation={Orientation.VERTICAL} width={percent(100)} elements={[
                    <CodeEditor width={percent(100)} theme={"dark"} classnames={["cm"]} upstreamHook={() => {}}/>,
                    <CodeEditor width={percent(100)} placeholder={"Type your command"} theme={"dark"} classnames={["cm"]} upstreamHook={() => {}}/>
                ]}/>

            </PageV2>
        );
    }
}

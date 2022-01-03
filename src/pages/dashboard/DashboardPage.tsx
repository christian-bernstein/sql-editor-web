import React from "react";
import "../../styles/pages/DashboardPage.scss";
import {ProjectInfo} from "../../components/ProjectInfo";
import {LoadState} from "../../logic/LoadState";
import {App} from "../../logic/App";
import {v4} from "uuid";
import {ProjectInfoData} from "../../logic/ProjectInfoData";
import {FlexBox} from "../../components/FlexBox";
import {PageV2} from "../../components/Page";
import {Text, TextType} from "../../components/Text";
import {Align} from "../../logic/Align";
import {Justify} from "../../logic/Justify";
import {LiteGrid} from "../../components/LiteGrid";
import {ReactComponent as MenuIcon} from "../../assets/icons/ic-20/ic20-menu.svg";
import {Icon} from "../../components/Icon";
import {array, arrayFactory} from "../../logic/Utils";
import {PosInCenter} from "../../components/PosInCenter";
import {em, px} from "../../logic/DimensionalMeasured";
import {DBSessionCacheShard} from "../../shards/DBSessionCacheShard";
import {Redirect} from "react-router-dom";

export type DashboardPageProps = {
}

export type DashboardPageState = {
    redirectToEditor: boolean
}

export default class DashboardPage extends React.PureComponent<DashboardPageProps, DashboardPageState> {

    constructor(props: DashboardPageProps) {
        super(props);
        this.state = {
            redirectToEditor: false
        };
    }

    // noinspection JSMethodCanBeStatic
    private onProjectSelect(data: ProjectInfoData) {
        App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData = data;
        this.setState({
            redirectToEditor: true
        });
    }

    private renderPage(): JSX.Element {
        return (
            <PageV2>
                <LiteGrid columns={3}>
                    <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                        <Icon icon={<MenuIcon/>} onClick={() => App.app().openMenu()}/>
                    </FlexBox>
                    <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                        <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"Dashboard"} />
                    </FlexBox>
                </LiteGrid>
                <PosInCenter>
                    <Text uppercase align={Align.CENTER} type={TextType.secondaryDescription} text={"*Select a project*"} />
                </PosInCenter>
                <LiteGrid responsive minResponsiveWidth={px(300)} gap={em(1)}>
                    {
                        // todo set key the right way
                        arrayFactory(() => <ProjectInfo
                            key={v4()}
                            onSelect={data => this.onProjectSelect(data)}
                            data={{
                                id: v4(),
                                state: LoadState.ONLINE,
                                stator: true,
                                edits: 10,
                                lastEdited: new Date(),
                                title: "SQL lesson 21"
                            }}
                        />, 3)
                    }
                </LiteGrid>
            </PageV2>
            //<div className={"dashboard-page"}>
            //    {/* header */}
            //    <div className={"dashboard-header"}>
            //        <div className={"left-icons"}>
            //            <MenuIcon onClick={event => this.menuIconClickHandle(event)}/>
            //        </div>
            //        <div className={"right-icons"}>
            //            <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>20</Badge>} showBadgeInitially={true}>
            //                <InboxIcon/>
            //            </BadgedWrapper>
            //            <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>4</Badge>} showBadgeInitially={false}>
            //                <FilterIcon/>
            //            </BadgedWrapper>
            //            <BadgedWrapper badgeFlowDirection={"right"} badge={<Badge background={Color.ofHex("71D99E")}>1</Badge>} showBadgeInitially={false}>
            //                <CreateIcon/>
            //            </BadgedWrapper>
            //        </div>
            //    </div>
//
            //    {/* title */}
            //    <div className={"dashboard-title"}>
            //        <p>Hello,</p>
            //        <h2 className={"name"}>Christian Bernstein</h2>
            //        <pre>{window.localStorage.getItem("session-id")}</pre>
            //        <pre>{this.state._a}</pre>
            //    </div>
//
            //    <FlexBox>
            //        <ProjectInfo
            //            onSelect={data => this.onProjectSelect(data)}
            //            data={{
            //                id: v4(),
            //                state: LoadState.ONLINE,
            //                stator: true,
            //                edits: 10,
            //                lastEdited: new Date(),
            //                title: "SQL lesson 21"
            //            }}
            //        />
            //    </FlexBox>
            //</div>
        );
    }

    render() {
        if (this.state.redirectToEditor) {
            console.log("redirect to d-editor")
            return (
                <Redirect to={"/d-editor"} push/>
            );
        } else {
            return this.renderPage();
        }
    }
}

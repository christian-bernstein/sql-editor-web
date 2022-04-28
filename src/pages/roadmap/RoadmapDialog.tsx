import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import React from "react";
import {Screen} from "../../components/lo/Page";
import {AppHeader} from "../../components/lo/AppHeader";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {Icon} from "../../components/lo/Icon";
import {App} from "../../logic/app/App";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {RoadmapEntry} from "../../components/ho/roadmapEntry/RoadmapEntry";
import {ReactComponent as Logo} from "../../assets/logo.svg";
import {ElementHeader} from "../../components/lo/ElementHeader";
import {ReactComponent as DownloadIcon} from "../../assets/icons/ic-16/ic16-download.svg";
import {Button} from "../../components/lo/Button";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../components/lo/Text";
import {Separator} from "../../components/lo/Separator";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {arrayFactory} from "../../logic/Utils";
import {Image} from "../../components/lo/Image";

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
            <Screen>
                {this.renderHeader()}
                <FlexBox height={percent(100)} width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                    <FlexBox gap={t.gaps.defaultGab} width={percent(100)}>
                        {arrayFactory(() => <RoadmapEntry status={"completed"}>
                                <ElementHeader
                                    icon={<DownloadIcon/>}
                                    appendix={
                                        <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque padding={px(4)}>
                                            <Text text={"View roadmap"}/>
                                        </Button>
                                    }
                                    wrapIcon
                                    title={"Download data"}
                                    beta={false}
                                />
                                <Separator/>
                                <Text text={"Export data to a downloadable file. \nAllowed file formats: **.dat**, **.csv**, **.xls** *(Excel spreadsheet)*."}/>
                                <InformationBox visualMeaning={ObjectVisualMeaning.BETA}>
                                    <Text type={TextType.secondaryDescription} text={"As of version **v16** *(19. Feb 2022)*, this feature is still in development and will be accessible to beta mode in a couple of weeks."}/>
                                </InformationBox>
                            </RoadmapEntry>, 2)}
                        <RoadmapEntry status={"working"} children={
                            <FlexBox flexDir={FlexDirection.COLUMN} gap={t.gaps.smallGab}>
                                <Text text={`Hello world *this* **is** toll.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. SD.ASDASDASD *asdasd* `}/>
                                {/*<Image/>*/}
                            </FlexBox>
                        }/>
                        {arrayFactory(() => <RoadmapEntry status={"future"}>
                            <ElementHeader
                                icon={<DownloadIcon/>}
                                appendix={
                                    <Button visualMeaning={ObjectVisualMeaning.BETA} shrinkOnClick opaque padding={px(4)}>
                                        <Text text={"View roadmap"}/>
                                    </Button>
                                }
                                wrapIcon
                                title={"Download data"}
                                beta={false}
                            />
                            <Separator/>
                            <Text text={"Export data to a downloadable file. \nAllowed file formats: **.dat**, **.csv**, **.xls** *(Excel spreadsheet)*."}/>
                            <InformationBox visualMeaning={ObjectVisualMeaning.BETA}>
                                <Text type={TextType.secondaryDescription} text={"As of version **v16** *(19. Feb 2022)*, this feature is still in development and will be accessible to beta mode in a couple of weeks."}/>
                            </InformationBox>
                        </RoadmapEntry>, 2)}
                    </FlexBox>
                </FlexBox>
            </Screen>
        );
    }
}

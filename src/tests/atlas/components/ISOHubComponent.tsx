import {BC} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Flex} from "../../../components/lo/FlexBox";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Button} from "../../../components/lo/Button";
import {Align} from "../../../logic/style/Align";
import {Text, TextType} from "../../../components/lo/Text";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import React from "react";
import {ISODownloadComponent} from "./ISODownloadComponent";
import {ISOUploadComponent} from "./ISOUploadComponent";

export class ISOHubComponent extends BC<any, any, any> {

    private exportISODialog() {
        this.dialog(
            <ISODownloadComponent/>
        );
    }

    private importISODialog() {
        this.dialog(
            <ISOUploadComponent/>
        );
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => {
                return (
                    <Flex fw elements={[
                        <DrawerHeader
                            header={"ISO-image actions"}
                            enableBadge
                            badgeVM={VM.UI_NO_HIGHLIGHT}
                            badgeText={"VFS-ISO"}
                            description={"Manage the creation & installation of ISO-images.\nISO-Images are used to **import** & **export** data from Atlas™."}
                        />,

                        <Flex fw padding paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                            <Button
                                width={percent(100)}
                                onClick={() => this.exportISODialog()}
                                children={
                                    <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                        <Text
                                            bold
                                            text={"Export ISO-image"}
                                        />,
                                        <Text
                                            text={"Download reusable Atlas™-ISO-image"}
                                            type={TextType.secondaryDescription}
                                            fontSize={px(11)}
                                            align={Align.CENTER}
                                        />
                                    ]}/>
                                }
                            />,
                            <Button
                                width={percent(100)}
                                onClick={() => this.importISODialog()}
                                children={
                                    <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                        <Text
                                            bold
                                            text={"Import ISO-image"}
                                        />,
                                        <Text
                                            text={"Upload & install Atlas™-ISO-image"}
                                            type={TextType.secondaryDescription}
                                            fontSize={px(11)}
                                            align={Align.CENTER}
                                        />
                                    ]}/>
                                }
                            />,
                        ]}/>,
                    ]}/>
                );
            }}/>
        );
    }
}

import {BC} from "../../sql/logic/BernieComponent";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../sql/components/lo/Button";
import {Align} from "../../sql/logic/style/Align";
import {Text, TextType} from "../../sql/components/lo/Text";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import React from "react";
import {ISODownloadComponent} from "./ISODownloadComponent";
import {ISOUploadComponent} from "./ISOUploadComponent";
import {Download, ImportExportRounded, Upload} from "@mui/icons-material";
import {Icon} from "../../sql/components/lo/Icon";
import {LiteGrid} from "../../sql/components/lo/LiteGrid";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {Tooltip} from "../../sql/components/ho/tooltip/Tooltip";

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
                    <Flex fw align={Align.CENTER} elements={[
                        <Icon icon={<ImportExportRounded/>} style={{ transform: "rotate(45deg)" }} size={px(40)}/>,

                        <DrawerHeader
                            header={"ISO-image manager"}
                            enableBadge
                            badgeVM={VM.UI_NO_HIGHLIGHT}
                            badgeText={"VFS-ISO"}
                            description={"Manage the creation & installation of ISO-images.\nISO-Images are used to **import** & **export** data from Atlas™."}
                        />,

                        <LiteGrid columns={2} gap={t.gaps.smallGab} children={
                            <AF elements={[
                                <Tooltip arrow title={"Download reusable Atlas™-ISO-image"} children={
                                    <Button
                                        shrinkOnClick
                                        width={percent(100)}
                                        onClick={() => this.exportISODialog()}
                                        children={
                                            <Flex gap={px(3)} align={Align.CENTER} fw elements={[
                                                <Icon icon={<Download/>} size={px(25)}/>,
                                                <Text
                                                    bold
                                                    text={"Export"}
                                                />,
                                                <Text
                                                    align={Align.CENTER}
                                                    text={"Download reusable\nAtlas™-ISO-image"}
                                                    type={TextType.secondaryDescription}
                                                    fontSize={px(11)}
                                                />,
                                            ]}/>
                                        }
                                    />
                                }/>,
                                <Tooltip arrow title={"Upload & install Atlas™-ISO-image"} children={
                                    <Button
                                        shrinkOnClick
                                        width={percent(100)}
                                        onClick={() => this.importISODialog()}
                                        children={
                                            <Flex gap={px(3)} align={Align.CENTER} fw elements={[
                                                <Icon icon={<Upload/>} size={px(25)}/>,
                                                <Text
                                                    bold
                                                    text={"Import"}
                                                />,
                                                <Text
                                                    align={Align.CENTER}
                                                    text={"Upload & install\nAtlas™-ISO-image"}
                                                    type={TextType.secondaryDescription}
                                                    fontSize={px(11)}
                                                />
                                            ]}/>
                                        }
                                    />
                                }/>
                            ]}/>
                        }/>,

                        // <Flex fw padding paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                        //     <Button
                        //         shrinkOnClick
                        //         width={percent(100)}
                        //         onClick={() => this.exportISODialog()}
                        //         children={
                        //             <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                        //                 <Text
                        //                     bold
                        //                     text={"Export ISO-image"}
                        //                 />,
                        //                 <Text
                        //                     text={"Download reusable Atlas™-ISO-image"}
                        //                     type={TextType.secondaryDescription}
                        //                     fontSize={px(11)}
                        //                     align={Align.CENTER}
                        //                 />
                        //             ]}/>
                        //         }
                        //     />,
                        //     <Button
                        //         shrinkOnClick
                        //         width={percent(100)}
                        //         onClick={() => this.importISODialog()}
                        //         children={
                        //             <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                        //                 <Text
                        //                     bold
                        //                     text={"Import ISO-image"}
                        //                 />,
                        //                 <Text
                        //                     text={"Upload & install Atlas™-ISO-image"}
                        //                     type={TextType.secondaryDescription}
                        //                     fontSize={px(11)}
                        //                     align={Align.CENTER}
                        //                 />
                        //             ]}/>
                        //         }
                        //     />,
                        // ]}/>,
                    ]}/>
                );
            }}/>
        );
    }
}

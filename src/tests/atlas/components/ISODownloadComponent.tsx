import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {AtlasMain} from "../AtlasMain";
import {Flex} from "../../../components/lo/FlexBox";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import React from "react";
import fileDownload from 'js-file-download';
import {Button} from "../../../components/lo/Button";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Align} from "../../../logic/style/Align";
import {Text, TextType} from "../../../components/lo/Text";
import {Badge} from "../../../components/lo/Badge";
import {createMargin} from "../../../logic/style/Margin";
import {CodeDisplay} from "../../../components/lo/CodeDisplay";
import {Screen} from "../../../components/lo/Page";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";

export type ISODownloadComponentLocalState = {
    downloadURL?: string
}

export class ISODownloadComponent extends BC<any, any, ISODownloadComponentLocalState> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={() => {
                const db = AtlasMain.atlas().api().db();
                const dbKey = db.key();
                const dbValue: string = window.localStorage.getItem(dbKey) as string;
                const timestamp = new Date().toISOString();
                const atlasFilename = `atlas-iso-${timestamp}.atlas`;
                const jsonFilename = `atlas-iso-${timestamp}.json`;

                return (
                    <Flex fw elements={[
                        <DrawerHeader
                            header={"ISO-image burner"}
                            enableBadge
                            badgeVM={VM.UI_NO_HIGHLIGHT}
                            badgeText={"VFS-ISO"}
                            description={"Download a freshly generate ISO-image of the current Atlas™-state.\n\n*Tip: Atlas-ISO-Images are in JSON-format, which makes them human-readable & easily processable. You can for example inspect the ISO by opening it in a browser window.*"}
                        />,

                        <Flex fw padding paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                            <Button
                                width={percent(100)}
                                onClick={() => fileDownload(dbValue, jsonFilename)}
                                children={
                                    <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                        <Flex fw align={Align.CENTER} margin={createMargin(0, 0, t.gaps.smallGab.measurand, 0)} elements={[
                                            Badge.badge("Recommended", {
                                                visualMeaning: ObjectVisualMeaning.BETA
                                            }),
                                        ]}/>,
                                        <Text
                                            bold
                                            text={"Download json ISO-image"}
                                        />,
                                        <Text
                                            text={`${jsonFilename}`}
                                            type={TextType.secondaryDescription}
                                            fontSize={px(11)}
                                            align={Align.CENTER}
                                        />
                                    ]}/>
                                }
                            />,
                            <Button
                                width={percent(100)}
                                onClick={() => fileDownload(dbValue, atlasFilename)}
                                children={
                                    <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                        <Text
                                            bold
                                            text={"Download atlas ISO-image"}
                                        />,
                                        <Text
                                            text={`${atlasFilename}`}
                                            type={TextType.secondaryDescription}
                                            fontSize={px(11)}
                                            align={Align.CENTER}
                                        />
                                    ]}/>
                                }
                            />,

                            <Button
                                width={percent(100)}
                                onClick={() => {
                                    this.dialog(
                                        <Screen children={
                                            <Flex align={Align.CENTER} fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} elements={[
                                                Badge.badge("Development", {
                                                    visualMeaning: ObjectVisualMeaning.BETA
                                                }),
                                                <CodeDisplay code={JSON.stringify(JSON.parse(dbValue), null, 2).split("\n")}/>
                                            ]}/>
                                        }/>
                                    )
                                }}
                                children={
                                    <Flex gap={px(0)} align={Align.CENTER} fw elements={[
                                        <Text
                                            bold
                                            text={"View source"}
                                        />
                                    ]}/>
                                }
                            />
                        ]}/>,
                    ]}/>
                );
            }}/>
        );
    }
}

import {BC} from "../../sql/logic/BernieComponent";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {AtlasMain} from "../AtlasMain";
import {Flex} from "../../sql/components/lo/FlexBox";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import React from "react";
import fileDownload from 'js-file-download';
import {Button} from "../../sql/components/lo/Button";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Align} from "../../sql/logic/style/Align";
import {Text, TextType} from "../../sql/components/lo/Text";
import {Badge} from "../../sql/components/lo/Badge";
import {createMargin} from "../../sql/logic/style/Margin";
import {CodeDisplay} from "../../sql/components/lo/CodeDisplay";
import {Screen} from "../../sql/components/lo/Page";
import {OverflowBehaviour} from "../../sql/logic/style/OverflowBehaviour";
import {ISOBase} from "../iso/ISOBase";
import {Q, Queryable} from "../../sql/logic/query/Queryable";
import {QueryDisplay} from "../../sql/components/logic/QueryDisplay";

export type ISODownloadComponentLocalState = {
    iso: Q<ISOBase | undefined>,
}

export class ISODownloadComponent extends BC<any, any, ISODownloadComponentLocalState> {

    constructor() {
        super(undefined, undefined, {
            iso: new Queryable<ISOBase | undefined>({
                component: () => this,
                listeners: ["iso"],
                fallback: undefined,
                process: (resolve, reject) => {
                    AtlasMain.atlas().api().isoAdapter("v1").createISO().then(iso => {
                        resolve(iso);
                    }).catch(reason => {
                        reject(reason);
                    });
                }
            })
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.iso.query();
    }

    componentRender(p: any, s: any, l: ISODownloadComponentLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <StaticDrawerMenu body={() => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={"ISO-image burner"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"VFS-ISO"}
                        description={"Download a freshly generate ISO-image of the current Atlas™-state.\n\n*Tip: Atlas-ISO-Images are in JSON-format, which makes them human-readable & easily processable. You can for example inspect the ISO by opening it in a browser window.*"}
                    />,

                    <QueryDisplay<ISOBase | undefined> q={local.state.iso} renderer={{
                        success: (q, data) => {
                            const db = AtlasMain.atlas().api().db();
                            const iso = JSON.stringify(data);
                            const timestamp = new Date().toISOString();
                            const atlasFilename = `atlas-iso-${timestamp}.atlas`;
                            const jsonFilename = `atlas-iso-${timestamp}.json`;

                            return (
                                <Flex fw elements={[
                                    <Flex fw padding paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                                        <Button
                                            width={percent(100)}
                                            onClick={() => fileDownload(iso, jsonFilename)}
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
                                            onClick={() => fileDownload(iso, atlasFilename)}
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
                                                            <CodeDisplay code={JSON.stringify(JSON.parse(iso), null, 2).split("\n")}/>
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
                        },
                        processing: q => {
                            return <>loading</>
                        }
                    }}/>
                ]}/>
            )}/>
        ), ...Q.allChannels("iso"))
    }
}

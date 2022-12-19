import {BC} from "../../sql/logic/BernieComponent";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Box} from "../../sql/components/lo/Box";
import {Flex} from "../../sql/components/lo/FlexBox";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Align} from "../../sql/logic/style/Align";
import {Justify} from "../../sql/logic/style/Justify";
import React from "react";
import {Text, TextType} from "../../sql/components/lo/Text";
import {SingleLinearProgress} from "../../sql/components/lo/SingleLinearProgress";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {Utils} from "../../sql/logic/Utils";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";

export type StorageQuotaDialogLocalState = {
    se?: StorageEstimate
}

export class StorageQuotaDialog extends BC<any, any, StorageQuotaDialogLocalState> {

    constructor() {
        super(undefined, undefined, {});
    }

    componentDidMount() {
        super.componentDidMount();
        navigator.storage.estimate().then((data: StorageEstimate) => {
           this.local.setStateWithChannels({
               se: data
           }, ["data"])
        });
    }

    componentRender(p: any, s: any, l: StorageQuotaDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => (
                <Flex fw fh align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                    <DrawerHeader
                        header={"Storage quota"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"persistent Storage"}
                        description={"Get information about the storage quota for **indexeddb**. indexeddb is used to store large amounts of data persistently. Your folder-structure & documents are stored in this database. *Images are included*"}
                    />,

                    this.component(local => {
                        if (local.state.se === undefined) {
                            return (
                                <Flex fw fh align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                    <Text
                                        text={`Loading indexeddb storage estimates`}
                                        coloredText
                                        visualMeaning={VM.WARNING}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                    />
                                ]}/>
                            );
                        } else {
                            const use = Number(local.state.se?.usage);
                            const quota = Number(local.state.se?.quota);
                            const p = use * 100 / quota;

                            return (
                                <Flex fw fh align={Align.CENTER} gap={t.gaps.smallGab} justifyContent={Justify.CENTER} elements={[
                                    <Text text={`${p.toFixed(3)}%`}/>,
                                    <SingleLinearProgress visualMeaning={VM.INFO} max={100} value={p}/>,
                                    <Text
                                        text={`**${Utils.humanFileSize(use)}** of **${Utils.humanFileSize(quota)}** used`}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                    />
                                ]}/>
                            );
                        }
                    }, "data")
                ]}/>
            )}/>
        );
    }
}

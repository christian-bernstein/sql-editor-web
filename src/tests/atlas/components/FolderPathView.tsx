import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Folder} from "../data/Folder";
import {Flex, FlexBox, FlexRow} from "../../../components/lo/FlexBox";
import {Box} from "../../../components/lo/Box";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {OverflowWithHeader} from "../../../components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {DocumentSaveState} from "../data/DocumentSaveState";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as SavedIcon} from "../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as PendingIcon} from "../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {Align} from "../../../logic/style/Align";
import {Text, TextType} from "../../../components/lo/Text";
import {Dot} from "../../../components/lo/Dot";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {ContextCompound} from "../../../components/ho/contextCompound/ContextCompound";
import {ReactComponent as DebounceIcon} from "../../../assets/icons/ic-20/ic20-stopwatch.svg";
import {MarkdownViewerReloadPolicyMenu} from "./menus/MarkdownViewerReloadPolicyMenu";
import {MarkdownViewerReloadPolicyConfig} from "../config/configurations/MarkdownViewerReloadPolicyConfig";
import React from "react";

export type FolderPathViewProps = {
    path: Array<Folder>;
    gotoFolder: (selectedFolder: Folder) => void
}

export class FolderPathView extends BC<FolderPathViewProps, any, any> {

    init() {
        super.init();
        this.prependAssembly();
    }

    private prependAssembly() {
        this.assembly.assembly("prepend", theme => {
            return (
                <>asd</>
            );
        });
    }

    componentRender(p: FolderPathViewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox
                flexDir={FlexDirection.ROW}
                width={percent(100)}
                elements={[
                    <FlexBox
                        gap={t.gaps.smallGab}
                        padding={false}
                        flexDir={FlexDirection.ROW}
                        style={{ flex: "0 1 auto" }}
                        elements={[

                        ]}
                    />,

                    <FlexBox
                        flexDir={FlexDirection.ROW}
                        gap={t.gaps.smallGab}
                        style={{ flex: "1 1 auto" }}
                        overflowYBehaviour={OverflowBehaviour.SCROLL}
                        elements={[]}
                    />
                ]}
            />
        );
    }
}

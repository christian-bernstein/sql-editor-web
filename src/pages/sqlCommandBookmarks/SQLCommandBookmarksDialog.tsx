import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Screen} from "../../components/lo/Page";
import {AppHeader} from "../../components/lo/AppHeader";
import {SavedCommand} from "../editor/SavedCommand";
import {FlexBox} from "../../components/lo/FlexBox";
import {Default, Desktop, Mobile} from "../../components/logic/Media";
import {percent} from "../../logic/style/DimensionalMeasured";
import {CommandHistoryElement} from "../../components/ho/commandHistoryElement/CommandHistoryElement";
import {LiteGrid} from "../../components/lo/LiteGrid";
import React from "react";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Text} from "../../components/lo/Text";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as CloseIcon} from "../../assets/icons/ic-20/ic20-close.svg";
import {CustomTooltip} from "../../components/lo/CustomTooltip";

export type SQLCommandBookmarksDialogProps = {
    bookmarks: () => SavedCommand[],
    onClose: () => void,
    onSelect: (command: SavedCommand) => void
    onDelete: (command: SavedCommand) => void
}

export class SQLCommandBookmarksDialog extends BernieComponent<SQLCommandBookmarksDialogProps, any, any> {

    constructor(props: SQLCommandBookmarksDialogProps) {
        super(props, undefined, undefined);
    }

    componentRender(p: SQLCommandBookmarksDialogProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const bookmarks = p.bookmarks();

        return (
            <Screen>
                <AppHeader title={"Saved commands"} right={
                    <CustomTooltip title={<Text text={"Close"}/>} arrow noBorder>
                        <span>
                            <Icon icon={<CloseIcon/>} onClick={() => {
                                p.onClose();
                            }}/>
                        </span>
                    </CustomTooltip>
                }/>
                <FlexBox overflowYBehaviour={OverflowBehaviour.SCROLL} height={percent(100)}>
                    <Mobile children={
                        <FlexBox width={percent(100)}>
                            {bookmarks.map(bookmark => {
                                return (
                                    <CommandHistoryElement command={bookmark} onSelect={(command, element) => {
                                        p.onSelect(command);
                                    }} onDelete={(command, element) => {
                                        p.onDelete(command);
                                    }}/>
                                );
                            })}
                        </FlexBox>
                    }/>
                    <Default children={
                        <LiteGrid responsive minResponsiveWidth={percent(30)} gap={t.gaps.smallGab}>
                            {bookmarks.map(bookmark => {
                                return (
                                    <CommandHistoryElement command={bookmark} onSelect={(command, element) => {
                                        p.onSelect(command);
                                    }} onDelete={(command, element) => {
                                        p.onDelete(command);
                                    }}/>
                                );
                            })}
                        </LiteGrid>
                    }/>
                </FlexBox>
            </Screen>
        );
    }
}

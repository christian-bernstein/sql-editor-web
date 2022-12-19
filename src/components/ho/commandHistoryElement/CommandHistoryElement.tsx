import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Box} from "../../lo/Box";
import {ElementHeader} from "../../lo/ElementHeader";
import {SavedCommand} from "../../../libs/sql/pages/editor/SavedCommand";
import {Text} from "../../lo/Text";
import {CodeEditor} from "../../lo/CodeEditor";
import {Button} from "../../lo/Button";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {oneDark} from "@codemirror/theme-one-dark";
import {sql} from "@codemirror/lang-sql";
import {HighlightStyle, tags} from "@codemirror/highlight";
import React from "react";
import {FlexBox} from "../../lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/style/Align";
import {ReactComponent as DeleteIcon} from "../../../assets/icons/ic-20/ic20-delete.svg";
import {Icon} from "../../lo/Icon";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {CopyIcon} from "../copyIcon/CopyIcon";

export type CommandHistoryElementProps = {
    command: SavedCommand,
    onSelect: (command: SavedCommand, element: CommandHistoryElement) => void,
    onDelete: (command: SavedCommand, element: CommandHistoryElement) => void
}

export class CommandHistoryElement extends BernieComponent<CommandHistoryElementProps, any, any> {

    constructor(props: CommandHistoryElementProps) {
        super(props, undefined, undefined);
    }

    init() {
        super.init();
        this.createTypeBadgeRenderer();
        this.createAppendixRenderer();
    }

    private createTypeBadgeRenderer(): void {
        this.assembly.assembly("type-badge", (theme, props) => {
            return (
                <Box bgColor={theme.colors.backgroundHighlightColor200} paddingY={px(2)} paddingX={px(4)}>
                    <Text text={String(this.props.command.type)} uppercase/>
                </Box>
            );
        });
    }

    private createAppendixRenderer(): void {
        this.assembly.assembly("appendix", theme => {
            return (
                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} height={percent(100)}>
                    {this.a("type-badge")}
                </FlexBox>
            );
        });
    }

    componentRender(p: CommandHistoryElementProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)} height={percent(100)}>
                <FlexBox gap={t.gaps.smallGab} height={percent(100)}>
                    <ElementHeader title={new Date().toLocaleTimeString()} appendix={this.a("appendix")}/>
                    <CodeEditor
                        width={percent(100)}
                        theme={oneDark}
                        classnames={["cm"]}
                        value={p.command.command}
                        extensions={[sql(), HighlightStyle.define([
                            {tag: tags.keyword, class: "keyword"},
                            {tag: tags.local, class: "local"},
                            {tag: tags.color, class: "color"},
                            {tag: tags.comment, class: "comment"},
                            {tag: tags.function, class: "function"},
                            {tag: tags.string, class: "string"},
                            {tag: tags.content, class: "content"},
                            {tag: tags.arithmeticOperator, class: "arithmeticOperator"},
                        ])]}
                        upstreamHook={() => {}}
                        editable={false}
                    />
                    <FlexBox width={percent(100)} gap={t.gaps.smallGab} flexDir={FlexDirection.ROW}>
                        <Button highlight opaque={true} children={
                            <CopyIcon displayValueAsHover={false} copyValueProducer={() => this.props.command.command}/>
                        }/>
                        <Button highlight shrinkOnClick onClick={() => p.onSelect(p.command, this)} width={percent(100)} children={
                            <Text text={"Use"}/>
                        }/>
                        <Button visualMeaning={ObjectVisualMeaning.ERROR} highlight opaque={true} bgColorOnDefault={true} onClick={() => p.onDelete(p.command, this)} children={
                            <Icon icon={<DeleteIcon/>}/>
                        }/>
                    </FlexBox>
                </FlexBox>
            </Box>
        );
    }
}

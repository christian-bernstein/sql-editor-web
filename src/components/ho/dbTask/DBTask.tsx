import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../Themeable";
import {Assembly} from "../../../logic/Assembly";
import {Box} from "../../Box";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {ReactComponent as SuccessIcon} from "../../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as ErrorIcon} from "../../../assets/icons/ic-16/ic16-close.svg";
import {ReactComponent as RepeatIcon} from "../../../assets/icons/ic-16/ic16-refresh.svg";
import {ElementHeader} from "../../ElementHeader";
import React from "react";
import {FlexBox} from "../../FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Align} from "../../../logic/Align";
import {Icon} from "../../Icon";
import {Separator} from "../../Separator";
import {CodeEditor} from "../../CodeEditor";
import {sql} from "@codemirror/lang-sql";
import {v4} from "uuid";
import {oneDark} from "@codemirror/theme-one-dark";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {InformationBox} from "../../InformationBox";
import {ObjectVisualMeaning} from "../../../logic/ObjectVisualMeaning";
import {Text, TextType} from "../../Text";
import {If} from "../../If";
import formatDuration from "format-duration";
import {ProfilePicture} from "../../ProfilePicture";
import {Orientation} from "../../../logic/style/Orientation";
import {DBTaskData} from "../../../logic/data/DBTaskData";
import dateFormat from "dateformat";
import {Cursor} from "../../../logic/style/Cursor";

export type DBTaskProps = {
    data: DBTaskData
}

export class DBTask extends BernieComponent<DBTaskProps, any, any> {

    private static readonly typeToAssemblyRegister: Map<string, string> = new Map<string, string>([
       ["sql-query", "sql-query-assembly"]
    ]);

    constructor(props: DBTaskProps) {
        super(props, undefined, undefined);
        this.assembly.assembly("header", this.headerAssembly());
        this.assembly.assembly("sql-query-assembly", this.sqlQueryAssembly());
    }

    private sqlQueryAssembly(): (theme: Themeable.Theme, props: any) => JSX.Element {
        const formattedExecutionTime = formatDuration(130245, {leading: false});
        const wasSuccessful = true;
        const errorCount = 0;

        const successFormatter: () => string = () => {
            if (wasSuccessful) {
                return `The execution was successful.`;
            } else {
                return `The execution wasn't successful, ${errorCount} errors were produced.`
            }
        }

        return (theme, props) => {
            return (
                <FlexBox gap={theme.gaps.smallGab}>
                    <Text text={`Database ran SQL query in **${formattedExecutionTime}**. ${successFormatter()}`}/>
                    <CodeEditor
                        theme={oneDark}
                        classnames={["cm"]}
                        width={percent(100)}
                        upstreamHook={() => {}}
                        value={``}
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
                    />
                </FlexBox>
            );
        }
    }

    private headerAssembly(): (theme: Themeable.Theme, props: any) => JSX.Element {
        return (theme, props) => (
            <ElementHeader
                wrapIcon={false}
                title={`SQL-UPDATE`}
                beta={false}
                icon={
                    <If condition={true} ifTrue={
                        <Icon icon={<SuccessIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                    } ifFalse={
                        <Icon icon={<ErrorIcon/>}  visualMeaning={ObjectVisualMeaning.ERROR} colored/>
                    }/>
                }
                appendix={
                    <FlexBox flexDir={FlexDirection.ROW} height={percent(100)} align={Align.CENTER} gap={theme.gaps.smallGab}>
                        <ProfilePicture name={"root"}/>
                        <Text text={"root"} cursor={Cursor.pointer} type={TextType.secondaryDescription}/>
                        <Box visualMeaning={ObjectVisualMeaning.BETA} opaque paddingY={px(0)} paddingX={px(4)}>
                            <Text text={this.props.data.client.type.toString()} bold uppercase fontSize={px(12)}/>
                        </Box>
                        <Text text={`**at** ${dateFormat(this.props.data.timestamp, "HH:mm:ss")}`} whitespace={"nowrap"} type={TextType.secondaryDescription}/>
                        <Separator orientation={Orientation.VERTICAL}/>
                        <Icon icon={<RepeatIcon/>}/>
                    </FlexBox>
                }
            />
        );
    }

    private renderTaskBody(): JSX.Element {
        const type = "sql-query";
        const asm = DBTask.typeToAssemblyRegister.get(type);

        if (asm === undefined) {
            return (
                <InformationBox visualMeaning={ObjectVisualMeaning.ERROR}>
                    <Text text={`**ERR:** No mapped assembly to type '**${type}**' found. 
                    Check if the client and the server match in their versions ([Get help here]()). `}/>
                </InformationBox>
            );
        } else {
            return this.assembly.render({
                component: asm
            });
        }


    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={percent(100)} gapY={t.gaps.smallGab}>
                {this.assembly.render({
                    component: "header"
                })}
                <Separator/>
                {this.renderTaskBody()}
            </Box>
        );
    }

}

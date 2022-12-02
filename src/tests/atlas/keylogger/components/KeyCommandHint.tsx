import {BernieComponent} from "../../../../logic/BernieComponent";
import {Themeable} from "../../../../logic/style/Themeable";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {AtlasMain, AtlasMainLocalState} from "../../AtlasMain";
import {State} from "../../../../logic/state/State";
import {Description} from "../../../../components/lo/Description";
import {Flex, FlexRow} from "../../../../components/lo/FlexBox";
import {Align} from "../../../../logic/style/Align";
import {Dot} from "../../../../components/lo/Dot";
import {KeyHint} from "../../../../components/lo/KeyHint";
import {px} from "../../../../logic/style/DimensionalMeasured";
import {createMargin} from "../../../../logic/style/Margin";
import {If} from "../../../../components/logic/If";
import {Text, TextType} from "../../../../components/lo/Text";
import {Box} from "../../../../components/lo/Box";
import {VM} from "../../../../logic/style/ObjectVisualMeaning";
import {CommandOrchestrationActionMode} from "../CommandOrchestrationActionMode";
import {AF} from "../../../../components/logic/ArrayFragment";
import {LinearProgress} from "@mui/material";
import {CommandOrchestrationFinishState} from "../CommandOrchestrationFinishState";
import {KeyCommandOption} from "../KeyCommandOption";

export type KeyCommandHintProps = {}

export class KeyCommandHint extends BernieComponent<KeyCommandHintProps, any, any> {

    componentRender(p: KeyCommandHintProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return AtlasMain.atlas().component((local: State<AtlasMainLocalState>) => {
            const orchestrator = local.state.keyCommandOrchestrator;
            const context = orchestrator.context;
            const matchingCommand = orchestrator.getMatchingCommand();

            return (
                <Flex margin={createMargin(0, 0, t.gaps.defaultGab.measurand, t.gaps.defaultGab.measurand)} gap={px(3)} elements={[
                    <If condition={matchingCommand !== undefined && matchingCommand.keyOptionsGenerator !== undefined} ifTrue={
                        (() => {
                            const options: KeyCommandOption[] = matchingCommand?.keyOptionsGenerator?.(context!!) ?? [];
                            const index: number = context?.selectedOptionIndex ?? -1;
                            return (
                                <Flex margin={createMargin(0, 0, t.gaps.defaultGab.measurand, 0)} gap={px()} elements={options.map((kco, i) => {
                                    const isSelected = i === index;
                                    return (
                                        <FlexRow height={px(20)} gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                                            <If condition={isSelected} ifTrue={
                                                <Flex fh style={{
                                                    width: 3,
                                                    borderRadius: 100,
                                                    backgroundColor: t.colors.warnHighlightColor.css()
                                                }}/>
                                            } ifFalse={
                                                <Flex fh style={{
                                                    width: 3,
                                                    borderRadius: 100,
                                                    backgroundColor: t.colors.backgroundColor.css()
                                                }}/>
                                            }/>,
                                            <Description text={kco.title} bold/>,
                                            <Dot/>,
                                            <Description text={kco.description}/>
                                        ]}/>
                                    );
                                })}/>
                            );
                        })()
                    }/>,
                    <If condition={matchingCommand !== undefined} ifTrue={
                        <FlexRow height={px(23)} gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                            // <Description renderMarkdown={false} text={`Command: '${context?.command}'`}/>,
                            <Description text={`╭─╴ **${matchingCommand?.title}**`}/>,

                            <If condition={context?.mode === CommandOrchestrationActionMode.FINISHED} ifTrue={
                                <AF elements={[
                                    <Dot/>,
                                    <If condition={context?.finishState === CommandOrchestrationFinishState.SUCCESS} ifTrue={
                                        <Description coloredText visualMeaning={VM.SUCCESS_DEFAULT} uppercase text={"success"}/>
                                    } ifFalse={
                                        <Description coloredText visualMeaning={VM.ERROR} uppercase text={"error"}/>
                                    }/>
                                ]}/>
                            }/>,

                            <If condition={context?.mode === CommandOrchestrationActionMode.EXECUTING} ifTrue={
                                <AF elements={[
                                    <Dot/>,
                                    <Description coloredText visualMeaning={VM.WARNING} uppercase text={"executing"}/>,
                                    <Flex width={px(50)} elements={[
                                        <LinearProgress sx={{ width: "100%", borderRadius: "10px" }} variant={"indeterminate"}  color={"warning"}/>
                                    ]}/>
                                ]}/>
                            }/>,

                            <If condition={context?.mode === CommandOrchestrationActionMode.NONE} ifTrue={
                                <AF elements={[
                                    <Dot/>,
                                    <KeyHint label={"Suggested keys:"} keys={matchingCommand?.keyHintGenerator(context?.parameters ?? []) ?? []}/>,
                                ]}/>
                            }/>
                        ]}/>
                    }/>,
                    <FlexRow height={px(23)} gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                        // <Description renderMarkdown={false} text={`Command: '${context?.command}'`}/>,
                        <Description text={"╰›"}/>,

                        <If condition={context?.command !== undefined} ifTrue={
                            <KeyHint keys={[context?.command as string]}/>
                        } ifFalse={
                            <Box paddingY={px(2)} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(6) }} opaque paddingX={px(6)} elements={[
                                <Text
                                    whitespace={"nowrap"}
                                    text={"Command"}
                                    renderMarkdown={true}
                                    coloredText
                                    visualMeaning={VM.WARNING}
                                    type={TextType.secondaryDescription}
                                    fontSize={px(11)}
                                />
                            ]}/>
                        }/>,
                        <Dot/>,
                        <KeyHint keys={context?.parameters ?? []}/>
                    ]}/>
                ]}/>
            );
        }, "key-command-hint");
    }
}

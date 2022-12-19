import {BernieComponent} from "../../../sql/logic/BernieComponent";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {AtlasMain, AtlasMainLocalState} from "../../AtlasMain";
import {State} from "../../../sql/logic/state/State";
import {Description} from "../../../sql/components/lo/Description";
import {Flex, FlexRow} from "../../../sql/components/lo/FlexBox";
import {Align} from "../../../sql/logic/style/Align";
import {Dot} from "../../../sql/components/lo/Dot";
import {KeyHint} from "../../../sql/components/lo/KeyHint";
import {px} from "../../../sql/logic/style/DimensionalMeasured";
import {createMargin} from "../../../sql/logic/style/Margin";
import {If} from "../../../sql/components/logic/If";
import {Text, TextType} from "../../../sql/components/lo/Text";
import {Box} from "../../../sql/components/lo/Box";
import {VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {CommandOrchestrationActionMode} from "../CommandOrchestrationActionMode";
import {AF} from "../../../sql/components/logic/ArrayFragment";
import {LinearProgress} from "@mui/material";
import {CommandOrchestrationFinishState} from "../CommandOrchestrationFinishState";
import {KeyCommandOption} from "../KeyCommandOption";
import {CommandOrchestrator} from "../CommandOrchestrator";

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
                            return (
                                <Flex margin={createMargin(0, 0, t.gaps.defaultGab.measurand, 0)} gap={px()} elements={options.map((kco, i) => {
                                    const showDescription = kco.description !== undefined && kco.description.trim().length > 0;
                                    return (
                                        <FlexRow height={px(20)} gap={t.gaps.smallGab} align={Align.CENTER} elements={[
                                            AtlasMain.atlas().component(() => {
                                                const index: number = context?.selectedOptionIndex ?? -1;
                                                const isSelected = i === index;
                                                return (
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
                                                    }/>
                                                );
                                            }, CommandOrchestrator.OPTION_INDEX_UPDATE_CHANNEL),
                                            <Description text={kco.title} bold/>,
                                            showDescription ? (<></>) : (
                                                <>
                                                    <Dot/>
                                                    <Description text={kco.description as string}/>
                                                </>
                                            )
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

                            (() => {
                                if (context?.mode === CommandOrchestrationActionMode.NONE) {
                                    const keys = matchingCommand?.keyHintGenerator(context?.parameters ?? []) ?? [];
                                    if (keys.length === 0) return <></>;
                                    return (
                                        <AF elements={[
                                            <Dot/>,
                                            <KeyHint label={"Suggested keys:"} keys={keys}/>
                                        ]}/>
                                    );
                                } else return <></>;
                            })()
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

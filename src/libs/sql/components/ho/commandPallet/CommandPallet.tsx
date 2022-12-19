import React from "react";
import {Text} from "../../lo/Text";
import Modal from "react-modal";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../../../logic/style/Themeable";
import {App, utilizeGlobalTheme} from "../../../logic/app/App";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Input} from "../../lo/Input";
import {FlexBox} from "../../lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Separator} from "../../lo/Separator";
import {CodeEditor} from "../../lo/CodeEditor";
import {cs} from "../../../logic/state/State";
import {DebugEditorLocalState} from "../../../pages/editor/debug/DebugEditor";

export type CommandPalletProps = {
    isOpen: boolean
}

export type CommandPalletLocalState = {
    search: string,
    placeholder: string,
}

export class CommandPallet extends React.Component<CommandPalletProps, any> {

    private readonly local = cs<CommandPalletLocalState>({
        search: "",
        placeholder: "Search of jump to..."
    });

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const mc: MeaningfulColors = getMeaningfulColors(ObjectVisualMeaning.INFO, theme);
        return (
            <Modal isOpen={this.props.isOpen} closeTimeoutMS={0} onRequestClose={event => {
                App.app().callAction("close-command-pallet");
            }} style={{
                overlay: {
                    zIndex: 2000,
                    background: theme.colors.backdropColor.css()
                },
                content: {
                    zIndex: 2001,
                    borderRadius: theme.radii.defaultObjectRadius.css(),
                    margin: "10vh auto",
                    background: theme.colors.backgroundHighlightColor.css(),
                    borderColor: theme.colors.borderPrimaryColor.css(),
                }
            }}>
                <FlexBox flexDir={FlexDirection.COLUMN}>
                    <CodeEditor
                        value={this.local.state.search}
                        upstreamHook={value => {

                        }}
                        theme={theme.mode}
                        debounce={true}
                        debounceMS={300}
                        classnames={["cm"]}
                        placeholder={this.local.state.placeholder}
                    />
                    <Separator/>
                    <Text text={"Hey, I'm the modal you always looked for!"}/>
                </FlexBox>
            </Modal>
        );
    }
}

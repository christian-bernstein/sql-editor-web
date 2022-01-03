import React from "react";
import {Text} from "./Text";
import Modal from "react-modal";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {App, utilizeGlobalTheme} from "../logic/App";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {Input} from "./Input";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/FlexDirection";
import {Separator} from "./Separator";

export type CommandPalletProps = {
    isOpen: boolean
}

export class CommandPallet extends React.Component<CommandPalletProps, any> {

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
                    <Input label={"Command"} autoFocus={true}/>
                    <Separator/>
                    <Text text={"Hey, I'm the modal you always looked for!"}/>
                </FlexBox>
            </Modal>
        );
    }
}
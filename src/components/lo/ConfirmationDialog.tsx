import {BC} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {ConfirmationConfig, ConfirmationType} from "../../logic/ConfirmationConfig";
import {StaticDrawerMenu} from "./StaticDrawerMenu";
import {Flex} from "./FlexBox";
import {DrawerHeader} from "./DrawerHeader";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Button} from "./Button";
import {LiteGrid} from "./LiteGrid";
import {utilizeGlobalTheme} from "../../logic/app/App";
import {AF} from "../logic/ArrayFragment";
import {Text} from "./Text";
import {If} from "../logic/If";
import {Align} from "../../logic/style/Align";

export type ConfirmationDialogProps = {
    config: ConfirmationConfig
    caller: BC<any, any, any>
}

export class ConfirmationDialog extends BC<ConfirmationDialogProps, any, any> {

    componentRender(p: ConfirmationDialogProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const c = p.config;

        return (
            <StaticDrawerMenu body={props => (
                <Flex fw elements={[
                    <DrawerHeader
                        header={c.title}
                        description={c.description}
                        enableBadge
                        badgeVM={c.vm}
                        badgeText={"User Confirmation"}
                    />,
                    <If condition={c.text !== undefined} ifTrue={
                        <Text align={Align.CENTER} text={c.text as string} coloredText fontSize={px(11)} visualMeaning={c.vm}/>
                    }/>,

                    <Flex fw padding paddingX={px(25)} elements={[
                        (() => {
                            switch (c.type) {
                                case ConfirmationType.CONFIRM_ONLY:
                                    return (
                                        <Button width={percent(100)} text={"Confirm"} onClick={() => {
                                            c.actions.onConfirm(p.caller);
                                        }}/>
                                    );
                                case ConfirmationType.CONFIRM_OR_CANCEL:
                                    return (
                                        <LiteGrid columns={2} gap={utilizeGlobalTheme().gaps.smallGab} children={
                                            <AF elements={[
                                                <Button opaque visualMeaning={c.vm} width={percent(100)} text={"Confirm"} onClick={() => {
                                                    c.actions.onConfirm(p.caller);
                                                }}/>,
                                                <Button width={percent(100)} text={"Cancel"} onClick={() => {
                                                    c.actions.onCancel(p.caller);
                                                }}/>
                                            ]}/>
                                        }/>
                                    );
                            }
                        })()
                    ]}/>,
                ]}/>
            )}/>
        );
    }
}

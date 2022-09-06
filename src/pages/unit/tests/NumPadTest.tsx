import {BernieComponent} from "../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {AF} from "../../../components/logic/ArrayFragment";
import {Button} from "../../../components/lo/Button";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {If} from "../../../components/logic/If";
import {Text, TextType} from "../../../components/lo/Text";
import {Cursor} from "../../../logic/style/Cursor";

import clickSound from "../../../assets/sound/click.mp3";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {Box} from "../../../components/lo/Box";
import {createMargin} from "../../../logic/style/Margin";
import styled from "styled-components";
import {Icon} from "../../../components/lo/Icon";

import {ReactComponent as DeleteIcon} from "../../../assets/icons/ic-16/ic16-chevron-left.svg";
import {SoundEffectProps} from "../../../components/props/SoundEffectProps";
import {getOr} from "../../../logic/Utils";


export class NumPadTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "numpad-test",
        displayName: "Numpad test",
        element: NumPadTest,
        factory: Elem => <Elem/>
    });

    private openNumpadDialog() {
        this.dialog(
            <StaticDrawerMenu width={percent(30)} body={props => (
                <AF elements={[
                    <Numpad
                        length={6}
                        maxAttempts={3}
                        validator={value => Number(value.join("")) === 230121}
                        enableSounds={false}
                        actions={{
                            onSuccess: component => {
                                setTimeout(() => {
                                    this.closeLocalDialog();

                                    setTimeout(() => {
                                        this.dialog(
                                            <StaticDrawerMenu body={() => (
                                                <Text text={"SUCCESS"}/>
                                            )}/>
                                        );
                                    }, 250);
                                }, 500);
                            }
                        }}
                    />
                ]}/>
            )}/>
        );
    }

    componentDidMount() {
        super.componentDidMount();
        this.openNumpadDialog();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Button text={"Open numpad validation"} onClick={() => this.openNumpadDialog()}/>
        );
    }
}

export interface PinPadActions {
    onSuccess?(component: Numpad): void,
    onAttemptsExceeded?(component: Numpad): void,
}

export type NumpadProps = SoundEffectProps & {
    length: number,
    validator: (value: Array<number>) => boolean,
    maxAttempts?: number,
    actions: PinPadActions,
    header?: string,
    description?: string
}

export type NumpadLocalState = {
    value: Array<number>,
    validState: NumpadValidationState,
    attempts: number,
    numpadState: NumpadState,
    clipboardValue?: string
}

export enum NumpadValidationState {
    NEUTRAL,
    VALID,
    INVALID
}

export enum NumpadState {
    VALID,
    INTERNAL_ERROR,
    EXCEEDED_ATTEMPTS,
    INVALID,
    NEUTRAL
}

export class Numpad extends BernieComponent<NumpadProps, any, NumpadLocalState> {

    constructor(props: NumpadProps) {
        super(props, undefined, {
            value: [],
            validState: NumpadValidationState.NEUTRAL,
            attempts: 0,
            numpadState: NumpadState.NEUTRAL
        });
    }

    private isNumpadLocked(): boolean {
        return this.local.state.numpadState !== NumpadState.NEUTRAL
            && this.local.state.numpadState !== NumpadState.INTERNAL_ERROR
            && this.local.state.numpadState !== NumpadState.INVALID;
    }

    private triggerValidation() {
        const currentNumpadState = this.local.state.numpadState;
        const lockedState = this.isNumpadLocked();
        const attempts = this.local.state.attempts;

        if (this.local.state.value.length === this.props.length) {
            // Pre-Validation completed, can execute Main-Validation
            const valid = this.props.validator(this.local.state.value);

            if (valid) {
                this.local.setStateWithChannels({
                    validState: NumpadValidationState.VALID,
                    numpadState: NumpadState.VALID
                }, ["pin-display"], () => {
                    if (this.local.state.numpadState === NumpadState.VALID) {
                        this.props.actions.onSuccess?.(this);
                    }
                });
            } else {
                this.local.setState({
                    attempts: this.local.state.attempts + 1
                });

                this.local.setStateWithChannels({
                    validState: NumpadValidationState.INVALID,
                    numpadState: (this.local.state.attempts >= getOr(this.props.maxAttempts, 6))
                        ? NumpadState.EXCEEDED_ATTEMPTS
                        : NumpadState.INVALID
                }, ["pin-display"], () => {
                    if (this.local.state.numpadState === NumpadState.EXCEEDED_ATTEMPTS) {
                        this.props.actions.onAttemptsExceeded?.(this);
                    }

                    setTimeout(() => {
                        this.local.setStateWithChannels({
                            validState: NumpadValidationState.NEUTRAL,
                            value: []
                        }, ["pin-display"])
                    }, 1000);
                });
            }
        }

        const channels: Array<string> = ["pin-display"];

        if (currentNumpadState !== this.local.state.numpadState || attempts !== this.local.state.attempts) {
            // Numpad state has changed
            channels.push("information");
        }

        if (lockedState !== this.isNumpadLocked()) {
            // Numpad-locked state has changed
            channels.push("number-field");
        }

        this.rerender(...channels);
    }

    componentRender(p: NumpadProps, s: any, l: NumpadLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw align={Align.CENTER} elements={[
                <DrawerHeader
                    header={p.header === undefined ? "Enter PIN" : p.header}
                    description={p.description === undefined ? `Enter your **${p.length}-digit** PIN. You are required to enter a PIN because of additional security precautions.` : p.description}
                    badgeText={"Security"}
                    badgeVM={VM.UI_NO_HIGHLIGHT}
                    enableBadge
                />,

                this.component(local => {

                    switch (local.state.validState) {
                        case NumpadValidationState.INVALID:
                            const ErrorWrapper = styled.span`
                              .incorrect {
                                animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                                transform: translate3d(0, 0, 0);
                                backface-visibility: hidden;
                                perspective: 1000px;
                              }
        
                              @keyframes shake {
                                10%, 90% {
                                  transform: translate3d(-1px, 0, 0);
                                }
        
                                20%, 80% {
                                  transform: translate3d(2px, 0, 0);
                                }
        
                                30%, 50%, 70% {
                                  transform: translate3d(-4px, 0, 0);
                                }
        
                                40%, 60% {
                                  transform: translate3d(4px, 0, 0);
                                }
                              }
                            `;

                            return (
                                <ErrorWrapper children={
                                    <FlexRow classnames={["incorrect"]} margin={createMargin(40, 0, 40, 0)} gap={t.gaps.defaultGab} elements={
                                        Array.from(Array(p.length).keys()).map((_, i) => (
                                            <If condition={local.state.value[i] === undefined} ifTrue={
                                                <Box noPadding width={px(14)} height={px(14)} borderRadiiConfig={{
                                                    enableCustomBorderRadii: true,
                                                    fallbackCustomBorderRadii: px(500)
                                                }}/>
                                            } ifFalse={
                                                <Box noPadding width={px(14)} opaque visualMeaning={VM.ERROR} height={px(14)} borderRadiiConfig={{
                                                    enableCustomBorderRadii: true,
                                                    fallbackCustomBorderRadii: px(500)
                                                }}/>
                                            }/>
                                        ))
                                    }/>
                                }/>
                            );
                        case NumpadValidationState.NEUTRAL:
                            return (
                                <FlexRow margin={createMargin(40, 0, 40, 0)} gap={t.gaps.defaultGab} elements={
                                    Array.from(Array(p.length).keys()).map((_, i) => (
                                        <If condition={local.state.value[i] === undefined} ifTrue={
                                            <Box noPadding width={px(14)} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        } ifFalse={
                                            <Box noPadding width={px(14)} opaque visualMeaning={VM.WARNING} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        }/>
                                    ))
                                }/>
                            );
                        case NumpadValidationState.VALID:
                            return (
                                <FlexRow margin={createMargin(40, 0, 40, 0)} gap={t.gaps.defaultGab} elements={
                                    Array.from(Array(p.length).keys()).map((_, i) => (
                                        <If condition={local.state.value[i] === undefined} ifTrue={
                                            <Box noPadding width={px(14)} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        } ifFalse={
                                            <Box noPadding width={px(14)} opaque visualMeaning={VM.SUCCESS_DEFAULT} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        }/>
                                    ))
                                }/>
                            );
                    }
                }, "pin-display"),

                this.component(local => {
                    return (
                        <If condition={this.local.state.attempts > 0 && this.local.state.validState !== NumpadValidationState.VALID && this.local.state.numpadState !== NumpadState.EXCEEDED_ATTEMPTS} ifTrue={
                            <Flex fw align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Text text={"Incorrect PIN"} bold coloredText visualMeaning={VM.ERROR}/>,
                                <Text text={`${getOr(p.maxAttempts, 6) - this.local.state.attempts} of ${getOr(p.maxAttempts, 6)} attempts left`} coloredText visualMeaning={VM.ERROR} fontSize={px(11)}/>,

                                <LiteGrid gap={t.gaps.smallGab} columns={p.maxAttempts} children={
                                    <AF elements={
                                        Array.from(Array(p.maxAttempts).keys()).reverse().map((_, i) => (
                                            <Flex fw fh align={Align.CENTER} children={
                                                <If condition={this.local.state.attempts <= i} ifTrue={
                                                    <Box noPadding width={percent(100)} opaque visualMeaning={VM.ERROR} height={px(5)} borderRadiiConfig={{
                                                        enableCustomBorderRadii: true,
                                                        fallbackCustomBorderRadii: px(500)
                                                    }}/>
                                                } ifFalse={
                                                    <Box noPadding width={percent(100)} visualMeaning={VM.ERROR} height={px(5)} borderRadiiConfig={{
                                                        enableCustomBorderRadii: true,
                                                        fallbackCustomBorderRadii: px(500)
                                                    }}/>
                                                }/>
                                            }/>
                                        ))
                                    }/>
                                }/>
                            ]}/>
                        }/>
                    );
                }, "information"),

                this.component(local => {
                    return (
                        <If condition={this.local.state.validState === NumpadValidationState.VALID} ifTrue={
                            <Flex fw align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Text text={"Correct PIN"} bold coloredText visualMeaning={VM.SUCCESS_DEFAULT}/>
                            ]}/>
                        }/>
                    );
                }, "information"),

                this.component(local => {
                    return (
                        <If condition={this.local.state.numpadState === NumpadState.EXCEEDED_ATTEMPTS} ifTrue={
                            <Flex fw align={Align.CENTER} gap={t.gaps.smallGab} elements={[
                                <Text text={"Exceeded PIN attempts"} bold coloredText visualMeaning={VM.ERROR}/>,
                                <Text text={"Contact an administrator of your team to reset your PIN"} align={Align.CENTER} fontSize={px(11)} coloredText visualMeaning={VM.ERROR}/>,
                            ]}/>
                        }/>
                    );
                }, "information"),

                this.component(local => {
                    return (
                        <LiteGrid columns={3} gap={t.gaps.smallGab} children={
                            <AF elements={
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, "fn1", 0, "fn2"].map(i => {
                                    if (i === "fn2") {
                                        // Delete button
                                        return this.component(local => {
                                            const nonEmpty = local.state.value.length > 0;

                                            return (
                                                <Button
                                                    border={false}
                                                    vibrationPattern={[10]}
                                                    vibrateOnClick={nonEmpty}
                                                    highlight={false}
                                                    cursor={nonEmpty ? Cursor.pointer : Cursor.notAllowed}
                                                    height={px(60)}
                                                    width={percent(100)}
                                                    onClick={() => {
                                                        if (nonEmpty && local.state.validState !== NumpadValidationState.VALID) {
                                                            this.local.state.value.pop();
                                                            this.rerender("pin-display");
                                                        }
                                                    }}
                                                    children={
                                                        <Icon
                                                            icon={<DeleteIcon/>}
                                                            visualMeaning={VM.UI_NO_HIGHLIGHT}
                                                            size={px(16)}
                                                            colored={!nonEmpty}
                                                        />
                                                    }
                                                />
                                            );
                                        }, "pin-display");
                                    } else if (i === "fn1") {
                                        return (
                                            <span/>
                                        );
                                    }

                                    return (
                                        <If condition={i !== null} ifTrue={

                                            <If condition={this.local.state.numpadState !== NumpadState.NEUTRAL && this.local.state.numpadState !== NumpadState.INTERNAL_ERROR} ifTrue={
                                                <Button cursor={Cursor.notAllowed} height={px(60)} width={percent(100)} children={
                                                    <Text text={String(i)} bold type={TextType.displayText} coloredText visualMeaning={VM.UI_NO_HIGHLIGHT}/>
                                                }/>
                                            } ifFalse={
                                                <Button highlight vibrationPattern={[10]} vibrateOnClick cursor={Cursor.pointer} shrinkOnClick height={px(60)} width={percent(100)} children={
                                                    <Text text={String(i)} bold type={TextType.displayText}/>
                                                } onClick={() => {
                                                    if (this.props.enableSounds) {
                                                        // TODO: Get click sound from the sound-lib prop
                                                        new Audio(clickSound).play().then(() => {});
                                                    }

                                                    this.local.state.value.push(Number(i));
                                                    // this.rerender("pin-display");

                                                    this.triggerValidation();
                                                }}/>
                                            }/>


                                        } ifFalse={
                                            <span/>
                                        }/>
                                    );
                                })
                            }/>
                        }/>
                    );
                }, "number-field")
            ]}/>
        );
    }
}

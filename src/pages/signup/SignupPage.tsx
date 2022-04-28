import {Screen} from "../../components/lo/Page";
import {AppHeader} from "../../components/lo/AppHeader";
import {BernieComponent} from "../../logic/BernieComponent";
import {getMeaningfulColors, Themeable} from "../../logic/style/Themeable";
import React from "react";
import {Icon} from "../../components/lo/Icon";
import {ReactComponent as BackIcon} from "../../assets/icons/ic-20/ic20-arrow-left.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {ReactComponent as SuccessIcon} from "../../assets/icons/ic-16/ic16-check.svg";
import {ReactComponent as WarningIcon} from "../../assets/icons/ic-16/ic16-warning.svg";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Justify} from "../../logic/style/Justify";
import {Input} from "../../components/lo/Input";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../components/lo/Text";
import {Box} from "../../components/lo/Box";
import {LinearProgress} from "@mui/material";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {App, utilizeGlobalTheme} from "../../logic/app/App";
import _ from "lodash";
import {Align} from "../../logic/style/Align";
import {If} from "../../components/logic/If";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {Badge} from "../../components/lo/Badge";
import {Group} from "../../components/lo/Group";
import {Orientation} from "../../logic/style/Orientation";
import {CheckUserAttributeAvailabilityRequestPacketData} from "../../packets/out/CheckUserAttributeAvailabilityRequestPacketData";
import {UserAttributeType} from "../../logic/data/UserAttributeType";
import {UsernameValidState} from "./UsernameValidState";
import {CheckUserAttributeAvailabilityResponsePacketData} from "../../packets/in/CheckUserAttributeAvailabilityResponsePacketData";
import {BarLoader, PuffLoader} from "react-spinners";
import {UsernameValidStateDisplayMeta} from "./UsernameValidStateDisplayMeta";
import {Button} from "../../components/lo/Button";
import {ServerConnectionIcon} from "../../components/ho/serverConnectionIcon/ServerConnectionIcon";
import {Separator} from "../../components/lo/Separator";
import {CreateUserRequestPacketData} from "../../packets/out/CreateUserRequestPacketData";
import {CreateUserResponsePacketData} from "../../packets/in/CreateUserResponsePacketData";
import {Centered} from "../../components/lo/PosInCenter";
import {UserCreationResult} from "../../logic/data/UserCreationResult";

export type SignupPageProps = {
    callingFrom: string
}

export type SignupPageLocalState = {
    email: string,
    firstname: string,
    lastname: string
    usernameNotEditedYet: boolean
    username: string,
    usernameValidState: UsernameValidState,
    pendingUsernameUpdate: boolean,
    password: string,
    passwordNotEditedYet: boolean,
    passwordRepeat: string,
    passwordRepeatMatching: boolean,
    passwordDebouncedChangeHandler: () => void,
    usernameDebouncedChangeHandler: () => void,
    passwordFilters: PasswordFilter[],
    anyPending: boolean,
    lastServerSubmitResponse?: CreateUserResponsePacketData,
    showServerSubmitResponse: boolean,
    serverSubmitResponseDisplayTimeMS: number,
    processingAccountCreation: boolean
}

export interface PasswordFilter {
    descriptor: string,
    filter: (password: string) => PasswordPower
}

export enum PasswordPower {
    TOO_WEAK, WEAK, STRONG
}

export type PowerDisplayMeta = {
    title: string,
    vm: ObjectVisualMeaning,
    iconFactory: () => JSX.Element
}

export type UserCreationResultDisplayMeta = {
    text: string,
    visualMeaning: ObjectVisualMeaning
}

/**
 * todo add link to https://its.lafayette.edu/policies-draft/strongpasswords/
 */
export class SignupPage extends BernieComponent<SignupPageProps, any, SignupPageLocalState> {

    private static readonly usernameValidDisplayMetaRegister: Map<UsernameValidState, UsernameValidStateDisplayMeta> = new Map<UsernameValidState, UsernameValidStateDisplayMeta>([
        [UsernameValidState.VALID, {
            descriptor: "valid"
        }],
        [UsernameValidState.USERNAME_ALREADY_TAKEN, {
            descriptor: "username already taken"
        }],
        [UsernameValidState.EMPTY, {
            descriptor: "empty"
        }],
    ]);

    private static readonly userCreationResultToDisplayRegister: Map<UserCreationResult, UserCreationResultDisplayMeta> = new Map<UserCreationResult, UserCreationResultDisplayMeta>([
        [UserCreationResult.OK, {
            visualMeaning: ObjectVisualMeaning.SUCCESS,
            text: "🎉 Congrats $name, your account is online!"
        }],
        [UserCreationResult.INTERNAL_ERROR, {
            visualMeaning: ObjectVisualMeaning.ERROR,
            text: "👾 Internal infrastructure error **(ERR-Code: 1)**"
        }],
        [UserCreationResult.USERNAME_ALREADY_TAKEN, {
            visualMeaning: ObjectVisualMeaning.ERROR,
            text: "Username already taken"
        }],
        [UserCreationResult.UUID_ALREADY_TAKEN, {
            visualMeaning: ObjectVisualMeaning.ERROR,
            text: "👾 Internal infrastructure error **(ERR-Code: 2)**"
        }]
    ]);

    private static readonly pwPowerToDisplayRegister: Map<PasswordPower, PowerDisplayMeta> = new Map<PasswordPower, PowerDisplayMeta>([
        [PasswordPower.WEAK, {
            title: "weak",
            vm: ObjectVisualMeaning.WARNING,
            iconFactory: () => <WarningIcon/>
        }],
        [PasswordPower.STRONG, {
            title: "strong",
            vm: ObjectVisualMeaning.SUCCESS,
            iconFactory: () => <SuccessIcon/>
        }],
        [PasswordPower.TOO_WEAK, {
            title: "too weak",
            vm: ObjectVisualMeaning.ERROR,
            iconFactory: () => <ErrorIcon/>
        }]
    ]);

    private static readonly pwLenFilter: PasswordFilter = {
        descriptor: "At least 8 characters *(12 is strong)*",
        filter: password => {
            if (password.length >= 12) {
                return PasswordPower.STRONG;
            } else if (password.length >= 8) {
                return PasswordPower.WEAK;
            } else {
                return PasswordPower.TOO_WEAK;
            }
        }
    }

    private static readonly pwLowercaseAndUppercaseFilter: PasswordFilter = {
        descriptor: "Uppercase and lowercase letters",
        filter: password => {
            if (password.search(/[A-Z]/) == -1 || password.search(/[a-z]/) == -1) {
                return PasswordPower.TOO_WEAK;
            } else {
                return PasswordPower.STRONG;
            }
        }
    }

    private static readonly pwAlphanumericalFilter: PasswordFilter = {
        descriptor: "Mixture of letters and numbers",
        filter: password => {
            if (password.search(/\w/) == -1 || password.search(/\d/) == -1) {
                return PasswordPower.TOO_WEAK;
            } else {
                return PasswordPower.STRONG;
            }
        }
    }

    constructor(props: SignupPageProps) {
        super(props, undefined, {
            email: "",
            firstname: "",
            lastname: "",
            usernameNotEditedYet: true,
            username: "",
            usernameValidState: UsernameValidState.EMPTY,
            pendingUsernameUpdate: false,
            password: "",
            passwordNotEditedYet: true,
            passwordRepeat: "",
            passwordRepeatMatching: true,
            passwordDebouncedChangeHandler: _.debounce(() => {
                const local = this.local;
                local.setStateWithChannels({
                    passwordRepeatMatching: local.state.password === local.state.passwordRepeat
                }, ["password-group", "summary"]);
            }, 1000),
            usernameDebouncedChangeHandler: _.debounce(() => {
                const local = this.local;
                App.app().getConnector().call({
                    protocol: "base",
                    packetID: "CheckUserAttributeAvailabilityRequestPacketData",
                    data: {
                        type: UserAttributeType.USERNAME,
                        attribute: local.state.username
                    } as CheckUserAttributeAvailabilityRequestPacketData,
                    callback: {
                        handle: (connector, packet) => {
                            const data = packet.data as CheckUserAttributeAvailabilityResponsePacketData;
                            this.local.setStateWithChannels({
                                usernameValidState: data.available ? UsernameValidState.VALID : UsernameValidState.USERNAME_ALREADY_TAKEN,
                                pendingUsernameUpdate: false
                            }, ["username"], () => this.updatePendingList());
                        }
                    }
                });
            }, 3000),
            passwordFilters: [
                SignupPage.pwLenFilter,
                SignupPage.pwLowercaseAndUppercaseFilter,
                SignupPage.pwAlphanumericalFilter,
            ],
            anyPending: false,
            showServerSubmitResponse: false,
            serverSubmitResponseDisplayTimeMS: 10000,
            processingAccountCreation: false
        });
        this.registerPasswordStrengthIndicatorAssembly();
    }

    private static createFilterDisplay(text: string, power: PasswordPower): JSX.Element {
        const meta = SignupPage.pwPowerToDisplayRegister.get(power) as PowerDisplayMeta;
        return (
            <Text enableLeftAppendix text={text} leftAppendix={
                <Icon icon={meta.iconFactory()} colored visualMeaning={meta.vm}/>
            }/>
        );
    }

    private registerPasswordStrengthIndicatorAssembly() {
        const theme = utilizeGlobalTheme();

        this.assembly.assembly("password-strength-indicator", (theme, props1) => {
            const password = this.local.state.password;
            const powers: PasswordPower[] = this.local.state.passwordFilters.map(filter => filter.filter(password));
            const sort = powers.sort();
            const minPower: PasswordPower = sort.length > 0 ? sort[0] : PasswordPower.STRONG;
            const minPowerMeta = SignupPage.pwPowerToDisplayRegister.get(minPower) as PowerDisplayMeta;
            const mc = getMeaningfulColors(minPowerMeta.vm, theme);
            let strengthIndex: number;

            // todo better way to calculate strength index
            switch (minPower) {
                case PasswordPower.STRONG:
                    strengthIndex = 100;
                    break;
                case PasswordPower.WEAK:
                    strengthIndex = 70;
                    break;
                case PasswordPower.TOO_WEAK:
                    strengthIndex = 10;
                    break;
            }

            return (
                <>
                    <Separator orientation={Orientation.HORIZONTAL} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                    <Box width={percent(100)}>
                        <FlexBox gap={theme.gaps.smallGab}>
                            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}
                                     justifyContent={Justify.SPACE_BETWEEN}
                                     width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                                <Text text={"Password strength"} type={TextType.secondaryDescription} bold/>
                                <Badge visualMeaning={minPowerMeta.vm} opaque>
                                    <Text text={minPowerMeta.title} uppercase bold coloredText
                                          visualMeaning={minPowerMeta.vm}/>
                                </Badge>
                            </FlexBox>

                            <LinearProgress sx={{
                                width: "100%",
                                height: "8px",
                                borderRadius: "9999px",
                                border: "1px solid " + theme.colors.borderPrimaryColor.css(),
                                backgroundColor: mc.lighter.withAlpha(.1).css(),
                                ['& .MuiLinearProgress-bar']: {
                                    backgroundColor: mc.lighter.css(),
                                    borderRight: (strengthIndex === 100 ? "0" : "1px") + " solid " + theme.colors.borderPrimaryColor.css(),
                                }
                            }} variant="determinate" value={strengthIndex}/>

                            {this.local.state.passwordFilters.map(filter => {
                                const power: PasswordPower = filter.filter(password);
                                return SignupPage.createFilterDisplay(filter.descriptor, power);
                            })}

                            {/*<Text enableLeftAppendix text={"At least one special character, e.g., **! @ # ? ]**"} leftAppendix={
                            <Icon icon={<ErrorIcon/>} colored visualMeaning={ObjectVisualMeaning.ERROR}/>
                        }/>*/}
                        </FlexBox>
                    </Box>
                </>
            );
        });
    }

    private updatePendingList() {
        const ls = this.local.state;
        let anyPendingState;
        if (ls.anyPending) {
            if (!ls.pendingUsernameUpdate) {
                anyPendingState = false;
            }
        } else {
            if (ls.pendingUsernameUpdate) {
                anyPendingState = true;
            }
        }

        this.local.setStateWithChannels({
            anyPending: anyPendingState
        }, ["any-pending"]);

    }

    componentRender(p: SignupPageProps, s: any, l: SignupPageLocalState, t: Themeable.Theme): JSX.Element | undefined {
        return (
            <Screen>
                <FlexBox flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN} height={percent(100)}
                         width={percent(100)}>
                    <AppHeader
                        left={<Icon icon={<BackIcon/>} onClick={() => this.goto(p.callingFrom)}/>}
                        right={<ServerConnectionIcon openConnectionMetricsDialog/>}
                        title={"Signup"}
                    />
                    {this.renderLoginForm()}
                </FlexBox>
            </Screen>
        );
    }

    private onUsernameChange(username: string) {
        const local = this.local;
        if (local.state.pendingUsernameUpdate) {
            local.setState({
                username: username,
                usernameNotEditedYet: false
            }, undefined, () => local.state.usernameDebouncedChangeHandler())
        } else {
            local.setStateWithChannels({
                username: username,
                pendingUsernameUpdate: true
            }, ["username"], () => {
                this.updatePendingList();
                local.state.usernameDebouncedChangeHandler();
            })
        }
    }

    private renderNameInput(): JSX.Element {
        return (
            <>
                {this.component(local => {
                    return (
                        <FlexBox width={percent(100)} flexDir={FlexDirection.ROW}>
                            <Text text={"First & lastname"}/>
                        </FlexBox>
                    );
                })}
                <Group width={percent(100)} orientation={Orientation.HORIZONTAL} elements={[
                    <Input
                        label={"Firstname"}
                        key={"firstname-component"}
                        onChange={ev => this.local.setState({
                            firstname: ev.currentTarget.value
                        })}
                    />,
                    <Input
                        label={"Lastname"}
                        key={"lastname-component"}
                        onChange={ev => this.local.setState({
                            lastname: ev.currentTarget.value
                        })}
                    />,
                ]}/>

            </>
        );
    }

    private renderUsernameInput(): JSX.Element {
        const theme = utilizeGlobalTheme();
        return (
            <>
                {this._component(["username"], state => {
                    const vm = this.local.state.usernameValidState === UsernameValidState.VALID ? ObjectVisualMeaning.SUCCESS : ObjectVisualMeaning.ERROR;
                    const meta = SignupPage.usernameValidDisplayMetaRegister.get(this.local.state.usernameValidState) as UsernameValidStateDisplayMeta;
                    return (
                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}
                                 overflowXBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}
                                 justifyContent={Justify.SPACE_BETWEEN}>
                            <Text text={"Username"}/>
                            <If condition={this.local.state.pendingUsernameUpdate} ifTrue={
                                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab} align={Align.CENTER}>
                                    <Badge opaque visualMeaning={ObjectVisualMeaning.WARNING}>
                                        <FlexBox align={Align.CENTER} flexDir={FlexDirection.ROW}
                                                 gap={theme.gaps.smallGab}>
                                            <BarLoader color={theme.colors.warnHighlightColor.css()}
                                                       width={"40px"}/>
                                            <Text text={"pending"} coloredText
                                                  visualMeaning={ObjectVisualMeaning.WARNING} uppercase bold
                                                  type={TextType.secondaryDescription}/>
                                        </FlexBox>
                                    </Badge>
                                </FlexBox>
                            } ifFalse={
                                !this.local.state.usernameNotEditedYet ? (
                                    <Badge opaque visualMeaning={vm}>
                                        <Text coloredText visualMeaning={vm} text={meta.descriptor} uppercase bold
                                              type={TextType.secondaryDescription}/>
                                    </Badge>
                                ) : (
                                    <></>
                                )
                            }/>
                        </FlexBox>
                    );
                })}
                <Input
                    label={"Username"}
                    key={"username-component"}
                    onChange={ev => this.onUsernameChange(ev.currentTarget.value)}
                />
            </>
        );
    }

    private renderEmailInput(): JSX.Element {
        return (
            <>
                {this._component(["email"], state =>
                    <Text text={"Email"}/>
                )}
                <Input
                    label={"Email"}
                    key={"email-component"}
                    type={"email"}
                    onChange={ev => this.local.setState({
                        email: ev.currentTarget.value
                    })}
                />
            </>
        );
    }

    private renderPasswordInput(): JSX.Element {
        const theme = utilizeGlobalTheme();
        return (
            <>
                {this._component(["password", "password-group"], state => <Text text={"Password"}/>)}
                <Group width={percent(100)} orientation={Orientation.VERTICAL} enableSeparators={false} elements={[
                    <Input
                        label={"Password"}
                        key={"password-component"}
                        type={"password"}
                        onChange={ev => {
                            if (this.local.state.passwordNotEditedYet) {
                                this.local.setStateWithChannels({
                                    password: ev.currentTarget.value,
                                    passwordNotEditedYet: false
                                }, ["password-group"], () => this.local.state.passwordDebouncedChangeHandler());
                            } else {
                                this.local.setState({
                                    password: ev.currentTarget.value,
                                }, undefined, () => this.local.state.passwordDebouncedChangeHandler());
                            }
                        }}
                    />,
                    this._component(["password-group"], state => {
                        return (!this.local.state.passwordNotEditedYet ? (
                            this.assembly.render({
                                component: "password-strength-indicator"
                            })
                        ) : <></>);
                    })
                ]}/>
            </>
        );
    }

    private renderPasswordRepeatInput(): JSX.Element {
        const theme = utilizeGlobalTheme();
        return (
            <>
                {this._component(["repeat-password", "password-group"], local =>
                    <FlexBox align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} flexDir={FlexDirection.ROW}
                             width={percent(100)}>
                        <Text text={"Repeat password"}/>
                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                            <If condition={local.state.passwordRepeatMatching} ifTrue={
                                local.state.password.length > 0 ? (
                                    <Badge visualMeaning={ObjectVisualMeaning.SUCCESS} opaque>
                                        <Text
                                            text={"valid"}
                                            bold
                                            uppercase
                                            coloredText
                                            type={TextType.secondaryDescription}
                                            visualMeaning={ObjectVisualMeaning.SUCCESS}
                                        />
                                    </Badge>
                                ) : (
                                    <></>
                                )
                            } ifFalse={
                                <Badge visualMeaning={ObjectVisualMeaning.ERROR} opaque>
                                    <Text
                                        text={"invalid"}
                                        bold
                                        uppercase
                                        coloredText
                                        type={TextType.secondaryDescription}
                                        visualMeaning={ObjectVisualMeaning.ERROR}
                                    />
                                </Badge>
                            }/>
                        </FlexBox>
                    </FlexBox>
                )}
                <Input
                    label={"Repeat password"}
                    key={"repeat-password-component"}
                    type={"password"}
                    onChange={ev => this.local.setState({
                        passwordRepeat: ev.currentTarget.value
                    }, undefined, () => this.local.state.passwordDebouncedChangeHandler())}
                />
            </>
        );
    }

    private createUser() {
        const ls = this.local.state;

        this.local.setStateWithChannels({
            processingAccountCreation: true
        }, ["summary"], () => {
            try {
                App.app().getConnector().call({
                    protocol: "base",
                    packetID: "CreateUserRequestPacketData",
                    data: {
                        firstname: ls.firstname,
                        lastname: ls.lastname,
                        email: ls.email,
                        username: ls.username,
                        password: ls.password
                    } as CreateUserRequestPacketData,
                    callback: {
                        handle: (connector, packet) => {
                            const response: CreateUserResponsePacketData = packet.data;
                            console.info("Received account creation response", response);
                            this.ifActive(() => this.handleServerUserCreateResponse(response));
                        }
                    }
                });
            } catch (e) {
                console.error(e);
                this.local.setStateWithChannels({
                    processingAccountCreation: true
                }, ["summary"]);
            }
        });


    }

    private handleServerUserCreateResponse(response: CreateUserResponsePacketData) {
        this.local.setStateWithChannels({
            lastServerSubmitResponse: response,
            showServerSubmitResponse: true,
            processingAccountCreation: false
        }, ["summary"], () => {
            setTimeout(() => {
                console.log("stopping server display")
                this.local.setStateWithChannels({
                    showServerSubmitResponse: false
                }, ["summary"]);
            }, this.local.state.serverSubmitResponseDisplayTimeMS);
        })
    }

    private renderServerResponse(): JSX.Element {
        return this._component(["summary"], local => {
            const ls = local.state;
            if (ls.showServerSubmitResponse) {
                const response = ls.lastServerSubmitResponse;
                if (response === undefined) {
                    return <></>;
                }
                if (response.success) {
                    return (
                        <Box visualMeaning={ObjectVisualMeaning.SUCCESS} opaque width={percent(100)}>
                            <Centered>
                                <Text text={`🎉 Congrats ${ls.username}, your account is online!`} bold/>
                            </Centered>
                        </Box>
                    );
                } else {
                    const meta = SignupPage.userCreationResultToDisplayRegister.get(response.result) as UserCreationResultDisplayMeta;
                    return (
                        <Box visualMeaning={meta.visualMeaning} opaque width={percent(100)}>
                            <Centered>
                                <Text text={meta.text.replaceAll("$name", ls.username)} bold/>
                            </Centered>
                        </Box>
                    );
                }
            } else {
                return <></>;
            }
        })
    }

    private renderSubmitButton(): JSX.Element {
        return this._component(["any-pending", "summary"], local => {
            const ls = local.state;
            const theme = utilizeGlobalTheme();
            return (
                <If condition={ls.processingAccountCreation} ifTrue={
                    <Box visualMeaning={ObjectVisualMeaning.WARNING} opaque width={percent(100)}>
                        <FlexBox gap={theme.gaps.smallGab} justifyContent={Justify.CENTER} align={Align.CENTER}>
                            <PuffLoader color={theme.colors.warnHighlightColor.css()} size={"24px"}/>
                            <Text text={`🤖 Setting up account..`} bold coloredText/>
                        </FlexBox>
                    </Box>
                } ifFalse={
                    <If condition={ls.anyPending} ifTrue={
                        <Button width={percent(100)} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque>
                            <Text text={"pending"} coloredText
                                  visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} uppercase bold
                                  type={TextType.secondaryDescription}/>
                        </Button>
                    } ifFalse={
                        <If condition={ls.usernameValidState === UsernameValidState.VALID && ls.passwordRepeatMatching}
                            ifTrue={
                                <Button width={percent(100)} shrinkOnClick visualMeaning={ObjectVisualMeaning.SUCCESS} opaque onClick={() => this.createUser()}>
                                    <Text text={"Sign up"} bold/>
                                </Button>
                            } ifFalse={
                            <Button width={percent(100)} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque>
                                <Text text={"Sign up"} bold coloredText visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT}/>
                            </Button>
                        }
                        />
                    }/>
                }/>

            );
        });
    }

    // todo create form input
    private renderLoginForm(): JSX.Element {
        const theme = utilizeGlobalTheme();

        return (
            <FlexBox flexDir={FlexDirection.COLUMN_REVERSE} height={percent(100)} width={percent(100)}
                     overflowYBehaviour={OverflowBehaviour.SCROLL}>
                <FlexBox type={"form"} flexDir={FlexDirection.COLUMN} gap={theme.gaps.smallGab} width={percent(100)}>
                    {this.renderEmailInput()}
                    {this.renderNameInput()}
                    {this.renderUsernameInput()}
                    {this.renderPasswordInput()}
                    {this.renderPasswordRepeatInput()}
                    {this.renderServerResponse()}
                    {this.renderSubmitButton()}
                </FlexBox>
            </FlexBox>
        );
    }
}

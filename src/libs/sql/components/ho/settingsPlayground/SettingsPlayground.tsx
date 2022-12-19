import {BernieComponent} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../lo/StaticDrawerMenu";
import {Flex} from "../../lo/FlexBox";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {AF} from "../../logic/ArrayFragment";
import {DrawerHeader} from "../../lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Justify} from "../../../logic/style/Justify";
import {Align} from "../../../logic/style/Align";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Text, TextType} from "../../lo/Text";
import {Input} from "../../lo/Input";
import React from "react";
import {Button} from "../../lo/Button";
import {createMargin} from "../../../logic/style/Margin";
import {App} from "../../../logic/app/App";
import {IOSwitch} from "../../lo/IOSwitch";
import {SettingsElement} from "../settingsElement/SettingsElement";
import {ListAlt} from "@mui/icons-material";
import {Box} from "../../lo/Box";
import {ObjectJSONDisplay} from "../objectJSONDisplay/ObjectJSONDisplay";
import {AnomalyInfo} from "../anomalyInfo/AnomalyInfo";
import {AnomalyLevel} from "../../../logic/data/AnomalyLevel";

export type SettingsPlaygroundLocalState = {
    compoundID?: string,
    compoundMode?: boolean,

    result?: any
}

export class SettingsPlayground extends BernieComponent<any, any, SettingsPlaygroundLocalState> {

    constructor() {
        super(undefined, undefined, {
            compoundID: "",
            compoundMode: false
        });
    }

    init() {
        super.init();
        this.headerAssembly();
        this.resultAssembly();
        this.formAssembly();
    }

    private headerAssembly() {
        this.assembly.assembly("header", theme => {
            return (
                <DrawerHeader
                    header={"Settings Playground"}
                    enableBadge
                    badgeVM={VM.BETA}
                    badgeText={"development"}
                    description={"Test the settings api in the settings playground"}
                />
            );
        });
    }

    private resultAssembly() {
        this.assembly.assembly("result", theme => {




            if (this.local.state.result === undefined) {
                return (
                    <Box width={percent(100)} children={
                        <Text text={"No result"} align={Align.CENTER} bold coloredText visualMeaning={VM.UI_NO_HIGHLIGHT} type={TextType.secondaryDescription}/>
                    }/>
                );
            }

            const res = this.local.state.result;
            if (typeof res === 'object' && !Array.isArray(res) && res !== null) {
                return (
                    <ObjectJSONDisplay object={res}/>
                );
            } else {
                return (
                    <Box width={percent(100)} children={
                        <Text text={JSON.stringify(res)}/>
                    }/>
                );
            }
        });
    }

    private formAssembly() {
        this.assembly.assembly("form", theme => {
            return (
                <Flex margin={createMargin(40, 0, 0, 0)} width={percent(100)}>

                    <Flex width={percent(100)} gap={theme.gaps.smallGab}>
                        <Flex width={percent(100)} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                            <Text text={"Compound mode"} type={TextType.secondaryDescription}/>
                            <Text text={"optional"} type={TextType.secondaryDescription} uppercase bold coloredText visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} fontSize={px(11)}/>
                        </Flex>

                        <SettingsElement title={"Enable compound mode"} iconConfig={{
                            enable: true,
                            color: theme.colors.betaHighlightColor,
                            iconGenerator: () => <ListAlt/>
                        }} onClick={() => { /* todo implement */ }} appendixGenerator={element => (
                            <IOSwitch value={this.local.state.compoundMode} onChange={(event, checked) => {
                                this.local.setState({
                                    compoundMode: checked
                                });
                            }}/>
                        )}/>


                        <Text text={"Compound mode modifies the response-handling routine. Compound-mode means multiple entries are queried in the same request *(in object form)*"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    </Flex>

                    <Flex width={percent(100)} gap={theme.gaps.smallGab}>
                        <Flex width={percent(100)} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} flexDir={FlexDirection.ROW}>
                            <Text text={"CompoundID"} type={TextType.secondaryDescription}/>
                            <Text text={"optional"} type={TextType.secondaryDescription} uppercase bold coloredText visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} fontSize={px(11)}/>
                        </Flex>
                        <Input fontWeight={"lighter"} defaultValue={this.local.state.compoundID} onChange={ev => {
                            this.local.setState({
                                compoundID: ev.target.value
                            })
                        }}/>
                        <Text text={"Specify the compoundID (*If not in compound-mode this specifies the setting id*). [List of valid compoundIDs](https://github.com/Luka967/websocket-close-codes)"} type={TextType.secondaryDescription} fontSize={px(11)}/>
                    </Flex>

                    <Button width={percent(100)} visualMeaning={VM.INFO} opaque text={"Run request"} onClick={() => {
                        const handler = (val: any) => {
                            this.local.setStateWithChannels({
                                result: val
                            }, ["results"]);
                        }
                        if (this.local.state.compoundID != null) {
                            if (this.local.state.compoundMode) {
                                App.app().settings().getAPI().requestCompound(this.local.state.compoundID).then(value => {
                                    handler(value);
                                });
                            } else {
                                App.app().settings().getAPI().request(this.local.state.compoundID).then(value => {
                                    handler(value);
                                });
                            }
                        } else {
                            this.dialog(
                                <AnomalyInfo anomaly={{
                                    level: AnomalyLevel.WARN,
                                    description: "Cannot call settings api, because compound id is undefined"
                                }}/>
                            )
                        }
                    }}/>
                </Flex>
            );
        });
    }

    componentRender(p: any, s: any, l: SettingsPlaygroundLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => {
                return (
                    <Flex width={percent(100)} children={
                        <AF elements={[
                            this.a("header"),
                            this.component(local => this.a("result"), "results"),
                            this.a("form"),
                        ]}/>
                    }/>
                );
            }}/>
        );
    }

}

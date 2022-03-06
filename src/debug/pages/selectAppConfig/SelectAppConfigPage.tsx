import React, {useMemo, useState} from "react";
import styled from "styled-components";
import {Themeable} from "../../../Themeable";
import {utilizeGlobalTheme} from "../../../logic/App";
import {AppConfigSelectionData, AppConfigSelector} from "../../components/AppConfigSelector";
import {Text, TextType} from "../../../components/Text";
import {Dimension} from "../../../logic/style/Dimension";
import {Input} from "../../../components/Input";
import {dimension, px} from "../../../logic/style/DimensionalMeasured";
import {FlexBox} from "../../../components/FlexBox";
import {v4} from "uuid";
import _ from "lodash";
import {Icon} from "../../../components/Icon";
import {ReactComponent as FilterIcon} from "../../../assets/icons/ic-24/ic24-filter.svg";
import {ReactComponent as DebugIcon} from "../../../assets/icons/ic-20/ic20-bug.svg";
import {ReactComponent as Logo} from "../../../assets/retired_logo_v2.svg";
import {Togglable} from "../../../components/Togglable";
import {ObjectVisualMeaning} from "../../../logic/ObjectVisualMeaning";
import {AppHeader} from "../../../components/AppHeader";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {LiteGrid} from "../../../components/LiteGrid";
import {getOr} from "../../../logic/Utils";
import {Environment} from "../../../logic/Environment";


export type SelectAppConfigPageProps = {
    configs: AppConfigSelectionData[],
    onSelection: (data: AppConfigSelectionData) => void,
}

export type SelectAppConfigPageState = {
    filter?: string,
    viewDebugProfiles: boolean
}

function getConfigs(configs: AppConfigSelectionData[], filter: string, debug: boolean): AppConfigSelectionData[] {
    const data = configs.filter(config => config.title.toLocaleLowerCase().match(filter));
    if (!debug) {
        return data.filter(config => !config.config.debugMode);
    } else {
        return data;
    }
}

// <ProfilePicture name={"chris"}/>
export const SelectAppConfigPageV2: React.FC<SelectAppConfigPageProps> = props => {
    const [debug, setDebug] = Environment.usePersistent(false, "show-debug-configs", "debug");
    const [state, setState] = useState<SelectAppConfigPageState>({
        filter: undefined,
        viewDebugProfiles: debug
    });

    const debouncedOnChange = useMemo(() => _.debounce((filter?: string, viewDebugProfiles?: boolean) => {
        if (viewDebugProfiles !== undefined) {
            setDebug(viewDebugProfiles);
        }

        setState({
            filter: filter,
            viewDebugProfiles: getOr(viewDebugProfiles, state.viewDebugProfiles)
        });
    }, 150), []);

    const renderConfigs: () => JSX.Element = () => {
        const configs = getConfigs(props.configs, state.filter || ".", state.viewDebugProfiles);
        const theme = utilizeGlobalTheme();
        if (configs.length === 0) {
            return (
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: utilizeGlobalTheme().gaps.defaultGab.css()
                }}>
                    <Icon icon={<FilterIcon/>} size={px(40)}/>
                    <Text text={"No configs found"}/>
                </div>
            );
        } else {
            return (
                <LiteGrid columns={3} gap={theme.gaps.smallGab} responsive minResponsiveWidth={px(300)}>
                    {configs.map(config => (
                        <AppConfigSelector
                            key={v4()}
                            data={config}
                            onSelection={data => props.onSelection(data)}
                        />
                    ))}
                </LiteGrid>
            );
        }
    }

    const theme: Themeable.Theme = utilizeGlobalTheme();

    const Wrapper = styled.div`
      background-color: ${theme.colors.backgroundColor.css()};
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      gap: ${theme.paddings.defaultObjectPadding.css()};
    `;

    return (
        <div style={{
            padding: theme.paddings.defaultObjectPadding.css(),
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            backgroundColor: theme.colors.backgroundColor.css(),
            gap: theme.gaps.defaultGab.css()
        }}>
            <AppHeader
                title={"Debug configuration"}
                left={
                    <Icon
                        icon={<Logo/>}
                        style={{
                            fill: "white !important"
                        }}
                    />
                }
                right={
                    <FlexBox flexDir={FlexDirection.ROW}>
                        <Togglable initialActiveState={state.viewDebugProfiles} active={
                            <Icon icon={<DebugIcon/>} visualMeaning={ObjectVisualMeaning.SUCCESS} colored/>
                        } inactive={
                            <Icon icon={<DebugIcon/>} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} colored/>
                        } onChange={active => {
                            console.log(active)
                            debouncedOnChange(state.filter, active);
                        }}/>
                    </FlexBox>
                }
            />


            <FlexBox gap={dimension(5, Dimension.px)}>
                <Text type={TextType.smallHeader} text={"Select app profile…"}/>
                <Text type={TextType.secondaryDescription} text={"Starting the **App** instance, based on the 'bernie-infrastructure' with a selected app config"}/>
            </FlexBox>

            <Input opaque
                   key={"asd"}
                   label={"App config title"}
                   onChange={event => debouncedOnChange(event.target.value ? event.target.value.toLocaleLowerCase() : undefined)}
            />

            <Wrapper>
                {renderConfigs()}
            </Wrapper>
        </div>
    );
}

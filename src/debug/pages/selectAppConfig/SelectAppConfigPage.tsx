import React from "react";
import styled from "styled-components";
import {Themeable} from "../../../Themeable";
import {utilizeGlobalTheme} from "../../../logic/App";
import {AppConfigSelectionData, AppConfigSelector} from "../../components/AppConfigSelector";
import {Page} from "../../../components/Page";
import {Text, TextType} from "../../../components/Text";
import {createMargin} from "../../../logic/Margin";
import {Dimension} from "../../../logic/Dimension";

export type SelectAppConfigPageProps = {
    configs: AppConfigSelectionData[],
    onSelection: (data: AppConfigSelectionData) => void
}

export class SelectAppConfigPage extends React.Component<SelectAppConfigPageProps, any> {

    constructor(props: SelectAppConfigPageProps) {
        super(props);
    }

    render() {
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
            <Page>
                <Text type={TextType.smallHeader} margin={createMargin(0, 0, 18, 0, Dimension.px)} text={"Select app profile.."}/>
                <Wrapper>
                    {this.props.configs.map(config => {
                        return (
                            <AppConfigSelector
                                data={config}
                                onSelection={data => this.props.onSelection(data)}
                            />
                        )
                    })}
                </Wrapper>
            </Page>

        );
    }
}

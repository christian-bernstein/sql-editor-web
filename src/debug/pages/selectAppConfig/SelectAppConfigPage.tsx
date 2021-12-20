import React from "react";
import styled from "styled-components";
import {Themeable} from "../../../Themeable";
import {utilizeGlobalTheme} from "../../../logic/App";
import {AppConfigSelectionData, AppConfigSelector, AppConfigSelectorProps} from "../../components/AppConfigSelector";

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
        const Page = styled.div`
          background-color: ${theme.colors.backgroundColor.css()};
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          width: 100%;
          overflow-y: scroll;
          padding: ${theme.paddings.defaultObjectPadding.css()};
          gap: ${theme.paddings.defaultObjectPadding.css()};
        `;
        return (
            <Page>
                {this.props.configs.map(config => {
                    return (
                        <AppConfigSelector
                            data={config}
                            onSelection={data => this.props.onSelection(data)}
                        />
                    )
                })}
            </Page>
        );
    }
}

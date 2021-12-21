import React from "react";
import {Page} from "../../components/Page";
import {Text} from "../../components/Text";

export type RegexPageState = {
    regex: string
}

export class RegexPage extends React.Component<any, RegexPageState> {

    render() {
        return (
            <Page>
                <Text text={"Regex viewer"}/>
            </Page>
        );
    }
}
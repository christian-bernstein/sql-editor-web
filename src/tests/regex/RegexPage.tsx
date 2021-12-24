import React from "react";
import {Page} from "../../components/Page";
import {Text, TextType} from "../../components/Text";

export type RegexPageState = {
    regex: string
}

export class RegexPage extends React.Component<any, RegexPageState> {

    render() {
        return (
            <Page>
                <Text text={"Regex viewer"} type={TextType.smallHeader}/>
            </Page>
        );
    }
}

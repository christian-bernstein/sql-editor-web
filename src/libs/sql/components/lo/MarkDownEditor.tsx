import React from "react";
import {Box} from "./Box";
import MDEditor from '@uiw/react-md-editor';
import {getOr} from "../../logic/Utils";
import rehypeSanitize from "rehype-sanitize";

export type MarkDownEditorProps = {
    placeholder?: string
}

export type MarkDownEditorState = {
    value: string,
}


// todo solve rerender problem
export class MarkDownEditor extends React.Component<MarkDownEditorProps, MarkDownEditorState> {

    constructor(props: MarkDownEditorProps) {
        super(props);
        this.state = {
            value: ""
        };
    }

    /**
     * sanitize md => https://uiwjs.github.io/react-md-editor/#security
     * prevents a theoretical vulnerability against XSS attacks
     */
    render() {
        return (
            <Box noPadding={true}>
                <MDEditor
                    placeholder={getOr(this.props.placeholder, undefined)}
                    // onChange={value => this.setState({
                    //     value: value ? value : ""
                    // })}
                    // value={this.state.value}
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                />
            </Box>
        );
    }
}

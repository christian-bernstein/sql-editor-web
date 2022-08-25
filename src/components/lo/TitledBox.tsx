import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {getOr} from "../../logic/Utils";
import {Group} from "./Group";
import {Box} from "./Box";
import {Orientation} from "../../logic/style/Orientation";
import {DimensionalMeasured, percent, px} from "../../logic/style/DimensionalMeasured";
import {InformationBox} from "../ho/informationBox/InformationBox";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Text} from "./Text";
import {CSSProp} from "styled-components";
import {CSSProperties} from "react";

export type TitledBoxProps = {
    showBody?: boolean,
    titleRenderer: (instance: TitledBox) => JSX.Element,
    bodyRenderers: Map<string, (instance: TitledBox) => JSX.Element>,
    body?: string
    width?: DimensionalMeasured,
    height?: DimensionalMeasured,
    showFooter?: boolean,
    footer?: (instance: TitledBox) => JSX.Element;
    headerBoxStyle?: CSSProperties
}

export type TitledBoxLocalState = {
    showBody: boolean,
    body: string,
    showFooter: boolean
}

export class TitledBox extends BernieComponent<TitledBoxProps, any, TitledBoxLocalState> {

    constructor(props: TitledBoxProps) {
        super(props, undefined, {
            showBody: getOr(props.showBody, true),
            body: getOr(props.body, "default"),
            showFooter: getOr(props.showFooter, true),
        });
    }

    public toggleBody() {
        this.local.setStateWithChannels({
            showBody: !this.local.state.showBody
        }, ["container"]);
    }

    public switchBodyRenderer(newBody: string) {
        this.local.setStateWithChannels({
            body: newBody
        }, ["container"]);
    }

    private renderBody(): JSX.Element {
        const renderer = this.props.bodyRenderers.get(this.local.state.body);
        if (renderer === undefined) {
            return (
                <InformationBox visualMeaning={ObjectVisualMeaning.ERROR} children={
                    <Text text={`Container cannot render body. Renderer '${this.local.state.body}' doesn't exist`}/>
                }/>
            );
        } else {
            return renderer(this);
        }
    }

    componentRender(p: TitledBoxProps, s: any, l: TitledBoxLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <Group className={"titled-box"} height={p.height} width={p.width} orientation={Orientation.VERTICAL} elements={[
                <Box color={t.colors.backgroundColor}
                     width={percent(100)}
                     children={p.titleRenderer(this)}
                     style={p.headerBoxStyle}
                />,
                local.state.showBody ? <Box
                    width={percent(100)}
                    height={percent(100)}
                    children={this.renderBody()}
                /> : undefined,
                local.state.showFooter && p.footer !== undefined ? <Box
                    width={percent(100)}
                    children={this.props.footer?.(this)}
                /> : undefined
            ]}/>
        ), "container");
    }
}

import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {getOr} from "../../logic/Utils";
import {Group} from "./Group";
import {Box} from "./Box";
import {Orientation} from "../../logic/style/Orientation";
import {DimensionalMeasured, percent} from "../../logic/style/DimensionalMeasured";
import {InformationBox} from "../ho/informationBox/InformationBox";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {Text} from "./Text";

export type TitledBoxProps = {
    showBody?: boolean,
    titleRenderer: (instance: TitledBox) => JSX.Element,
    bodyRenderers: Map<string, (instance: TitledBox) => JSX.Element>,
    body?: string
    width?: DimensionalMeasured
}

export type TitledBoxLocalState = {
    showBody: boolean,
    body: string
}

export class TitledBox extends BernieComponent<TitledBoxProps, any, TitledBoxLocalState> {

    constructor(props: TitledBoxProps) {
        super(props, undefined, {
            showBody: getOr(props.showBody, true),
            body: getOr(props.body, "default"),
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
            <Group width={p.width} orientation={Orientation.VERTICAL} elements={[
                <Box color={t.colors.backgroundColor}
                     width={percent(100)}
                     children={p.titleRenderer(this)}
                />,
                local.state.showBody ? <Box
                    width={percent(100)}
                    children={this.renderBody()}
                /> : undefined
            ]}/>
        ), "container");
    }
}

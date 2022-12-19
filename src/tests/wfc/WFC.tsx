import {BernieComponent} from "../../libs/sql/logic/BernieComponent";
import {Themeable} from "../../libs/sql/logic/style/Themeable";
import {Assembly} from "../../libs/sql/logic/assembly/Assembly";
import {LiteGrid} from "../../libs/sql/components/lo/LiteGrid";
import {AF} from "../../libs/sql/components/logic/ArrayFragment";
import {Box} from "../../libs/sql/components/lo/Box";
import {DimensionalMeasured, percent, px} from "../../libs/sql/logic/style/DimensionalMeasured";
import {FlexBox} from "../../libs/sql/components/lo/FlexBox";
import {Icon} from "../../libs/sql/components/lo/Icon";
import {ReactComponent as TImage} from "./assets/t.svg";
import {ReactComponent as BlankImage} from "./assets/blank.svg";
import {array, arrayFactory} from "../../libs/sql/logic/Utils";
import {Map} from "../../libs/sql/components/logic/Map";
import {Centered} from "../../libs/sql/components/lo/PosInCenter";

export type WFCComponentProps = {
    dimension: number
}

export class WFCComponent extends BernieComponent<WFCComponentProps, any, any> {

    constructor(props: WFCComponentProps) {
        super(props, undefined, undefined);
    }

    init() {
        super.init();
        this.boardAssembly();
        this.statsAssembly();
    }

    private boardAssembly() {
        this.assembly.assembly("board", theme => {
            return (
                <Box children={
                    <Centered fullHeight children={
                        <AF elements={[
                            <LiteGrid
                                style={{ width: "fit-content", border: `1px solid ${theme.colors.borderPrimaryColor.css()}` }}
                                columns={this.props.dimension}
                                children={
                                    WFCDefaults.tiles.map(tile => tile.img)
                                }
                            />
                        ]}/>
                    }/>
                }/>
            );
        });
    }

    private statsAssembly() {
        this.assembly.assembly("stats", theme => {
            return (
                <Box children={
                    <AF elements={[
                        <Map<WFCStructs.Tile> data={WFCDefaults.tiles} wrapper={props => <LiteGrid responsive minResponsiveWidth={px(20)} gap={theme.gaps.smallGab} {...props}/>} renderer={(tile, data) => (
                            <span style={{ transform: `rotate(${Math.PI * tile.rotation / 2}rad)` }} children={
                                tile.img
                            }/>
                        )}/>
                    ]}/>
                }/>
            );
        });
    }

    componentRender(p: WFCComponentProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <FlexBox width={percent(50)} height={percent(50)} children={
                <LiteGrid height={percent(100)} columns={2} gap={t.gaps.smallGab} children={
                    <AF elements={[
                        this.a("stats"),
                        this.a("board")
                    ]}/>
                }/>
            }/>
        );
    }
}

export namespace WFCStructs {

    export type Tile = {
        img: JSX.Element,
        rotation: number
    }

    export interface TileGenerator {
        generate(): Array<string>;
    }

}

export namespace WFCDefaults {

    export const tiles: Array<WFCStructs.Tile> = [
        ...arrayFactory<WFCStructs.Tile>(i => ({
            rotation: i,
            img: (
                <Icon icon={<TImage/>}/>
            )
        }), 4),
        {
            rotation: 0,
            img: (
                <Icon icon={<BlankImage/>}/>
            )
        }
    ]
}

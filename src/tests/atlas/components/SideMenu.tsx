import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Flex} from "../../../components/lo/FlexBox";
import {Box} from "../../../components/lo/Box";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {VFSFolderView} from "./VFSFolderView";
import {ReactComponent as MenuIcon} from "../../../assets/icons/ic-20/ic20-menu.svg";
import {Icon} from "../../../components/lo/Icon";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Justify} from "../../../logic/style/Justify";
import {OverflowWithHeader} from "../../../components/lo/OverflowWithHeader";
import {ExitToAppRounded} from "@mui/icons-material";
import {Color} from "../../../logic/style/Color";

export type SideMenuProps = {
    view: VFSFolderView
}

export class SideMenu extends BC<SideMenuProps, any, any> {

    init() {
        super.init();
        this.contentAssembly();
    }

    private contentAssembly() {
        this.assembly.assembly("content-root", theme => {

            return (
                <OverflowWithHeader height={percent(100)} dir={FlexDirection.COLUMN_REVERSE} staticContainer={{
                    elements: [
                        <Flex
                            fw
                            fh
                            flexDir={FlexDirection.COLUMN}
                            justifyContent={Justify.SPACE_BETWEEN}
                            elements={[
                                <Icon tooltip={"Toggle menu"} icon={<MenuIcon/>} onClick={() => {
                                    this.props.view.toggleMenu();
                                }}/>
                            ]}
                        />
                    ]
                }} overflowContainer={{
                    elements: [
                        <Flex
                            fw
                            fh
                            flexDir={FlexDirection.COLUMN_REVERSE}
                            justifyContent={Justify.SPACE_BETWEEN}
                            elements={[
                                <Icon tooltip={"Exit"} icon={<ExitToAppRounded/>} onClick={() => {
                                    this.props.view.requestViewClosing();
                                }}/>
                            ]}
                        />
                    ]
                }}/>
            );
        })
    }

    componentRender(p: SideMenuProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box
                fh
                borderless
                borderRadiiConfig={{
                    enableCustomBorderRadii: true,
                    fallbackCustomBorderRadii: px(0)
                }}
                bgColor={t.colors.backgroundHighlightColor}
                // bgColor={Color.ofHex("#222B38")}
                elements={[
                    this.a("content-root")
                ]}
            />
        );
    }
}

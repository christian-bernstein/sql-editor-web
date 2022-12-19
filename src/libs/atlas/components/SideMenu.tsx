import {BC} from "../../sql/logic/BernieComponent";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Flex} from "../../sql/components/lo/FlexBox";
import {Box} from "../../sql/components/lo/Box";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {VFSFolderView} from "./VFSFolderView";
import {ReactComponent as MenuIcon} from "../../../assets/icons/ic-20/ic20-menu.svg";
import {Icon} from "../../sql/components/lo/Icon";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {Justify} from "../../sql/logic/style/Justify";
import {OverflowWithHeader} from "../../sql/components/lo/OverflowWithHeader";
import {ExitToAppRounded} from "@mui/icons-material";
import {Color} from "../../sql/logic/style/Color";

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

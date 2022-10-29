import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Flex} from "../../../components/lo/FlexBox";
import {Box} from "../../../components/lo/Box";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Color} from "../../../logic/style/Color";
import {VFSFolderView} from "./VFSFolderView";
import {ReactComponent as MenuIcon} from "../../../assets/icons/ic-20/ic20-menu.svg";
import {Icon} from "../../../components/lo/Icon";

export type SideMenuProps = {
    view: VFSFolderView
}

export class SideMenu extends BC<SideMenuProps, any, any> {

    componentRender(p: SideMenuProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box
                fh
                borderless
                borderRadiiConfig={{
                    enableCustomBorderRadii: true,
                    fallbackCustomBorderRadii: px(0)
                }}
                bgColor={t.colors.backgroundHighlightInputColor}
                elements={[
                    <Icon tooltip={"Toggle menu"} icon={<MenuIcon/>} onClick={() => {
                        p.view.toggleMenu();
                    }}/>
                ]}
            />
        );
    }
}

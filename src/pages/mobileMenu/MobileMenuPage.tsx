import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {FlexBox} from "../../components/lo/FlexBox";
import {Screen} from "../../components/lo/Page";
import {percent} from "../../logic/style/DimensionalMeasured";
import {Justify} from "../../logic/style/Justify";
import {Text} from "../../components/lo/Text";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {ReactComponent as LogoutIcon} from "../../assets/icons/ic-20/ic20-turn-off.svg";
import {ReactComponent as SettingsIcon} from "../../assets/icons/ic-20/ic20-settings.svg";
import {ReactComponent as AppLogo} from "../../assets/logo.svg";
import {Box} from "../../components/lo/Box";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Align} from "../../logic/style/Align";
import {Icon} from "../../components/lo/Icon";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {AppHeader} from "../../components/lo/AppHeader";
import {App} from "../../logic/app/App";

export class MobileMenuPage extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen id={"mobile-menu-page"} style={{width: "100vw !important"}}>
                <FlexBox height={percent(100)} width={percent(100)} justifyContent={Justify.SPACE_BETWEEN}>
                    <FlexBox width={percent(100)}>
                        <AppHeader title={"Menu"} left={
                            <Icon icon={<AppLogo/>}/>
                        }/>
                    </FlexBox>

                    <FlexBox width={percent(100)} overflowYBehaviour={OverflowBehaviour.SCROLL}>
                        {App.app().screenManager.renderMenuIcons()}
                    </FlexBox>

                    <FlexBox width={percent(100)}>
                        <Box width={percent(100)}>
                            <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                                <Text text={"Christian Bernstein"}/>
                                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                                    <Icon icon={<LogoutIcon/>} visualMeaning={ObjectVisualMeaning.ERROR} colored/>
                                    <Icon icon={<SettingsIcon/>}/>
                                </FlexBox>
                            </FlexBox>
                        </Box>
                    </FlexBox>
                </FlexBox>
            </Screen>
        );
    }
}

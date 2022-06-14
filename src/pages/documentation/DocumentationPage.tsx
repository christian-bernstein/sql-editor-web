import {BernieComponent} from "../../logic/BernieComponent";
import {FlexBox} from "../../components/lo/FlexBox";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Text} from "../../components/lo/Text";
import {Image} from "../../components/lo/Image";
import {CodeDisplay} from "../../components/lo/CodeDisplay";
import React from "react";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Screen} from "../../components/lo/Page";
import {Centered} from "../../components/lo/PosInCenter";
import {Desktop, Mobile, Tablet} from "../../components/logic/Media";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";
import {LiteGrid} from "../../components/lo/LiteGrid";

export class DocumentationPage extends BernieComponent<any, any, any> {

    init() {
        super.init();
        this.desktopDocsAssembly();
    }

    private renderDocs(): JSX.Element {
        return (
            <FlexBox height={percent(100)}>
                <Text text={"# Theming"}/>
                <Text text={"Customize MUI with your theme. You can change the colors, the typography and much more. "}/>
                <Text text={"The theme specifies the color of the components, darkness of the surfaces, level of shadow, appropriate opacity of ink elements, etc."}/>
                <Text text={"Themes let you apply a consistent tone to your app. It allows you to **customize all design aspects** of your project in order to meet the specific needs of your business or brand."}/>
                <Text text={"To promote greater consistency between apps, light and dark theme types are available to choose from. By default, components use the light theme type."}/>

                <Image width={percent(100)} height={px(350)} src={"https://i.pinimg.com/originals/ed/a5/73/eda5739966cb33768d8ad0d77d7307ce.gif"}/>

                <Text text={"## Theme provider"}/>
                <Text text={"If you wish to customize the theme, you need to use the ´ThemeProvider´ component in order to inject a theme into your application. However, this is optional; MUI components come with a default theme."}/>
                <Text text={"´ThemeProvider´ relies on the [context feature of React]() to pass the theme down to the components, so you need to make sure that ´ThemeProvider´ is a parent of the components you are trying to customize. You can learn more about this in [the API section]()."}/>

                <Text text={"## Theme configuration variables"}/>
                <Text text={"Changing the theme configuration variables is the most effective way to match MUI to your needs. The following sections cover the most important theme variables:"}/>
                <Text text={""} texts={[
                    "- ´[.palette]()´",
                    "- ´[.typography]()´",
                    "- ´[.spacing]()´",
                    "- ´[.breakpoints]()´",
                    "- ´[.zIndex]()´",
                    "- ´[.transitions]()´",
                    "- ´[.components]()´\n",
                    "You can check out the [default theme section]() to view the default theme in full.",
                    "## Custom variables",
                    "When using MUI's theme with [MUI System]() or [any other styling solution](), it can be convenient to add additional variables to the theme so you can use them everywhere. For instance:"
                ]}/>

                <CodeDisplay code={[
                    "import { LicenseInfo } from '@mui/x-license-pro';",
                    "",
                    "LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');"
                ]}/>

                <Text text={""} texts={[
                    "If you are using TypeScript, you would also need to use [module augmentation]() for the theme to accept the above values.",
                ]}/>

            </FlexBox>
        );
    }

    private desktopDocsAssembly() {
        this.assembly.assembly("desktop-docs", (theme, props) => {
            return (
                <LiteGrid />
            );
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen children={
                <Centered fullHeight children={
                    <>
                        <Desktop children={
                            <FlexBox width={percent(50)} height={percent(90)} overflowYBehaviour={OverflowBehaviour.SCROLL} children={
                                this.renderDocs()
                            }/>
                        }/>
                        <Mobile children={this.renderDocs()}/>
                        <Tablet children={this.renderDocs()}/>
                    </>
                }/>
            }/>
        );
    }

}

import {BernieComponent} from "../../../../logic/BernieComponent";
import {Assembly} from "../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../logic/style/Themeable";
import {Screen} from "../../../../components/lo/Page";
import {AF} from "../../../../components/logic/ArrayFragment";
import {Flex} from "../../../../components/lo/FlexBox";
import {LiteGrid} from "../../../../components/lo/LiteGrid";
import {Icon} from "../../../../components/lo/Icon";
import {ReactComponent as LogoIcon} from "../../../../assets/logo.svg";
import React from "react";
import {Text, TextType} from "../../../../components/lo/Text";
import {FlexDirection} from "../../../../logic/style/FlexDirection";
import {Align} from "../../../../logic/style/Align";
import {Justify} from "../../../../logic/style/Justify";
import {NavLink} from "../../../../components/lo/NavLink";
import {Button} from "../../../../components/lo/Button";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {DimensionalMeasured, percent, px} from "../../../../logic/style/DimensionalMeasured";
import {Cursor} from "../../../../logic/style/Cursor";
import {Default} from "../../../../components/logic/Media";
import {Dimension} from "../../../../logic/style/Dimension";
import {createMargin} from "../../../../logic/style/Margin";

export type LandingPageProps = {
}

export type LandingPageLocalState = {
}

export class LandingPage extends BernieComponent<LandingPageProps, any, LandingPageLocalState> {

    constructor(props: LandingPageProps) {
        super(props, undefined, {
        });
    }

    init() {
        super.init();
        this.headerAssembly();
        this.pageAssembly();
    }

    private headerAssembly() {
        this.assembly.assembly("header-default", (theme, props) => {
            return (
                <LiteGrid columns={3}>
                    <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} gap={theme.gaps.smallGab}>
                        <Icon icon={<LogoIcon/>} size={px(32)}/>
                        <Text cursor={Cursor.pointer} text={"SQL-Editor"} bold whitespace={"nowrap"} type={TextType.displayText} fontSize={px(22)}/>
                    </Flex>

                    <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER} gap={theme.gaps.defaultGab.times(2)}>
                        <NavLink text={"Features"} dropDownIndicator/>
                        <NavLink text={"Templates"}/>
                        <NavLink text={"Integrations"}/>
                        <NavLink text={"Pricing"}/>
                        <NavLink text={"Company"} dropDownIndicator/>
                    </Flex>

                    <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.FLEX_END} gap={theme.gaps.defaultGab.times(2)}>
                        <NavLink text={"Contact"}/>
                        <NavLink text={"Login"}/>
                        <Button bgColorOnDefault={true} opaque vibrateOnClick highlight visualMeaning={ObjectVisualMeaning.INFO} shrinkOnClick children={
                            <Text whitespace={"nowrap"} fontSize={px(14)} text={"Sign Up"} type={TextType.displayText}/>
                        }/>
                    </Flex>
                </LiteGrid>
            );
        });
    }

    private pageAssembly() {
        this.assembly.assembly("page-default", (theme, props) => {
            return (
                <Flex margin={createMargin(40, 0, 0, 0)} width={percent(100)} align={Align.CENTER} gap={theme.gaps.defaultGab.times(2)}>
                    <Flex width={percent(100)} align={Align.CENTER} gap={px()}>
                        <Text type={TextType.displayText} bold text={"Develop."} fontSize={DimensionalMeasured.of(8, Dimension.rem)}/>
                        <Text type={TextType.displayText} bold text={"Preview."} fontSize={DimensionalMeasured.of(8, Dimension.rem)}/>
                        <Text type={TextType.displayText} bold text={"Ship."} fontSize={DimensionalMeasured.of(8, Dimension.rem)}/>
                    </Flex>
                </Flex>
            );
        })
    }

    componentRender(p: LandingPageProps, s: any, l: LandingPageLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen>
                {/*Default landing page layout for desktop devices*/}
                <Default children={
                    <AF elements={[
                        this.a("header-default"),
                        this.a("page-default"),
                    ]}/>
                }/>
            </Screen>
        );
    }
}

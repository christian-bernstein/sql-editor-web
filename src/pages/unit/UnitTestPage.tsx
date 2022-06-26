import {BernieComponent} from "../../logic/BernieComponent";
import {Assembly} from "../../logic/assembly/Assembly";
import {Themeable} from "../../logic/style/Themeable";
import {Centered} from "../../components/lo/PosInCenter";
import {Screen} from "../../components/lo/Page";
import React from "react";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Box} from "../../components/lo/Box";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {ReactComponent as ProfileIcon} from "../../assets/icons/ic-20/ic20-user.svg";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-20/ic20-bug.svg";
import {FlexBox} from "../../components/lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Justify} from "../../logic/style/Justify";
import {Align} from "../../logic/style/Align";
import {Icon} from "../../components/lo/Icon";
import {CodeDisplay} from "../../components/lo/CodeDisplay";
import {sql} from "@codemirror/lang-sql";
import {Text, TextType} from "../../components/lo/Text";
import styled from "styled-components";
import {createMargin} from "../../logic/style/Margin";
import {Separator} from "../../components/lo/Separator";
import {OverflowBehaviour} from "../../logic/style/OverflowBehaviour";

export class UnitTestPage extends BernieComponent<any, any, any> {

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {

        const Line = styled.span`
          position: absolute;
          height: 100%;
          width: fit-content;
          
          &::before {
            content: ' ';
            width: 2px;
            height: 100%;
            position: absolute;
            left: 0;
            background-color: ${t.colors.backgroundHighlightColor200.css()};
          }
        `;

        return (
            <Screen children={
                <Centered fullHeight children={
                    <FlexBox width={percent(50)} gap={px()}>
                        <FlexBox flexDir={FlexDirection.ROW} width={percent(100)}>
                            <Box visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} noPadding width={px(38)} height={px(38)} children={
                                <FlexBox width={percent(100)} height={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER} children={
                                    <Icon icon={<ProfileIcon/>}/>
                                }/>
                            }/>
                            <FlexBox gap={px(0)} width={percent(100)}>
                                <Box width={percent(100)} opaque visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} arrow={{
                                    enable: true,
                                    bgColor: t.colors.backgroundColor
                                }} noBGColor children={
                                    <FlexBox width={percent(100)}>
                                        <Text text={"SQL basic update"} type={TextType.smallHeader}/>
                                        <CodeDisplay extensions={[sql()]} code={["show tables from information-scheme"]}/>
                                    </FlexBox>
                                }/>

                                <FlexBox overflowXBehaviour={OverflowBehaviour.SCROLL} width={percent(100)}>
                                    <FlexBox flexDir={FlexDirection.ROW} height={percent(100)} padding paddingY={t.gaps.defaultGab} style={{position: "relative"}} align={Align.CENTER} margin={createMargin(0, 0, 0, t.gaps.smallGab.measurand)}>
                                        <Line/>

                                        <Icon icon={<ProfileIcon/>} style={{
                                            marginLeft: "-9px",
                                            borderRadius: "9999px",
                                            boxShadow: `0 0 0 ${t.paddings.defaultTextIconPadding.withPlus(1).css()} ${t.colors.backgroundColor.css()}`,
                                            backgroundColor: t.colors.backgroundColor.css()
                                        }} size={px(20)}/>

                                        <FlexBox gap={px(1)}>
                                            <Text text={"Processing sql instruction on node **bvss-1**  [Open a ticket]()"} type={TextType.secondaryDescription}/>
                                            <FlexBox flexDir={FlexDirection.ROW} gap={t.gaps.smallGab}>
                                                <Text text={"EPD:"} type={TextType.secondaryDescription} fontSize={px(14)}/>
                                                <Text text={"7ms"} coloredText visualMeaning={ObjectVisualMeaning.INFO} type={TextType.secondaryDescription} fontSize={px(14)}/>
                                            </FlexBox>
                                        </FlexBox>


                                    </FlexBox>
                                </FlexBox>

                            </FlexBox>
                        </FlexBox>



                        <FlexBox flexDir={FlexDirection.ROW} >
                            <Box visualMeaning={ObjectVisualMeaning.ERROR} noPadding width={px(38)} height={px(38)} children={
                                <FlexBox width={percent(100)} height={percent(100)} justifyContent={Justify.CENTER} align={Align.CENTER} children={
                                    <Icon icon={<ErrorIcon/>}/>
                                }/>
                            }/>
                            <FlexBox gap={px(0)} width={percent(100)}>
                                <Box width={percent(100)} opaque visualMeaning={ObjectVisualMeaning.ERROR} arrow={{
                                    enable: true,
                                    bgColor: t.colors.backgroundColor
                                }} noBGColor children={
                                    <FlexBox width={percent(100)} overflowXBehaviour={OverflowBehaviour.SCROLL} gap={t.gaps.smallGab}>
                                        <Text text={"Unable to execute SQL instruction"} type={TextType.smallHeader}/>
                                        <Text text={"Please check the instruction for errors"} fontSize={px(12)} type={TextType.secondaryDescription}/>

                                        <Separator style={{marginBottom: t.gaps.defaultGab.css()}}/>

                                        <FlexBox gap={px(1)}>
                                            <Text text={"Error type"} uppercase bold fontSize={px(12)}/>
                                            <Text text={"org.h2.jdbc.JdbcSQLNonTransientException"} />
                                        </FlexBox>

                                        <FlexBox gap={px(1)}>
                                            <Text text={"Message"} uppercase bold fontSize={px(12)}/>
                                            <Text text={"Method is not allowed for a query. Use execute or executeQuery instead of executeUpdate; SQL statement: show tables [90001-200]"} />
                                        </FlexBox>

                                    </FlexBox>
                                }/>
                            </FlexBox>
                        </FlexBox>
                    </FlexBox>
                }/>
            }/>
        );
    }
}

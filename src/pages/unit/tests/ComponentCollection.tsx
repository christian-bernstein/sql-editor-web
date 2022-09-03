import {BernieComponent} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Box} from "../../../components/lo/Box";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Flex} from "../../../components/lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {AF} from "../../../components/logic/ArrayFragment";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as SourceIcon} from "../../../assets/icons/ic-20/ic20-bluetooth.svg";
import {ReactComponent as DirectionIcon} from "../../../assets/icons/ic-20/ic20-direction.svg";
import {Slider} from "@mui/material";
import {Button} from "../../../components/lo/Button";
import {ReactComponent as VolumeDownIcon} from "../../../assets/icons/ic-20/ic20-volume-min.svg";
import React from "react";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Text, TextType} from "../../../components/lo/Text";
import {Justify} from "../../../logic/style/Justify";
import {Color} from "../../../logic/style/Color";

export class ComponentCollection extends BernieComponent<any, any, any> {

    init() {
        super.init();
        this.volumeSliderAssembly();
        this.buttonsAssembly();
        this.boxAssembly();
    }

    private boxAssembly() {
        this.assembly.assembly("box", theme => {
            return (
                <Flex flexDir={FlexDirection.ROW} align={Align.CENTER} children={
                    <Box
                        borderless
                        color={Color.ofHex("#FFFFFF")}
                        children={
                            <Flex align={Align.CENTER} flexDir={FlexDirection.ROW} gap={px(50)} children={
                                <AF elements={[
                                    <Flex gap={px()} children={
                                        <AF elements={[
                                            <Text text={"Hello world"} bold type={TextType.smallHeader}/>,
                                            <Text text={"A neat description put here"}/>
                                        ]}/>
                                    }/>,

                                    <Button border={false} visualMeaning={ObjectVisualMeaning.SUCCESS} style={{
                                        paddingRight: "14px",
                                        paddingLeft: "14px",
                                    }} children={
                                        <Flex gap={px(5)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER} children={
                                            <AF elements={[
                                                <Text text={"Change"} bold/>,
                                                <Icon icon={<DirectionIcon/>} color={Color.ofHex("#000000")}/>
                                            ]}/>
                                        }/>
                                    }/>
                                ]}/>
                            }/>
                        }
                    />
                }/>
            );
        })
    }

    private buttonsAssembly() {
        this.assembly.assembly("buttons", (theme, props) => {
            return (
                <Flex flexDir={FlexDirection.ROW} children={
                    <AF elements={[
                        <Button border={false} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} style={{
                            backgroundColor: "#EEEEEE"
                        }} children={
                            <Flex gap={px(5)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER} children={
                                <AF elements={[
                                    <Text text={"FRA"} bold/>,
                                    <Icon icon={<DirectionIcon/>} color={Color.ofHex("#000000")}/>
                                ]}/>
                            }/>
                        }/>,
                        <Button border={false} visualMeaning={ObjectVisualMeaning.SUCCESS} style={{
                            paddingRight: "14px",
                            paddingLeft: "14px",
                        }} children={
                            <Flex gap={px(5)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.CENTER} children={
                                <AF elements={[
                                    <Text text={"Change"} bold/>,
                                    <Icon icon={<DirectionIcon/>} color={Color.ofHex("#000000")}/>
                                ]}/>
                            }/>
                        }/>,
                    ]}/>
                }/>
            );
        });
    }

    private volumeSliderAssembly() {
        this.assembly.assembly("volume-slider", (theme, props) => {
            const pad = 12;
            return (
                <Box paddingY={px(pad)} paddingX={px(pad)} children={
                    <Flex align={Align.CENTER} children={
                        <AF elements={[
                            <Icon icon={<SourceIcon/>}/>,
                            <Flex style={{zIndex: 50}} height={percent(100)} children={
                                <Slider
                                    orientation={"vertical"}
                                    defaultValue={50}
                                    valueLabelDisplay={"auto"}
                                    sx={{
                                        height: 250,
                                    }}
                                />
                            }/>,
                            <Button border={false} highlight children={
                                <Icon icon={<VolumeDownIcon/>}/>
                            }/>
                        ]}/>
                    }/>
                }/>
            );
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <AF elements={[
                this.a("buttons"),
                this.a("box"),
                this.a("volume-slider")
            ]}/>
        );
    }
}

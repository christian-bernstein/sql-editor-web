import {BC} from "../../../sql/logic/BernieComponent";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {ConfigProps} from "../../config/ConfigProps";
import {MarkdownViewerReloadPolicyConfig} from "../../config/configurations/MarkdownViewerReloadPolicyConfig";
import {Box} from "../../../sql/components/lo/Box";
import {Flex} from "../../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../../sql/components/lo/DrawerHeader";
import {Justify} from "../../../sql/logic/style/Justify";
import {Align} from "../../../sql/logic/style/Align";
import {Text, TextType} from "../../../sql/components/lo/Text";
import {percent, px} from "../../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../../sql/components/lo/Button";
import {FlexDirection} from "../../../sql/logic/style/FlexDirection";
import {createMargin} from "../../../sql/logic/style/Margin";
import {NumberSelector} from "../../../sql/components/lo/NumberSelector";
import {ObjectVisualMeaning, VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {ParentComponentProps} from "../../utils/ParentComponentProps";

export type MarkdownViewerReloadPolicyMenuProps = ConfigProps<MarkdownViewerReloadPolicyConfig> & ParentComponentProps

export class MarkdownViewerReloadPolicyMenu extends BC<MarkdownViewerReloadPolicyMenuProps, any, any> {

    private toggleDebounce() {
        this.props.updater.update(data => {
            data.enableDebounce = !data.enableDebounce;
            return data;
        });
    }

    componentRender(p: MarkdownViewerReloadPolicyMenuProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return p.parent.component(() => {
            const config: MarkdownViewerReloadPolicyConfig = p.getConfig();

            return (
                <Box borderless width={px(400)} elements={[
                    <Flex fh fw elements={[
                        <DrawerHeader
                            badgeVM={ObjectVisualMeaning.BETA}
                            enableBadge
                            badgeText={"Beta"}
                            header={"Markdown viewer reload policy"}
                            margin={createMargin(0, 0, 20, 0)}
                        />,

                        <Flex fw flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} elements={[
                            <Flex gap={px(2)} elements={[
                                <Text bold fontSize={px(14)} text={"Lazy reload"}/>,
                                <Text fontSize={px(11)} type={TextType.secondaryDescription} text={"Debounce reloads to save a lot of performance. If activated, the markdown viewer will only reload once after you finished editing the file"}/>,
                            ]}/>,

                            <Flex elements={[
                                config.enableDebounce ? (
                                    <Button text={"Enabled"} opaque visualMeaning={VM.INFO} onClick={() => this.toggleDebounce()}/>
                                ) : (
                                    <Button text={"Disabled"} onClick={() => this.toggleDebounce()}/>
                                )
                            ]}/>
                        ]}/>,

                        <Flex fw flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} elements={[
                            <Flex gap={px(2)} elements={[
                                <Text bold fontSize={px(14)} text={"Lazy reload timeout"}/>,
                                <Text fontSize={px(11)} type={TextType.secondaryDescription} text={"Debounce reloads to save a lot of performance. If activated, the markdown viewer will only reload once after you finished editing the file"}/>,
                            ]}/>,
                            <Flex elements={[
                                <NumberSelector
                                    onChange={newValue => {}}
                                    deltaCalculator={(current, op) => 1}
                                    initialValue={1000}
                                    minValue={1}
                                    maxValue={3e4}
                                    format={"{current}s"}
                                    specialNumberDisplayRenderers={new Map<{min: number; max: number}, (current: number) => JSX.Element>()}
                                />
                            ]}/>
                        ]}/>

                    ]}/>
                ]}/>
            );
        }, "MarkdownViewerReloadPolicyConfig-change");
    }
}

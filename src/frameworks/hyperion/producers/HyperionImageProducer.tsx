import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Box} from "../../../components/lo/Box";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {Q, Queryable} from "../../../logic/query/Queryable";
import {Optional} from "../../../logic/Optional";
import {HyperionStorableEntry} from "../HyperionStorableEntry";
import {HyperionAPI} from "../HyperionAPI";
import {HyperionIndexedDBStreamAdapter} from "../HyperionIndexedDBStreamAdapter";
import {Description} from "../../../components/lo/Description";
import {QueryDisplay} from "../../../components/logic/QueryDisplay";
import {QueryError} from "../../../logic/query/QueryError";
import {v4} from "uuid";
import {FileInput} from "../../../components/ho/fileInput/FileInput";
import {Form} from "../../../components/Form";
import {HyperionImage} from "../datatypes/HyperionImage";
import {ImageRenderingMode} from "../datatypes/ImageRenderingMode";
import {ImagePosition} from "../datatypes/ImagePosition";
import {FormTransactionType} from "../../../components/FormTransactionType";
import {EnumSelector} from "../../../components/logic/EnumSelector";
import {SettingsElement} from "../../../components/ho/settingsElement/SettingsElement";
import {HOCWrapper} from "../../../components/HOCWrapper";
import {createMargin} from "../../../logic/style/Margin";
import {
    CameraRounded,
    ColorLensRounded,
    DeleteRounded,
    Download,
    FullscreenRounded,
    SettingsInputCompositeRounded
} from "@mui/icons-material";
import {ImageFit} from "../datatypes/ImageFit";
import {AnomalyInfo} from "../../../components/ho/anomalyInfo/AnomalyInfo";
import {Centered} from "../../../components/lo/PosInCenter";
import {AF} from "../../../components/logic/ArrayFragment";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {Text} from "../../../components/lo/Text";
import {Separator} from "../../../components/lo/Separator";
import {Orientation} from "../../../logic/style/Orientation";
import {SettingsGroup} from "../../../components/lo/SettingsGroup";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {Slider} from "@mui/material";
import {Button} from "../../../components/lo/Button";
import {Color} from "../../../logic/style/Color";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {Icon} from "../../../components/lo/Icon";

export type HyperionImageProducerProps = {
    hyperionEntryID: string
}

export type HyperionImageProducerLocalState = {
    hyperionStorableEntryQueryable: Q<Optional<HyperionStorableEntry>>
}

export class HyperionImageProducer extends BC<HyperionImageProducerProps, any, HyperionImageProducerLocalState> {

    constructor(props: HyperionImageProducerProps) {
        super(props, undefined, {
            hyperionStorableEntryQueryable: new Q<Optional<HyperionStorableEntry>>({
                component: () => this,
                fallback: undefined,
                listeners: ["hyperion-entry"],
                process: (resolve, reject) => HyperionAPI.hyperion().get(props.hyperionEntryID).then(value => resolve(value))
            })
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.ls().hyperionStorableEntryQueryable.query();
    }

    init() {
        super.init();
        HyperionAPI.hyperion(prop => prop.setStreamAdapter(new HyperionIndexedDBStreamAdapter()), () => new HyperionAPI());
    }

    private hyperionEntryToImageData(entry: Optional<HyperionStorableEntry>): HyperionImage | undefined {
        if (entry === undefined) return undefined;
        const raw = entry.value;
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    private reloadPreview() {
        this.ls().hyperionStorableEntryQueryable.query();
    }

    componentRender(p: HyperionImageProducerProps, s: any, l: HyperionImageProducerLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={px(400)} elements={[
                <Form formID={`${p.hyperionEntryID}-form`} onSubmit={(ctx, get) => {
                    const src = get("src");
                    const renderMode = get("render-mode");
                    const position = get("position");
                    const fit = get("fit");
                    const opacity = get("opacity");

                    HyperionAPI.hyperion().get(p.hyperionEntryID).then((previous: HyperionStorableEntry | undefined) => {
                        try {
                            if (previous === undefined) {
                                // No data present :: Set data without overwrite
                                const hyperionImageData: HyperionImage = {
                                    src: src,
                                    renderingMode: renderMode ?? ImageRenderingMode.AUTO,
                                    position: position?? ImagePosition.CENTER,
                                    imageFit: fit ?? ImageFit.COVER,
                                    opacity: opacity ?? 1
                                };
                                // Encode & start upstream transaction
                                const encoded = JSON.stringify(hyperionImageData);
                                HyperionAPI.hyperion(prop => prop.upstreamTransaction({
                                    transactionID: v4(),
                                    onStreamed: () => this.reloadPreview(),
                                    entry: {
                                        id: p.hyperionEntryID,
                                        value: encoded
                                    }
                                }));
                            } else {
                                // Previous data present :: Set data with overwrite
                                const previousParsed: HyperionImage = this.hyperionEntryToImageData(previous) as HyperionImage;
                                // Apply overwrites :: TODO Make better logic -> Expandable
                                if (src !== undefined) previousParsed.src = src;
                                if (renderMode !== undefined) previousParsed.renderingMode = renderMode;
                                if (position !== undefined) previousParsed.position = position;
                                if (fit !== undefined) previousParsed.imageFit = fit;
                                if (opacity !== undefined) previousParsed.opacity = opacity;
                                // Encode & start upstream transaction
                                const encoded = JSON.stringify(previousParsed);
                                HyperionAPI.hyperion(prop => prop.upstreamTransaction({
                                    transactionID: v4(),
                                    onStreamed: () => this.reloadPreview(),
                                    entry: {
                                        id: p.hyperionEntryID,
                                        value: encoded
                                    }
                                }));
                            }
                        } catch (e) {
                            console.error(e);
                            this.dialog(<AnomalyInfo anomaly={{ data: e }}/>);
                        }
                    })
                }} renderer={(ctx, set) => {
                    return (
                        <Flex fw fh elements={[
                            <Flex fw gap={t.gaps.smallGab} elements={[
                                <Text text={"Image"}/>,
                                <Description text={"Upload an image file & configure display settings"}/>,
                                <Separator orientation={Orientation.VERTICAL}/>
                            ]}/>,
                            this.component(() => {
                                return (
                                    <Box noPadding bgColor={Color.ofHex("#000000")} overflowXBehaviour={OverflowBehaviour.HIDDEN} fw height={px(300)} elements={[
                                        <QueryDisplay<Optional<HyperionStorableEntry>>
                                            q={this.ls().hyperionStorableEntryQueryable}
                                            renderer={{
                                                success: (q, data) => {
                                                    const imageData = this.hyperionEntryToImageData(data);
                                                    if (imageData === undefined) {
                                                        return (
                                                            <>No image</>
                                                        );
                                                    }

                                                    // Click to open in fullscreen mode
                                                    return (
                                                        <img
                                                            alt={"hyperion-file"}
                                                            height={"100%"}
                                                            src={imageData.src}
                                                            style={{
                                                                cursor: "zoom-in",
                                                                objectFit: imageData.imageFit,
                                                                objectPosition: imageData.position,
                                                                imageRendering: imageData.renderingMode,
                                                                opacity: imageData.opacity
                                                                // TODO: Add rotation, fit
                                                            }}
                                                            onClick={() => {
                                                                // TODO: Make more compact version
                                                                this.dialog(
                                                                    <img
                                                                        alt={"hyperion-file"}
                                                                        src={imageData.src}
                                                                        style={{
                                                                            height: "100vh",
                                                                            backgroundColor: "black",
                                                                            objectFit: imageData.imageFit,
                                                                            objectPosition: imageData.position,
                                                                            imageRendering: imageData.renderingMode,
                                                                            opacity: imageData.opacity
                                                                            // TODO: Add rotation, fit
                                                                        }}
                                                                    />
                                                                )
                                                            }}
                                                        />
                                                    );
                                                },
                                                processing(q: Queryable<HyperionStorableEntry | undefined>): JSX.Element {
                                                    return (
                                                        <Centered fullHeight children={
                                                            <AF elements={[
                                                                <Description text={"Loading"} bold coloredText visualMeaning={VM.WARNING}/>
                                                            ]}/>
                                                        }/>
                                                    );
                                                },
                                                error(q: Queryable<HyperionStorableEntry | undefined>, error?: QueryError): JSX.Element {
                                                    return <>error</>
                                                }
                                            }}
                                        />
                                    ]}/>
                                );
                            }, ...Q.allChannels("hyperion-entry")),

                            this.component(() => {
                                return (
                                    <QueryDisplay<Optional<HyperionStorableEntry>>
                                        q={this.ls().hyperionStorableEntryQueryable}
                                        renderer={{
                                            success: (q, data) => {
                                                const imageData = this.hyperionEntryToImageData(data);
                                                if (imageData === undefined) {
                                                    return (
                                                        <>No image</>
                                                    );
                                                }
                                                return (
                                                    <Flex fw elements={[
                                                        <FlexRow style={{ maxWidth: "100%" }} overflowXBehaviour={OverflowBehaviour.HIDDEN} fw gap={t.gaps.smallGab} elements={[
                                                            <Flex width={px(200)} fw elements={[
                                                                <FileInput onSubmit={fileCTX => {
                                                                    set("src", fileCTX.dataURL);
                                                                    ctx.transaction(FormTransactionType.SUBMIT);
                                                                }}/>
                                                            ]}/>,
                                                            <Button tooltip={"Download file"} children={
                                                                <Icon icon={<Download/>}/>
                                                            }/>,
                                                            <Button tooltip={"Remove image"} bgColorOnDefault={false}  visualMeaning={VM.ERROR} opaque children={
                                                                <Icon icon={<DeleteRounded/>}/>
                                                            }/>,
                                                        ]}/>,

                                                        <SettingsGroup title={"Display settings"} elements={[
                                                            <HOCWrapper body={wrapper => (
                                                                <SettingsElement groupDisplayMode title={"Image position"} iconConfig={{
                                                                    enable: true,
                                                                    iconGenerator: () => <SettingsInputCompositeRounded/>
                                                                }} appendixGenerator={() => (
                                                                    <Description text={imageData.position} margin={createMargin(0, t.gaps.defaultGab.measurand, 0, 0)}/>
                                                                )} promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
                                                                    wrapper.dialog((
                                                                        <EnumSelector from={ImagePosition} onSubmit={element => {
                                                                            set("position", element);
                                                                            resolve();
                                                                            ctx.transaction(FormTransactionType.SUBMIT);
                                                                        }}/>
                                                                    ));
                                                                })}/>
                                                            )}/>,
                                                            <HOCWrapper body={wrapper => (
                                                                <SettingsElement groupDisplayMode title={"Image fit"} iconConfig={{
                                                                    enable: true,
                                                                    iconGenerator: () => <FullscreenRounded/>
                                                                }} appendixGenerator={() => (
                                                                    <Description text={imageData.imageFit} margin={createMargin(0, t.gaps.defaultGab.measurand, 0, 0)}/>
                                                                )} promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
                                                                    wrapper.dialog((
                                                                        <EnumSelector from={ImageFit} onSubmit={element => {
                                                                            set("fit", element);
                                                                            resolve();
                                                                            ctx.transaction(FormTransactionType.SUBMIT);
                                                                        }}/>
                                                                    ));
                                                                })}/>
                                                            )}/>,
                                                            <HOCWrapper body={wrapper => (
                                                                <SettingsElement groupDisplayMode title={"Render mode"} iconConfig={{
                                                                    enable: true,
                                                                    iconGenerator: () => <CameraRounded/>
                                                                }} appendixGenerator={() => (
                                                                    <Description text={imageData.renderingMode} margin={createMargin(0, t.gaps.defaultGab.measurand, 0, 0)}/>
                                                                )} promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
                                                                    wrapper.dialog((
                                                                        <EnumSelector from={ImageRenderingMode} onSubmit={element => {
                                                                            set("render-mode", element);
                                                                            resolve();
                                                                            ctx.transaction(FormTransactionType.SUBMIT);
                                                                        }}/>
                                                                    ));
                                                                })}/>
                                                            )}/>,

                                                            <HOCWrapper body={wrapper => (
                                                                <SettingsElement groupDisplayMode title={"Opacity"} iconConfig={{
                                                                    enable: true,
                                                                    iconGenerator: () => <ColorLensRounded/>
                                                                }} appendixGenerator={() => (
                                                                    <Description text={`${(imageData.opacity * 100).toString()}%`} margin={createMargin(0, t.gaps.defaultGab.measurand, 0, 0)}/>
                                                                )} promiseBasedOnClick={element => new Promise<void>((resolve, reject) => {
                                                                    wrapper.dialog((
                                                                        <StaticDrawerMenu width={px(400)} body={props => {
                                                                            return (
                                                                                <Flex fw elements={[
                                                                                    <DrawerHeader
                                                                                        header={"Opacity"}
                                                                                        description={"Select the image opacity.\n_0% for full transparency & 100% for no transparency_"}
                                                                                        margin={createMargin(0, 0, 40, 0)}
                                                                                    />,

                                                                                    <Flex paddingX={px(25)} padding fw elements={[
                                                                                        <Form
                                                                                            formID={""}
                                                                                            renderer={(localCtx, localSet) => {
                                                                                                return (
                                                                                                    <Flex fw elements={[
                                                                                                        <Slider
                                                                                                            valueLabelDisplay="auto"
                                                                                                            aria-label="Opacity"
                                                                                                            defaultValue={(imageData.opacity ?? 1) * 100}
                                                                                                            getAriaValueText={value => `${value}%`}
                                                                                                            title={"Opacity"}
                                                                                                            color="primary"
                                                                                                            onChange={(ev, value) => localSet("opacity", (value as number) / 100)}
                                                                                                        />,
                                                                                                        <Button text={"Update opacity"} width={percent(100)} onClick={() => localCtx.transaction(FormTransactionType.SUBMIT)}/>
                                                                                                    ]}/>
                                                                                                );
                                                                                            }}
                                                                                            onSubmit={(ctx1, get) => {
                                                                                                set("opacity", get("opacity") ?? 1);
                                                                                                resolve();
                                                                                                ctx.transaction(FormTransactionType.SUBMIT);
                                                                                            }}
                                                                                        />
                                                                                    ]}/>
                                                                                ]}/>
                                                                            );
                                                                        }}/>
                                                                    ));
                                                                })}/>
                                                            )}/>
                                                        ]}/>
                                                    ]}/>
                                                );
                                            }
                                        }}
                                    />
                                );
                            }, ...Q.allChannels("hyperion-entry")),
                        ]}/>
                    );
                }}/>,
            ]}/>
        );
    }
}

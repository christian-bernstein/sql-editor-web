import {BC} from "../../../sql/logic/BernieComponent";
import {HyperionSubscriberProps} from "../HyperionSubscriberProps";
import {Box} from "../../../sql/components/lo/Box";
import {Color} from "../../../sql/logic/style/Color";
import {OverflowBehaviour} from "../../../sql/logic/style/OverflowBehaviour";
import {px} from "../../../sql/logic/style/DimensionalMeasured";
import {QueryDisplay} from "../../../sql/components/logic/QueryDisplay";
import {Optional} from "../../../sql/logic/Optional";
import {HyperionStorableEntry} from "../HyperionStorableEntry";
import {Centered} from "../../../sql/components/lo/PosInCenter";
import {Flex} from "../../../sql/components/lo/FlexBox";
import {Align} from "../../../sql/logic/style/Align";
import {Description} from "../../../sql/components/lo/Description";
import {Tooltip} from "../../../sql/components/ho/tooltip/Tooltip";
import {FileInput} from "../../../sql/components/ho/fileInput/FileInput";
import {FormTransactionType} from "../../../sql/components/FormTransactionType";
import {Q, Queryable} from "../../../sql/logic/query/Queryable";
import {AF} from "../../../sql/components/logic/ArrayFragment";
import {VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {QueryError} from "../../../sql/logic/query/QueryError";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {HyperionImage} from "../datatypes/HyperionImage";
import {InformationBox} from "../../../sql/components/ho/informationBox/InformationBox";
import {HyperionAPI} from "../HyperionAPI";
import {HyperionImageProducerProps} from "../producers/HyperionImageProducer";

export type HyperionImageSubscriberProps = HyperionSubscriberProps & {
    openFullscreenContextOnClick?: boolean,
    preventUserSelection?: boolean
};

export type HyperionImageSubscriberLocalState = {
    hyperionStorableEntryQueryable: Q<Optional<HyperionStorableEntry>>
}

/**
 * TODO add global reload dependency -> Hot update after entry changed somewhere on the infrastructure
 */
export class HyperionImageSubscriber extends BC<HyperionImageSubscriberProps, any, HyperionImageSubscriberLocalState> {

    constructor(props: HyperionImageSubscriberProps) {
        super(props, undefined, {
            hyperionStorableEntryQueryable: new Q<Optional<HyperionStorableEntry>>({
                component: () => this,
                fallback: undefined,
                listeners: ["hyperion-entry"],
                process: (resolve, reject) => HyperionAPI.hyperion().get(props.hyperionEntryID).then(value => resolve(value))
            })
        });
    }

    // TODO Merge with hyperionEntryToImageData() in producer
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

    componentDidMount() {
        super.componentDidMount();
        this.ls().hyperionStorableEntryQueryable.query();
    }

    componentRender(p: HyperionImageSubscriberProps, s: any, l: HyperionImageSubscriberLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const openFullscreenContextOnClick = p.openFullscreenContextOnClick ?? false;
        const preventUserSelection = p.preventUserSelection ?? false;

        return this.component(() => {
            return (
                <QueryDisplay<Optional<HyperionStorableEntry>>
                    q={this.ls().hyperionStorableEntryQueryable}
                    renderer={{
                        success: (q, data) => {
                            const imageData = this.hyperionEntryToImageData(data);
                            if (imageData === undefined) {
                                return <></>;
                            }

                            // TODO: Convert to base component ( ImageData -> JSX )
                            return (
                                <img
                                    alt={"hyperion-file"}
                                    // height={"100%"}
                                    src={imageData.src}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        userSelect: preventUserSelection ? "none" : "auto",
                                        cursor: openFullscreenContextOnClick ? "zoom-in" : "default",
                                        objectFit: imageData.imageFit,
                                        objectPosition: imageData.position,
                                        imageRendering: imageData.renderingMode,
                                        opacity: imageData.opacity
                                        // TODO: Add rotation, fit
                                    }}
                                    onClick={() => {
                                        // TODO: Make more compact version
                                        if (openFullscreenContextOnClick) {
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
                                            );
                                        }
                                    }}
                                />
                            );
                        },
                        processing(q: Queryable<HyperionStorableEntry | undefined>): JSX.Element {
                            return (
                                <Centered fullHeight children={
                                    <AF elements={[
                                        <Description text={"Loading"} coloredText visualMeaning={VM.UI_NO_HIGHLIGHT}/>
                                    ]}/>
                                }/>
                            );
                        },
                        error(q: Queryable<HyperionStorableEntry | undefined>, error?: QueryError): JSX.Element {
                            return (
                                <InformationBox visualMeaning={VM.ERROR} children={
                                    <Description text={`Error while loading hyperion image data for '${p.hyperionEntryID}'`}/>
                                }/>
                            );
                        }
                    }}
                />
            );
        }, ...Q.allChannels("hyperion-entry"))
    }
}

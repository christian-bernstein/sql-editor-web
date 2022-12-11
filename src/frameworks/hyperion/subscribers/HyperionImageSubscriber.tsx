import {BC} from "../../../logic/BernieComponent";
import {HyperionSubscriberProps} from "../HyperionSubscriberProps";
import {Box} from "../../../components/lo/Box";
import {Color} from "../../../logic/style/Color";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";
import {px} from "../../../logic/style/DimensionalMeasured";
import {QueryDisplay} from "../../../components/logic/QueryDisplay";
import {Optional} from "../../../logic/Optional";
import {HyperionStorableEntry} from "../HyperionStorableEntry";
import {Centered} from "../../../components/lo/PosInCenter";
import {Flex} from "../../../components/lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {Description} from "../../../components/lo/Description";
import {Tooltip} from "../../../components/ho/tooltip/Tooltip";
import {FileInput} from "../../../components/ho/fileInput/FileInput";
import {FormTransactionType} from "../../../components/FormTransactionType";
import {Q, Queryable} from "../../../logic/query/Queryable";
import {AF} from "../../../components/logic/ArrayFragment";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {QueryError} from "../../../logic/query/QueryError";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {HyperionImage} from "../datatypes/HyperionImage";
import {InformationBox} from "../../../components/ho/informationBox/InformationBox";
import {HyperionAPI} from "../HyperionAPI";
import {HyperionImageProducerProps} from "../producers/HyperionImageProducer";

export type HyperionImageSubscriberProps = HyperionSubscriberProps;

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

    componentRender(p: HyperionImageSubscriberProps, s: any, l: HyperionImageSubscriberLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
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

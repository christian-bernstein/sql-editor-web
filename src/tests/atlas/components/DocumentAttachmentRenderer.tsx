import {BC} from "../../../logic/BernieComponent";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Q, Queryable} from "../../../logic/query/Queryable";
import {DBDocumentAttachment} from "../data/DBDocumentAttachment";
import {AtlasMain} from "../AtlasMain";
import {QueryDisplay} from "../../../components/logic/QueryDisplay";
import {QueryError} from "../../../logic/query/QueryError";
import {Flex} from "../../../components/lo/FlexBox";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as AttachmentIcon} from "../../../assets/icons/ic-20/ic20-attachment.svg";
import {Button} from "../../../components/lo/Button";
import React from "react";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";

export type DocumentAttachmentRendererProps = {
    attachmentID: string,
    fullscreen?: boolean
}

export type DocumentAttachmentRendererLocalState = {
    data: Q<DBDocumentAttachment | undefined>
}

export class DocumentAttachmentRenderer extends BC<DocumentAttachmentRendererProps, any, DocumentAttachmentRendererLocalState> {

    constructor(props: DocumentAttachmentRendererProps) {
        super(props, undefined, {
            data: new Queryable<DBDocumentAttachment | undefined>({
                listeners: ["data"],
                fallback: undefined,
                component: () => this,
                process: (resolve, reject) => {
                    AtlasMain.atlas().api().persistentDB().documentAttachments.where("id").equals(props.attachmentID).toArray().then((arr: Array<DBDocumentAttachment>) => {
                        if (arr.length > 0) {
                            resolve(arr[0])
                        } else {
                            reject();
                        }
                    }).catch(reason => reject(reason));
                }
            })
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.data.query();
    }

    componentRender(p: DocumentAttachmentRendererProps, s: any, l: DocumentAttachmentRendererLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <QueryDisplay<DBDocumentAttachment | undefined> q={local.state.data} renderer={{
                success: (q, data) => {
                    return (
                        <Flex fw fh style={{ position: "relative" }} elements={[
                            <img width={"100%"} src={`${data?.src}`} alt={"image attachment"}/>,
                            <Button border={false} bgColorOnDefault={false} visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} style={{ position: "absolute", top: t.gaps.smallGab.measurand, right: t.gaps.smallGab.measurand }} children={
                                <Icon icon={<AttachmentIcon/>}/>
                            } onClick={() => {
                                this.dialog(
                                    <StaticDrawerMenu body={props => (
                                        <Button text={"delete"} onClick={() => {
                                            // TODO implement
                                        }}/>
                                    )}/>
                                );
                            }}/>
                        ]}/>
                    );
                },
                error(q: Queryable<DBDocumentAttachment | undefined>, error?: QueryError): JSX.Element {
                    return <>error</>
                },
                processing(q: Queryable<DBDocumentAttachment | undefined>): JSX.Element {
                    return <>processing</>
                },
                neural(q: Queryable<DBDocumentAttachment | undefined>): JSX.Element {
                    return <>neutral</>
                }
            }}/>
        ), ...Q.allChannels("data"))
    }
}

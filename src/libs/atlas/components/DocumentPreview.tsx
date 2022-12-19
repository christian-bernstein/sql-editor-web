import {BC} from "../../sql/logic/BernieComponent";
import {AtlasDocument} from "../data/AtlasDocument";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Flex} from "../../sql/components/lo/FlexBox";
import {DrawerHeader} from "../../sql/components/lo/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../sql/components/lo/Button";
import React from "react";
import {StaticDrawerMenu} from "../../sql/components/lo/StaticDrawerMenu";
import {v4} from "uuid";
import {Input} from "../../sql/components/lo/Input";
import {AtlasMain} from "../AtlasMain";
import {DocumentAttachmentRenderer} from "./DocumentAttachmentRenderer";
import {getOr} from "../../sql/logic/Utils";
import {FlexWrap} from "../../sql/logic/style/FlexWrap";
import {FlexDirection} from "../../sql/logic/style/FlexDirection";
import {Align} from "../../sql/logic/style/Align";
import {Justify} from "../../sql/logic/style/Justify";
import {Box} from "../../sql/components/lo/Box";
import {Cursor} from "../../sql/logic/style/Cursor";
import {Text, TextType} from "../../sql/components/lo/Text";
import {If} from "../../sql/components/logic/If";

import "swiper/swiper.scss";
import "swiper/modules/pagination/pagination.scss";
import {Swiper, SwiperSlide} from "swiper/react";
import {Icon} from "../../sql/components/lo/Icon";
import {ReactComponent as AttachmentIcon} from "../../../assets/icons/ic-20/ic20-attachment.svg";
import {ReactComponent as ActionIcon} from "../../../assets/icons/ic-20/ic20-more-ver.svg";
import {Screen} from "../../sql/components/lo/Page";
import {Centered} from "../../sql/components/lo/PosInCenter";
import {SettingsElement} from "../../sql/components/ho/settingsElement/SettingsElement";
import {SettingsGroup} from "../../sql/components/lo/SettingsGroup";
import {FolderEditDialog} from "./FolderEditDialog";
import {Folder} from "../data/Folder";
import {DocumentEditDialog} from "./DocumentEditDialog";
import {HOCWrapper} from "../../sql/components/HOCWrapper";

export type DocumentPreviewProps = {
    data: AtlasDocument
}

export class DocumentPreview extends BC<DocumentPreviewProps, any, any> {

    componentRender(p: DocumentPreviewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return this.component(local => (
            <Flex fw gap={t.gaps.smallGab} elements={[
                <DrawerHeader
                    header={`${p.data.title}`}
                    enableBadge
                    badgeVM={VM.UI_NO_HIGHLIGHT}
                    badgeText={"Document preview"}
                    description={p.data.description}
                />,

                <Flex wrap={FlexWrap.WRAP} flexDir={FlexDirection.ROW} fw gap={t.gaps.smallGab} align={Align.CENTER} justifyContent={Justify.CENTER} elements={
                    (p.data.tags as Array<string>).map(s => (
                        <Box highlightShadow={false} cursor={Cursor.pointer} highlight opaque paddingY={px(4)} paddingX={px(7)} visualMeaning={VM.SUCCESS} borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px(500)}} borderless children={
                            <Text text={s} whitespace={"nowrap"} cursor={Cursor.pointer} visualMeaning={VM.SUCCESS} fontSize={px(12)} coloredText type={TextType.secondaryDescription}/>
                        }/>
                    ))
                }/>,

                <Flex fw flexDir={FlexDirection.ROW} gap={t.gaps.smallGab} padding paddingX={px(25)} elements={[
                    <Button height={percent(100)} children={
                        <Icon icon={<AttachmentIcon/>}/>
                    }/>,

                    <Button width={percent(100)} shrinkOnClick text={"Add attachment"} onClick={() => {
                        this.dialog(
                            <StaticDrawerMenu body={() => (
                                <Input autoFocus type={"file"} accept={"image/*"} onChange={ev => {
                                    if (ev.target.files !== null) {
                                        const file: File = ev.target.files[0];
                                        const reader: FileReader = new FileReader();
                                        reader.onload = async (event: ProgressEvent<FileReader>) => {
                                            const src = event.target?.result;
                                            const id = v4();

                                            AtlasMain.atlas().api().persistentDB().documentAttachments.add({
                                                src: src as string,
                                                type: file.type,
                                                id: id
                                            }).then(() => {
                                                AtlasMain.atlas().api().updateDocument(p.data.id, document => {
                                                    let iDs: Array<string> | undefined = document.attachmentIDs;
                                                    if (iDs === undefined) {
                                                        iDs = [];
                                                    }
                                                    iDs.push(id);
                                                    document.attachmentIDs = iDs;
                                                    return document;
                                                });

                                                this.rerender("data");
                                            });

                                        }
                                        reader.readAsDataURL(file);
                                    }
                                }}/>
                            )}/>
                        );
                    }}/>,

                    <Button height={percent(100)} children={
                        <Icon icon={<ActionIcon/>}/>
                    } onClick={() => {
                        this.dialog(
                            <StaticDrawerMenu body={() => (
                                <Flex fw elements={[
                                    <DrawerHeader
                                        header={`Actions for *${p.data.title}*`}
                                        enableBadge
                                        badgeVM={VM.UI_NO_HIGHLIGHT}
                                        badgeText={"Actions"}
                                        description={`Available action for document *${p.data.title}*.`}
                                    />,

                                    <HOCWrapper body={wrapper => (
                                        <SettingsGroup title={"Available actions"} elements={[
                                            <SettingsElement groupDisplayMode title={"Edit document"} promiseBasedOnClick={element => {
                                                return new Promise<void>((resolve, reject) => {
                                                    try {
                                                        wrapper.dialog(
                                                            <DocumentEditDialog
                                                                document={p.data}
                                                                actions={{
                                                                    onSubmit(edited: Folder) {
                                                                        AtlasMain.atlas(atlas => {
                                                                            atlas.api().updateDocument(p.data.id, original => {
                                                                                return ({
                                                                                    ...original,
                                                                                    ...edited
                                                                                })
                                                                            });
                                                                        })
                                                                        wrapper.closeLocalDialog();
                                                                        resolve();
                                                                    },
                                                                    onCancel() {
                                                                        wrapper.closeLocalDialog();
                                                                        resolve();
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    } catch (e) {
                                                        reject(e);
                                                    }
                                                })
                                            }}/>,
                                        ]}/>
                                    )}/>


                                ]}/>
                            )}/>
                        )
                    }}/>
                ]}/>,

                <If condition={p.data.attachmentIDs !== undefined && p.data.attachmentIDs.length > 0} ifTrue={
                    <Flex gap={t.gaps.smallGab} fw>
                        <Text text={"Attachments"} uppercase bold type={TextType.secondaryDescription} fontSize={px(12)} align={Align.START}/>
                        <Swiper style={{ width: "100%" }} spaceBetween={10} slidesPerView={1}>
                            {
                                getOr(p.data.attachmentIDs, []).map(id => (
                                    <SwiperSlide children={
                                        <DocumentAttachmentRenderer attachmentID={id}/>
                                    }/>
                                ))
                            }
                        </Swiper>
                    </Flex>
                }/>,

                <If condition={p.data.note !== undefined && p.data.note.trim().length > 0} ifTrue={
                    <Flex gap={t.gaps.smallGab} fw>
                        <Text text={"Note"} uppercase bold type={TextType.secondaryDescription} fontSize={px(12)} align={Align.START}/>
                        <Text text={getOr(p.data.note, "")} type={TextType.secondaryDescription} fontSize={px(11)} align={Align.START}/>
                    </Flex>
                }/>,
            ]}/>
        ), "data")
    }
}

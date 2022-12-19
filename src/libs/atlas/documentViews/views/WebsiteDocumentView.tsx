import {DocumentView} from "../DocumentView";
import {OverflowBehaviour} from "../../../sql/logic/style/OverflowBehaviour";
import {Flex} from "../../../sql/components/lo/FlexBox";
import React from "react";
import Editor from "@monaco-editor/react";
import {NoteDocumentArchetype} from "../../data/documentArchetypes/NoteDocumentArchetype";
import {OverflowWithHeader} from "../../../sql/components/lo/OverflowWithHeader";
import {FlexDirection} from "../../../sql/logic/style/FlexDirection";
import {px} from "../../../sql/logic/style/DimensionalMeasured";
import {Separator} from "../../../sql/components/lo/Separator";
import {Orientation} from "../../../sql/logic/style/Orientation";
import {Align} from "../../../sql/logic/style/Align";
import {Text, TextType} from "../../../sql/components/lo/Text";
import {Box} from "../../../sql/components/lo/Box";
import {BC} from "../../../sql/logic/BernieComponent";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Dot} from "../../../sql/components/lo/Dot";
import {DocumentSaveState} from "../../data/DocumentSaveState";
import {Tooltip} from "../../../sql/components/ho/tooltip/Tooltip";
import {Icon} from "../../../sql/components/lo/Icon";
import {ReactComponent as SavedIcon} from "../../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as PendingIcon} from "../../../../assets/icons/ic-20/ic20-hourglass-progress.svg";
import {VM} from "../../../sql/logic/style/ObjectVisualMeaning";
import {DocumentState} from "../../data/DocumentState";
import {Button} from "../../../sql/components/lo/Button";
import EmojiPicker, {Emoji, EmojiStyle, SuggestionMode, Theme} from "emoji-picker-react";
import {ContextCompound} from "../../../sql/components/ho/contextCompound/ContextCompound";
import styled from "styled-components";
import {DocumentViewRenderContext} from "../DocumentViewRenderContext";
import {VFSFolderView} from "../../components/VFSFolderView";
import {WebsiteDocumentArchetype} from "../../data/documentArchetypes/WebsiteDocumentArchetype";

export const websiteDocumentView: DocumentView = {
    renderer: (context) => {
        return (
            <WebsiteDocumentView context={context}/>
        );
    }
}

type WebsiteDocumentViewProps = {
    context: DocumentViewRenderContext
}

class WebsiteDocumentView extends BC<WebsiteDocumentViewProps, any, any> {

    componentRender(p: WebsiteDocumentViewProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        // const docState: DocumentState = view.getDocumentState(document.id);
        const document = p.context.data.documentGetter();
        const docState: DocumentState = p.context.data.documentStateGetter();
        const view: VFSFolderView = p.context.data.view;

        let url: string = "";
        try {
            url = (JSON.parse(document.body as string) as WebsiteDocumentArchetype).url ?? "Cannot load..";
        } catch (e) {
            console.error(e);
        }

        return (
            <iframe
                src={url}
                width={"100%"}
                height={"100%"}
                style={{ border: "none" }}
            />
        );
    }
}

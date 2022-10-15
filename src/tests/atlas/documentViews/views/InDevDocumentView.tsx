import {DocumentView} from "../DocumentView";
import {ObjectJSONDisplay} from "../../../../components/ho/objectJSONDisplay/ObjectJSONDisplay";
import {OverflowBehaviour} from "../../../../logic/style/OverflowBehaviour";
import {DrawerHeader} from "../../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning} from "../../../../logic/style/ObjectVisualMeaning";
import {Flex} from "../../../../components/lo/FlexBox";
import React from "react";

export const inDevDocumentView: DocumentView = {
    renderer: document => {
        return (
            <Flex fw fh overflowYBehaviour={OverflowBehaviour.SCROLL} padding elements={[
                <DrawerHeader
                    header={"inDevDocumentView"}
                    badgeText={"DEV"}
                    enableBadge
                    badgeVM={ObjectVisualMeaning.BETA}
                    description={"All your folders at-a-glance\nPress on the context icon to see available actions, like creating folders or accessing ISO-image manager"}
                />,
                <ObjectJSONDisplay enableClipboard pure={false} showControls object={document}/>
            ]}/>
        );
    }
}

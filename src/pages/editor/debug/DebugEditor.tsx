import React from "react";
import {PageV2} from "../../../components/Page";
import {LiteGrid} from "../../../components/LiteGrid";
import {FlexBox} from "../../../components/FlexBox";
import {Align} from "../../../logic/Align";
import {Justify} from "../../../logic/Justify";
import {Icon} from "../../../components/Icon";
import {ReactComponent as MenuIcon} from "../../../assets/icons/ic-20/ic20-menu.svg";
import {App} from "../../../logic/App";
import {Text, TextType} from "../../../components/Text";
import {DBSessionCacheShard} from "../../../shards/DBSessionCacheShard";
import {ObjectJSONDisplay} from "../../../components/ObjectJSONDisplay";
import {Input} from "../../../components/Input";
import {percent} from "../../../logic/DimensionalMeasured";
import {Box} from "../../../components/Box";

export class DebugEditor extends React.Component<any, any> {

    render() {
        return (
            <PageV2>
                <LiteGrid rows={2} height={percent(100)}>
                    <FlexBox>
                        <LiteGrid columns={3}>
                            <FlexBox align={Align.START} justifyContent={Justify.CENTER}>
                                <Icon icon={<MenuIcon/>} onClick={() => App.app().openMenu()}/>
                            </FlexBox>
                            <FlexBox align={Align.CENTER} justifyContent={Justify.CENTER}>
                                <Text uppercase align={Align.CENTER} type={TextType.smallHeader} text={"Debug Editor"} />
                            </FlexBox>
                        </LiteGrid>
                        <ObjectJSONDisplay pure={false} title={"DB session info data"} object={App.app().shard<DBSessionCacheShard>("db-session-cache").currentInfoData}/>
                    </FlexBox>



                    <FlexBox justifyContent={Justify.FLEX_END}>
                        <Box width={percent(100)} height={percent(100)}>
                            <Text text={"DB edit history"}/>
                        </Box>
                        <Input label={"SQL"}/>
                    </FlexBox>
                </LiteGrid>
            </PageV2>
        );
    }
}
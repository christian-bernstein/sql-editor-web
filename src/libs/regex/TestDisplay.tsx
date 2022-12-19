import React from "react";
import {RegExpHighlighter} from "./RegExpHighlighter";
import {Box} from "../sql/components/lo/Box";
import {ObjectVisualMeaning} from "../sql/logic/style/ObjectVisualMeaning";
import {FlexBox} from "../sql/components/lo/FlexBox";
import {percent, px} from "../sql/logic/style/DimensionalMeasured";
import {FlexDirection} from "../sql/logic/style/FlexDirection";
import {Align} from "../sql/logic/style/Align";
import {Justify} from "../sql/logic/style/Justify";
import {Text} from "../sql/components/lo/Text";
import Highlight from "react-highlighter";
import {Icon} from "../sql/components/lo/Icon";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {getRegExp} from "./RegexPage";
import {Test} from "./Test";

export const TestDisplay: React.FC<{ test: Test, index?: number }> = props => {
    const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
    return (
        <Box visualMeaning={ObjectVisualMeaning.UI_NO_HIGHLIGHT} opaque={true}>
            <FlexBox width={percent(100)} flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN}>
                <FlexBox gap={px(0)}>
                    <Text text={`Test ${props.index}`}/>

                    <Highlight matchClass={"reg-match"} search={exp}>
                        {props.test.test}
                    </Highlight>

                </FlexBox>
                <Icon icon={<ErrorIcon/>} onClick={() => {
                    RegExpHighlighter.removeTest(props.test.id);
                }}/>
            </FlexBox>
        </Box>
    );
}

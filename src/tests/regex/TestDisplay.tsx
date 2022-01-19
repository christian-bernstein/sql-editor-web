import React from "react";
import {RegExpHighlighter} from "./RegExpHighlighter";
import {Box} from "../../components/Box";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {FlexBox} from "../../components/FlexBox";
import {percent, px} from "../../logic/DimensionalMeasured";
import {FlexDirection} from "../../logic/FlexDirection";
import {Align} from "../../logic/Align";
import {Justify} from "../../logic/Justify";
import {Text} from "../../components/Text";
import Highlight from "react-highlighter";
import {Icon} from "../../components/Icon";
import {ReactComponent as ErrorIcon} from "../../assets/icons/ic-16/ic16-close.svg";
import {getRegExp, Test} from "./RegexPage";

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

import React from "react";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";
import {Box} from "../../lo/Box";
import {FlexBox} from "../../lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {ReactComponent as WarningIcon} from "../../../assets/icons/ic-20/ic20-warning.svg";
import {ReactComponent as InformationIcon} from "../../../assets/icons/ic-20/ic20-info.svg";
import {ReactComponent as ErrorIcon} from "../../../assets/icons/ic-20/ic20-alert-full.svg";
import {ReactComponent as SuccessIcon} from "../../../assets/icons/ic-20/ic20-check.svg";
import {ReactComponent as BetaIcon} from "../../../assets/icons/ic-20/ic20-bug.svg";
import {Icon} from "../../lo/Icon";
import {Align} from "../../../logic/style/Align";
import {getOr} from "../../../logic/Utils";
import {DimensionalMeasured} from "../../../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../../../logic/style/OverflowBehaviour";

export type InformationBoxProps = {
    visualMeaning?: ObjectVisualMeaning,
    width?: DimensionalMeasured
}

export const InformationBox: React.FC<InformationBoxProps> = props => {
    const vm: ObjectVisualMeaning = getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);

    return(
        <Box visualMeaning={vm} opaque width={props.width} overflowXBehaviour={OverflowBehaviour.SCROLL}>
            <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                <Icon visualMeaning={vm} colored icon={getMeaningfulIcon(vm)}/>
                {props.children}
            </FlexBox>
        </Box>
    );
}

const getMeaningfulIcon: (vm: ObjectVisualMeaning) => JSX.Element = vm => {
    switch (vm) {
        case ObjectVisualMeaning.UI_NO_HIGHLIGHT:
            return <InformationIcon/>;
        case ObjectVisualMeaning.SUCCESS:
            return <SuccessIcon/>;
        case ObjectVisualMeaning.INFO:
            return <InformationIcon/>;
        case ObjectVisualMeaning.WARNING:
            return <WarningIcon/>;
        case ObjectVisualMeaning.ERROR:
            return <ErrorIcon/>;
        case ObjectVisualMeaning.BETA:
            return <BetaIcon/>
    }
}

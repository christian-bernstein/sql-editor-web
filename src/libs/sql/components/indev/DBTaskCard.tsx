import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Box} from "../lo/Box";
import {FlexBox} from "../lo/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Align} from "../../logic/style/Align";
import {Justify} from "../../logic/style/Justify";
import {percent, px} from "../../logic/style/DimensionalMeasured";
import {Icon} from "../lo/Icon";
import {ReactComponent as ShowIcon} from "../../../../assets/icons/ic-20/ic20-visibility.svg";
import React from "react";
import {Text, TextType} from "../lo/Text";
import {Button} from "../lo/Button";

export type DBTaskCardProps = {

}

export type DBTaskCardLocalState = {

}

export class DBTaskCard extends BernieComponent<DBTaskCardProps, any, DBTaskCardLocalState> {

    constructor(props: DBTaskCardProps) {
        super(props, undefined, {

        });
    }

    componentRender(p: DBTaskCardProps, s: any, l: DBTaskCardLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box bgColor={t.colors.backgroundHighlightColor200} width={percent(100)}>
                <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER} justifyContent={Justify.SPACE_BETWEEN} width={percent(100)}>
                    <FlexBox gap={t.gaps.defaultGab} flexDir={FlexDirection.ROW} align={Align.CENTER}>
                        <Icon icon={<ShowIcon/>}/>
                        <FlexBox gap={px(2)}>
                            <Text text={"Import from table file"} fontSize={px(12)} bold/>
                            <Text text={"209.231 rows imported"} fontSize={px(12)} type={TextType.secondaryDescription}/>
                        </FlexBox>
                    </FlexBox>
                    <FlexBox>
                        <Button>
                            <Icon icon={<ShowIcon/>}/>
                        </Button>
                    </FlexBox>
                </FlexBox>
            </Box>
        );
    }
}

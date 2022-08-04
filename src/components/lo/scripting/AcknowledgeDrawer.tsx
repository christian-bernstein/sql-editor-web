import React from "react";
import {StaticDrawerMenu} from "../StaticDrawerMenu";
import {Flex} from "../FlexBox";
import {Text, TextType} from "../Text";
import {Button} from "../Button";
import {percent} from "../../../logic/style/DimensionalMeasured";
import {DrawerProps} from "../../props/DrawerProps";
import {getOr} from "../../../logic/Utils";
import {If} from "../../logic/If";

export type AcknowledgeDrawerProps = DrawerProps & {
    title?: string,
    description?: string
};

export const AcknowledgeDrawer: React.FC<AcknowledgeDrawerProps> = props => {
    return (
        <StaticDrawerMenu body={p => {
            return (
                <Flex>
                    <Text text={getOr(props.title, "Acknowledge")} type={TextType.smallHeader}/>
                    <If condition={props.description !== undefined} ifTrue={
                        <Text text={props.description as string}/>
                    }/>

                    <Button width={percent(100)} text={"OK"} onClick={() => {
                        props.onClose?.();
                        props.onSubmit?.();
                    }}/>
                </Flex>
            );
        }}/>
    );
};
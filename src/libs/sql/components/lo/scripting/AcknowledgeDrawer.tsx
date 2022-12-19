import React from "react";
import {StaticDrawerMenu} from "../StaticDrawerMenu";
import {Flex} from "../FlexBox";
import {Text, TextType} from "../Text";
import {Button} from "../Button";
import {percent} from "../../../logic/style/DimensionalMeasured";
import {DrawerProps} from "../../props/DrawerProps";
import {getOr} from "../../../logic/Utils";
import {If} from "../../logic/If";

export type AcknowledgeDrawerProps = DrawerProps<undefined> & {
    title?: string,
    description?: string,
};

export const AcknowledgeDrawer: React.FC<AcknowledgeDrawerProps> = props => {
    return (
        <StaticDrawerMenu body={p => {
            return (
                <Flex width={percent(100)}>
                    <Text text={getOr(props.title, "Acknowledge")} type={TextType.smallHeader}/>
                    <If condition={props.description !== undefined} ifTrue={
                        <Text text={props.description as string}/>
                    }/>
                    <Button width={percent(100)} text={"OK"} onClick={() => {
                        setTimeout(() => {
                            props.onClose?.();
                            props.onSubmit?.(undefined);
                        }, 1);
                    }}/>
                </Flex>
            );
        }}/>
    );
};

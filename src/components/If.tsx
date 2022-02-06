import React from "react";

export const If: React.FC<{
    condition: boolean,
    ifTrue: JSX.Element,
    ifFalse: JSX.Element
}> = props => {
    if (props.condition) {
        return props.ifTrue;
    } else {
        return props.ifFalse;
    }
}

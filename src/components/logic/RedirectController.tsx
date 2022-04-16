import React from "react";
import {Redirect} from "react-router-dom";
import {RedirectProps} from "react-router";

export type RedirectControllerProps = {
    redirect: boolean,
    data: RedirectProps
}

// to={getOr(props.data.to, "/")}
export const RedirectController: React.FC<RedirectControllerProps> = React.memo(props => {
    if (props.redirect) {
        return (
            <Redirect {...props.data}/>
        );
    } else {
        return (
            <>
                {props.children}
            </>
        );
    }
});

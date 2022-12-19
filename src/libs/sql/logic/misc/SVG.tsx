import React from "react";
import {ObjectVisualMeaning} from "../style/ObjectVisualMeaning";

export namespace SVG {

    export function circle(): JSX.Element {
        return (
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="5"/>
            </svg>
        );
    }
}

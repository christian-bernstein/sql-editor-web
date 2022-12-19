import {FC} from "react";
import {BrowserRouter, Route, RouteComponentProps} from "react-router-dom";
import {Driver} from "./Driver";
import {Program} from "./Program";
import {LocatableProgram} from "./LocatableProgram";

export const DriverReactBridge: FC = (props, context) => {


    return (
        <BrowserRouter  children={
            Array.from(Driver.programRegistry.entries()).map(([id, program]: [string, LocatableProgram]) => (
                <Route
                    exact={program.exact}
                    path={program.path}
                    render={rP => program.render(rP)}
                />
            ))
        }/>
    );
}

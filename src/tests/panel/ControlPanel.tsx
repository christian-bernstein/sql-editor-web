import React, {useState} from "react";
import {Environment} from "../../logic/Environment";
import Connector = Environment.Connector;
import {Button} from "@mui/material";

type ControlPanelState = {
    connector?: Connector
}

const ControlPanel:React.FC = () => {
    const [state, setState] = useState<ControlPanelState>(() => {
        return {
            connector: new Connector("v1", "ws:127.0.0.1:30001").connect()
        }
    })

    const handleClick: (...keys: string[]) => void = key => {

    };

    return(
        <>
            <Button
                onClick={() => {handleClick("w")}}
                variant={"outlined"}>
                Send W
            </Button>
        </>
  );
}

import {BernieComponent} from "../../../logic/BernieComponent";
import {SessionHistoryEntry} from "../../../logic/misc/SessionHistoryEntry";
import React from "react";
import {App} from "../../../logic/app/App";
import {SettingsElement} from "../settingsElement/SettingsElement";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {ProfilePicture} from "../../lo/ProfilePicture";
import {ClientDisplay} from "../clientDisplay/ClientDisplay";
import {px} from "../../../logic/style/DimensionalMeasured";

export type ContinueAsV2Props = {
    sessionHistoryEntry: SessionHistoryEntry,
    calledFromWhere?: string
}

export type ContinueAsV2LocalState = {
    loginInProcess: boolean
    error: boolean
}

export class ContinueAsV2 extends BernieComponent<ContinueAsV2Props, any, ContinueAsV2LocalState> {

    constructor(props: ContinueAsV2Props) {
        super(props, undefined, {
            error: false,
            loginInProcess: false
        });
    }

    private onContinueClicked(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.local.state.loginInProcess) {
                // TODO: Return error ?
                reject();
            } else {
                App.app().login({
                    initialLoginProcedure: "session",
                    sessionID: this.props.sessionHistoryEntry.sessionID,
                    onLoginProcessStarted: () => {
                        this.local.setState({
                            loginInProcess: true
                        });
                    },
                    onLoginProcessEnded: () => {
                        this.local.setState({
                            loginInProcess: false
                        });
                    },
                    onLoginSuccess: () => {
                        resolve(undefined);
                    },
                    onLoginFail: () => {
                        // TODO: Return error
                        reject("");
                    }
                });
            }
        });
    }

    componentRender(p: ContinueAsV2Props, s: any, l: ContinueAsV2LocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <SettingsElement
                forceRenderSubpageIcon
                groupDisplayMode
                title={p.sessionHistoryEntry.profileData.username}
                promiseBasedOnClick={element => this.onContinueClicked()}
                iconConfig={{
                    enable: true,
                    iconGenerator: element => (
                        <ClientDisplay
                            pureImage
                            imageSize={px(20)}
                            onlyImage
                            clientID={p.sessionHistoryEntry.profileData.id}
                        />
                    )
                }}
            />
        );
    }
}

import {BernieComponent} from "../../../logic/BernieComponent";
import {StaticDrawerMenu} from "../../lo/StaticDrawerMenu";
import {FirstJoinIntroduction} from "./FirstJoinIntroduction";
import {FormDataHub} from "../../../libs/epicure/components/FormDataHub";

export enum AcknowledgeState {
    ACKNOWLEDGED, REJECTED, NEUTRAL
}

export type FirstJoinIntroductionLauncherLocalState = {
    fdh: FormDataHub
}

export class FirstJoinIntroductionLauncher extends BernieComponent<any, any, FirstJoinIntroductionLauncherLocalState> {

    constructor() {
        super(undefined, undefined, {
            fdh: new FormDataHub("first-join-introduction").loadFromLocalStore()
        });
    }

    public static resetFirstJoinAcknowledgeState() {
        new FormDataHub("first-join-introduction").set("acknowledge", AcknowledgeState.NEUTRAL, true);
    }

    private setAcknowledgeState(state: AcknowledgeState) {
        this.local.state.fdh.set("acknowledge", state, true);
        if (state !== AcknowledgeState.NEUTRAL) {
            setTimeout(() => this.closeLocalDialog(), 200);
        }
    }

    componentDidMount() {
        super.componentDidMount();

        if (this.local.state.fdh.getOrSave("acknowledge", AcknowledgeState.NEUTRAL) === AcknowledgeState.NEUTRAL) {
            this.dialog(
                <StaticDrawerMenu body={props => (
                    <FirstJoinIntroduction actions={{
                        onAcknowledgeAndContinue: component => {
                            this.setAcknowledgeState(AcknowledgeState.ACKNOWLEDGED);
                        }
                    }}/>
                )}/>
            );
        }
    }
}

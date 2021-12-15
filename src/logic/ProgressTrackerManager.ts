import {App} from "./App";
import {IProgressTrackerBridge} from "./IProgressTrackerBridge";
import {v4} from "uuid";

export class ProgressTrackerManager {

    private readonly instance: App;

    private readonly bridges: Map<string, Map<string, IProgressTrackerBridge>> = new Map<string, Map<string, IProgressTrackerBridge>>();

    constructor(instance: App) {
        this.instance = instance;
    }

    public mountProgressTracker(taskID: string, bridge: IProgressTrackerBridge): string {
        const trackerID: string = v4();

        if (!this.bridges.has(taskID)) {
            this.bridges.set(taskID, new Map<string, IProgressTrackerBridge>([[trackerID, bridge]]));
            bridge.onMount?.();
        } else {
            this.bridges.get(taskID)?.set(trackerID, bridge);
            bridge.onMount?.();
        }
        return trackerID;
    }

    public unmountProgressTracker(taskID: string, trackerID: string): boolean {
        if (this.bridges.has(taskID)) {
            const taskSpecificBridges: Map<string, IProgressTrackerBridge> = this.bridges.get(taskID) as Map<string, IProgressTrackerBridge>;
            if (taskSpecificBridges.has(trackerID)) {
                taskSpecificBridges.get(trackerID)?.onUnmount?.();
                taskSpecificBridges.delete(trackerID);
                if (taskSpecificBridges.size === 0) {
                    this.bridges.delete(taskID);
                }
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

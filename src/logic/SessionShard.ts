import {Shard} from "./Shard";
import {UserData} from "./UserData";

export class SessionShard extends Shard {

    private _userData?: UserData;

    public getSessionID(): string | null {
        return window.localStorage.getItem("session-id");
    }

    public setSessionID(id: string): void {
        window.localStorage.setItem("session-id", id);
    }

    public hasSessionID(): boolean {
        return this.getSessionID() !== null;
    }

    public userAction(action: () => void): void {
    }
}

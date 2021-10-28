import {UserData} from "./UserData";

let instance: App | undefined = undefined;

export let app: () => App = () => {
    if (instance === undefined) {
        instance = new App();
    }
    return instance;
};

export class App {

    private userData: UserData | undefined;

    public getSessionID(): string | null {
        return window.localStorage.getItem("session-id")
    }

    public setSessionID(id: string): App {
        window.localStorage.setItem("session-id", id);
        return this;
    }

    public userAction(action: () => void): App {
        return this;
    }
}

import {RenderBridge} from "./renderBridge";

export class RenderController {

    private readonly executors: Map<string, RenderBridge> = new Map<string, RenderBridge>();

    public register(bridge: RenderBridge) {

        console.log(this.executors)

        this.executors.set(bridge.id, bridge);
    }

    public unregister(id: string) {
        this.executors.delete(id);
    }

    public rerender(...channels: string[]) {
        Array.from(this.executors.values()).filter(value => {
            let b: boolean = false;
            for (let channel of value.channels) {
                if (channels.includes(channel)) {
                    b = true;
                }
            }
            return b;
        }).forEach(value => {
            try {
                value.rerenderHook();
            } catch (e) {
                console.error(e);
            }
        })
    }
}
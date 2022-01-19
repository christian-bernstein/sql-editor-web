export type RenderBridge = {
    rerenderHook: () => void,
    channels: string[],
    id: string
}
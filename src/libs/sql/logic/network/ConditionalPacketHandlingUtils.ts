import {Environment} from "../Environment";

export function handleProxy(packet: Environment.Packet, connector: Environment.Connector, ...handlers: {
    id: string,
    handle: (connector: Environment.Connector, packet: Environment.Packet) => void,
}[]): void {
    const packetID = packet.packetID;
    handlers.filter(handler => handler.id === packetID).forEach(handler => {
        handler.handle(connector, packet);
    })
}

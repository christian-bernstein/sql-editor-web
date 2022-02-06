export type ProjectCreateRequestPacketData = {
    title: string,
    description: string,
    stator: boolean,
    dbFactoryID: string,
    dbFactoryParams: Map<String, object>
}

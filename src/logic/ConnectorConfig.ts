export type ConnectorConfig = {
    maxConnectAttempts: number,
    protocol: string,
    address: string,
    id: string,
    connectionRetryDelayFunc: (i: number) => number,
    onConnectionFailed?: () => void
}

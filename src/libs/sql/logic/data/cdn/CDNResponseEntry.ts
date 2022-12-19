// todo refactor... status no number, errors no any array
export type CDNResponseEntry = {
    data: any,
    status: number,
    errors: any[],
    requestID?: string
}

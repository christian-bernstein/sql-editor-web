export type ImageData = {
    // todo move to separate enum
    type: "LINK" | "CDN" | "SRC" | "UNSET",
    src: string
}

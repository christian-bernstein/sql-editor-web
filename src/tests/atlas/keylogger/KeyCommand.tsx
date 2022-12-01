export type KeyCommand = {
    initKey: string,
    title: string,
    helpText: string,
    keyHintGenerator: (cache: Array<string>) => Array<string>
}
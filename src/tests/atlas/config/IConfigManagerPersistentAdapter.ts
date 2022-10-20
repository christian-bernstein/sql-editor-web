export interface IConfigManagerPersistentAdapter {
    get: (key: string) => string | undefined;
    set: (key: string, value: string) => void;
    has: (key: string) => boolean;
}

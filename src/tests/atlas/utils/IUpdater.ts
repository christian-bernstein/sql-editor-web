export interface IUpdater<T> {
    update: (callback: (data: T) => T) => void
}

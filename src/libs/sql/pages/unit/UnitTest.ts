export type UnitTest<T> = {
    name: string,
    displayName: string,
    element: T,
    factory: (Elem: T) => JSX.Element
}

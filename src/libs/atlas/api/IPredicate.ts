export interface IPredicate<T> {
    test(obj: T): boolean;
}

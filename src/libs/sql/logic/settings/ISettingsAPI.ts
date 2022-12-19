export interface ISettingsAPI {
    /**
     * Request a single setting
     */
    request<T>(...id: Array<string>): Promise<T>;

    /**
     * Request multiple settings, compiled into a compound. The compound is represented as a type.
     */
    requestCompound<T extends object>(...compoundID: Array<string>): Promise<T>;
}

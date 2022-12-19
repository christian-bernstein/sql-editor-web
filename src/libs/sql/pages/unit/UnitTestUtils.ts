import {UnitTest} from "./UnitTest";

export namespace UnitTestUtils {

    export const unittests: Map<string, UnitTest<any>> = new Map<string, UnitTest<any>>();

    export function createTest<T>(config: UnitTest<T>, overwrite: boolean = false): T {
        if (!unittests.has(config.name) || overwrite) {
            unittests.set(config.name, config);
        }
        return config.element;
    }

    export function createTestConfig<T>(config: UnitTest<T>): UnitTest<T> {
        return config;
    }
}


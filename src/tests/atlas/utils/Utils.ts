export function measureTime(testId: string, func: () => void) {
    console.time(testId);
    try {
        func();
        console.timeEnd(testId);
    } catch (e) {
        console.timeEnd(testId);
        console.error(e);
    }
}

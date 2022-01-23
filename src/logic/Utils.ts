export function getOr<T>(val: T | undefined, def: T) {
    if (val === undefined) {
        return def;
    } else {
        return val;
    }
}

export function array<T>(obj: T, n: number = 1): T[] {
    const arr: T[] = [];
    for (let i = 0; i < n; i++) {
        arr.push(obj);
    }
    return arr;
}

export function arrayFactory<T>(objSuppl: (i: number) => T, n: number = 1): T[] {
    const arr: T[] = [];
    for (let i = 0; i < n; i++) {
        arr.push(objSuppl(i));
    }
    return arr;
}

export namespace Utils {

    /**
     * IMPORTANT: Only works with number-based enums. not: TEST = (...)
     *
     * source: https://stackoverflow.com/a/55699349/16368544
     */
    export function randomEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.keys(anEnum).map(n => Number.parseInt(n)).filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        return enumValues[randomIndex];
    }

    export function randomBool(): boolean {
        return Math.random() > .5;
    }

    export function format(format: string, ...replacements: string[]): string {
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof replacements[number] !== 'undefined'
                ? replacements[number]
                : match
                ;
        });
    }

    export function reloadPage(): void {
        window.location.reload();
    }

    export function toggleFullScreen(onEffect: (() => void) | undefined, fullscreen: boolean | undefined = undefined): void {
        if (fullscreen === undefined) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    if (onEffect !== undefined) {
                        onEffect();
                    }
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then(() => {
                        if (onEffect !== undefined) {
                            onEffect();
                        }
                    });
                }
            }
        } else {
            if (fullscreen) {
                document.documentElement.requestFullscreen().then(() => {
                    if (onEffect !== undefined) {
                        onEffect();
                    }
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then(() => {
                        if (onEffect !== undefined) {
                            onEffect();
                        }
                    });
                }
            }
        }
    }
}

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

export function getOr<T>(val: T | undefined, def: T) {
    if (val === undefined) {
        return def;
    } else {
        return val;
    }
}

export namespace Utils {

    export function format(format: string, ...replacements: string[]): string {
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof replacements[number] != 'undefined'
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
                    if (onEffect != undefined) {
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

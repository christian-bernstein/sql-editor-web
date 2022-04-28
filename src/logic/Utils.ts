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

    /**
     * From Stackoverflow (https://stackoverflow.com/a/14919494/16368544)
     *
     * Format bytes as human-readable text.
     *
     * @param bytes Number of bytes.
     * @param si True to use metric (SI) units, aka powers of 1000. False to use
     *           binary (IEC), aka powers of 1024.
     * @param dp Number of decimal places to display.
     *
     * @return Formatted string.
     */
    export function humanFileSize(bytes: number, si=false, dp=1) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(dp) + ' ' + units[u];
    }

    // todo remove logs
    export function fallbackCopyTextToClipboard(text: string) {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    /**
     * todo remove logs
     * https://stackoverflow.com/a/30810322/16368544
     */
    export function copyTextToClipboard(text: string) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
}

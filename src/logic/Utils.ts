export namespace Utils {

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

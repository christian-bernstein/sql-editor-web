import {getOr} from "../../logic/Utils";

export type VibrationSettingsProps = {
    enable?: boolean,
    pattern?: number[],
    activeChannels?: string[]
}

export const shouldVibrate = (channel: string, props?: VibrationSettingsProps, ifYes?: (pattern: number[]) => void): boolean => {
    if (props === undefined) {
        return false;
    }
    if (props.enable && props.activeChannels === undefined ? true : props.activeChannels?.includes(channel)) {
        ifYes?.(getOr(props.pattern, [1]));
        return true;
    } else {
        return false;
    }
}

import React from "react";
import { useMediaQuery } from 'react-responsive';
import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";

export type MediaProps = {
    rerenderOnResize?: boolean,
    isDesktop?: (p: MediaProps, s: any, l: any, t: Themeable.Theme, a: Assembly) => JSX.Element,
    isTablet?: (p: MediaProps, s: any, l: any, t: Themeable.Theme, a: Assembly) => JSX.Element,
    isMobile?: (p: MediaProps, s: any, l: any, t: Themeable.Theme, a: Assembly) => JSX.Element,
    isDefault?: (p: MediaProps, s: any, l: any, t: Themeable.Theme, a: Assembly) => JSX.Element,
    onResize?: () => void
}

export class Media extends BernieComponent<MediaProps, any, any> {

    private onResize() {
        this.forceUpdate(this.props.onResize);
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.rerenderOnResize) {
            window.addEventListener('resize', this.onResize);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.rerenderOnResize) {
            window.removeEventListener('resize', this.onResize);
        }
    }

    componentRender(p: MediaProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        // if (useMediaQuery({ minWidth: 992 })) {
        //     return this.props.isDesktop?.(p, s, l, t, a);
        // } else if (useMediaQuery({ minWidth: 768, maxWidth: 991 })) {
        //     return this.props.isTablet?.(p, s, l, t, a);
        // } else if (useMediaQuery({ maxWidth: 767 })) {
        //     return this.props.isMobile?.(p, s, l, t, a);
        // } else {
        //     return this.props.isDefault?.(p, s, l, t, a);
        // }
        return <>error implement..</>
    }
}

export const Desktop: React.FC<any> = props => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? props.children : null;
}

export const Tablet: React.FC<any> = props => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? props.children : null
}

export const Mobile: React.FC<any> = props => {
    try {
        const isMobile = useMediaQuery({ maxWidth: 767 })
        return isMobile ? props.children : null
    } catch (e) {
        console.error(e);
        return null;
    }

}

export const Default: React.FC<any> = props => {
    try {
        const isNotMobile = useMediaQuery({ minWidth: 768 })
        return isNotMobile ? props.children : null
    } catch (e) {
        console.error(e);
        return null;
    }
}

import {PortfolioGlobals} from "./PortfolioGlobals";

export class PortfolioAPI {

    private static singleton?: PortfolioAPI;

    private readonly _globals: PortfolioGlobals

    public static api(factory: (() => PortfolioAPI) | undefined = undefined): PortfolioAPI {
        if (this.singleton === undefined) {
            if (factory === undefined) throw new Error("[PortfolioAPI] Cannot access api: Singleton & factory are undefined");
            this.singleton = factory();
        }
        return this.singleton;
    }

    constructor() {
        this._globals = {
            copyrightNote: "© 2022 Christian Bernstein. All Rights Reserved.",
            contactEmail: "info@christian-benstein.de",
            discordLink: "",
            instagramLink: "",
            linkedinLink: "",
            twitterLink: "",
            githubLink: "https://github.com/christian-bernstein"
        }
    }

    get globals(): PortfolioGlobals {
        return this._globals;
    }
}

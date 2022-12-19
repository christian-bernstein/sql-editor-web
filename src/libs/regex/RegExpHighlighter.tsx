import React from "react";
import Highlight from "react-highlighter";
import {getRegExp, RegexPage} from "./RegexPage";
import {TestDisplay} from "./TestDisplay";
import {Test} from "./Test";
import {getOr} from "../sql/logic/Utils";

export const getLocalStoreValue: (type: "regex" | "search", def?: string) => string = (type, def) =>  {
    const item = window.localStorage.getItem(type);
    if (item === null) {
        return getOr(def, "");
    } else return item;
}

export class RegExpHighlighter extends React.Component {

    public static staticTests: Test[] = RegExpHighlighter.loadTests();

    public static staticRegex: string = getLocalStoreValue("regex", "");

    public static staticSearch: string = getLocalStoreValue("search", "");

    private static loadTests(): Test[] {
        const json = window.localStorage.getItem("tests");
        if (json === null) return [];
        try {
            return JSON.parse(json);
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    public static testCount(): number {
        return this.staticTests.length;
    }

    private static saveTests() {
        try {
            const json = JSON.stringify(RegExpHighlighter.staticTests);
            window.localStorage.setItem("tests", json);
        } catch (e) {
            console.error(e);
            // todo error handling..
        }
    }

    public static addTest(test: Test, rerender: boolean = true) {
        this.staticTests.push(test);
        if (rerender) {
            RegexPage.controller.rerender("*", "tests")
        }
        this.saveTests();
    }

    public static removeTest(id: string, rerender: boolean = true) {
        const index = this.staticTests.findIndex(value => value.id === id);
        if (index > -1) {
            this.staticTests.splice(index, 1);
            if (rerender) {
                RegexPage.controller.rerender("*", "tests")
            }
            this.saveTests();
        }
    }

    public static clearTests(rerender: boolean = true) {
        this.staticTests = [];
        if (rerender) {
            RegexPage.controller.rerender("*", "tests")
        }
        this.saveTests();
    }

    render() {
        const [exp, expValid] = getRegExp(RegExpHighlighter.staticRegex);
        return (
            <>
                {
                    RegExpHighlighter.staticTests.map((value, index) => {
                        return (
                            <TestDisplay test={value} index={index} key={"test-" + index}/>
                        );
                    })
                }
                <Highlight matchClass={"reg-match"} search={exp}>
                    {RegExpHighlighter.staticSearch}
                </Highlight>
            </>
        );
    }
}

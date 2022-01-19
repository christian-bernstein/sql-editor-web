import React from "react";
import {Themeable} from "../../Themeable";
import {utilizeGlobalTheme} from "../../logic/App";
import {Box} from "../../components/Box";
import {OverflowBehaviour} from "../../logic/OverflowBehaviour";
import {Text, TextType} from "../../components/Text";
import {LiteGrid} from "../../components/LiteGrid";
import {px} from "../../logic/DimensionalMeasured";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";

export type CheatsheetData = {
    categories: {
        title: string
        entries: {
            regex: string,
            description: string
        }[]
    }[]
}

export const Cheatsheet: React.FC<CheatsheetData> = React.memo(props => {

    const theme: Themeable.Theme = utilizeGlobalTheme(Themeable.defaultTheme);

    return (
        <Box gapY={theme.paddings.defaultObjectPadding} overflowYBehaviour={OverflowBehaviour.SCROLL}>{
            props.categories.map(value => {
                return (
                    <>
                        <Text text={value.title} type={TextType.smallHeader}/>
                        {
                            value.entries.map(entry => {
                                return (
                                    <Box>
                                        <LiteGrid columns={2} responsive={true} minResponsiveWidth={px(400)}>
                                            <Text text={entry.regex} coloredText={true} visualMeaning={ObjectVisualMeaning.INFO}/>
                                            <Text text={entry.description}/>
                                        </LiteGrid>
                                    </Box>
                                );
                            })
                        }
                    </>
                );
            })
        }</Box>
    );
});

const cheatsheet: CheatsheetData = {
    categories: [
        {
            title: "Character classes",
            entries: [
                {
                    regex: ".",
                    description: "any character except newline"
                },
                {
                    regex: "\\w \\d \\s",
                    description: "word, digit, whitespace"
                },
                {
                    regex: "\\W \\D \\S",
                    description: "not word, digit, whitespace"
                },
                {
                    regex: "[abc]",
                    description: "any of a, b or c"
                },
                {
                    regex: "[^abc]",
                    description: "not a, b or c"
                },
                {
                    regex: "[a-g] [0-5]",
                    description: "character between a & g / character between 0 & 5"
                },
            ]
        },
        {
            title: "Anchors",
            entries: [
                {
                    regex: "^abc$",
                    description: "start / end of the string"
                },
                {
                    regex: "\\b \\B",
                    description: "word, not-word boundary"
                },
            ]
        },
        {
            title: "Escaped characters",
            entries: [
                {
                    regex: "\\. \\* \\\\",
                    description: "escaped special characters"
                },
                {
                    regex: "\\t \\n \\r",
                    description: "\ttab, linefeed, carriage return"
                },
            ]
        }
    ]
}
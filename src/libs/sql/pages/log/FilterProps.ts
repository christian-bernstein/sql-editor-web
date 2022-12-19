import {WithVisualMeaning} from "../../logic/style/WithVisualMeaning";

export type FilterProps = WithVisualMeaning & {
    id: "all" | "trc" | "deb" | "inf" | "wrn" | "err",
    // id: string,
    amount: number,
    active: boolean
}

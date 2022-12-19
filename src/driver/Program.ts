import {RouteComponentProps} from "react-router-dom";

export type Program = {
    render: ((props: RouteComponentProps<any>) => JSX.Element)
}

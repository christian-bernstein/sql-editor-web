import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import {Button, Input, Typography} from "@mui/material";
import "./ReactRoutingTest.scss";
import {App} from "../../deprecated/App";

export class Main extends React.Component {

    private appContainer: JSX.Element | undefined;

    private toggleMenu(): void {
        // Move the app container to the right side and make it smaller
    }

    // <Link to="/">Home</Link>
    // <span className={"app-side-close-rect"}/>
    render() {
        return (
            <div className={"app-screen "}>
                <div className={"app-background"}>
                    <h1>This is the app menu</h1>
                </div>
                <div className={"app-container"}>
                    <Router>
                        <Switch>
                            <Route path="/about">
                                <Home />
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                            <Route path="/">
                                <App />
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}

export interface ContextBuildingProps {
    success: () => void
}

export const Home: React.FC = () => {
    const history = useHistory();

    return (
        <h2 onClick={() => {
            history.push('/about');
            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                history.push('/users');
            })
        }}>Go to /about and then to /users</h2>
    );
}

export const Login: React.FC<ContextBuildingProps> = (props) => {
    const correctLogin: string = "123";
    const [val, setVal] = useState<string>("");
    const history = useHistory();
    return (
        <>
            <Input value={val} onChange={event => {
                setVal(() => event.currentTarget.value);
            }}/>
            <Button variant={"outlined"} onClick={() => {
                if (val === correctLogin) {
                    props.success();
                }
            }}>Login</Button>
        </>
    );
}

export const Dashboard: React.FC = () => {
    return (
        <>
            <Typography>Dashboard</Typography>
        </>
    );
}

function Users() {
    return <h2>Users</h2>;
}

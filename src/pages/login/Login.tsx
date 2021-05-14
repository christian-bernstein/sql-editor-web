import React, {FC, ReactElement, useState} from 'react';

import './Login.css';
import PropTypes from "prop-types";

type LoginProps = {
    setToken: React.Dispatch<React.SetStateAction<string>>; // todo check if working
}

export const Login: FC<LoginProps> = (props): ReactElement => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginApiEndpoint, setLoginApiEndpoint] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("calling login api on: " + loginApiEndpoint);
        const token = fetch(loginApiEndpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username, password
            })
        }).then(data => data.json())
        console.log("got login token from api: " + token);
        props.setToken(await token);
    };

    return (
        <div className={"login-wrapper"}>
            <h1>Please Log In to endpoint</h1>
            <form>
                <label>
                    <p>API Endpoint</p>
                    <input type="text" onChange={event => setLoginApiEndpoint(event.currentTarget.value)}/>
                </label>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={event => setUsername(event.currentTarget.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={event => setPassword(event.currentTarget.value)}/>
                </label>
                <div>
                    <button type="submit" onSubmit={(event: React.FormEvent<HTMLButtonElement>) => handleSubmit(event)}>Submit</button>
                </div>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

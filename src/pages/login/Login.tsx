import React, {FC, ReactElement, useState} from 'react';
import {Button, Form, FormControl, InputGroup} from 'react-bootstrap/';
import PropTypes from "prop-types";
import FloatingLabel from "react-bootstrap-floating-label";

import './Login.scss';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import hero from '../../assets/hero.png';


type LoginProps = {
    setToken: React.Dispatch<React.SetStateAction<string>>; // todo check if working
}

export const Login: FC<LoginProps> = (props): ReactElement => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginApiEndpoint, setLoginApiEndpoint] = useState("http://localhost");
    const [loginApiPort, setLoginApiPort] = useState(8000);

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
        <div className={"body"}>
            <main className={"login-wrapper"}>
                {/* Visual part of the component to introduce brand identity */}
                <div className={"introduction"}>
                    <div className={"brand-identifier"}>
                        <Logo className={"brand-logo"}/>
                        <a className={"navbar-brand"} href={"#"}>SQL Editor</a>
                    </div>

                    <div className={"brand-background"}>
                        <img src={hero} alt={"Brand background"}/>
                        <div className="image-reference">
                            <h6 className="">Christian Bernstein</h6>
                            {/* todo set github link */}
                            <a href="#" className="fw-bold text-decoration-none">GitHub</a>
                        </div>
                    </div>
                </div>

                {/* Actual part of form */}
                <div className={"form-container"}>
                    <div className="form-descriptor">
                        <h4 className="fw-bold">Login</h4>
                        <p>Login to a SQL-Editor server using your login credentials. </p>
                    </div>

                    {/* Login form */}
                    <Form className="row">
                        {/* API Endpoint specification */}
                        <h6 className="text-muted my-2 col-md-12">SQL-Editor Server</h6>

                        <FloatingLabel className={"float-input col-md-9"} labelId={"label1"} label="API endpoint"
                                       type={"url"} initialValue={"http://localhost"}
                                       onChange={event => setLoginApiEndpoint(event.currentTarget.value)}/>

                        <FloatingLabel className={"float-input col-md-3"} labelId={"label2"} label="Port"
                                       type={"number"} initialValue={"8000"}
                                       onChange={event => setLoginApiPort(+event.currentTarget.value)}/>

                        {/*
                        <div className="col-md-9">
                            <div className="form-floating">
                                <input type="url" className="form-control" id="api" placeholder="localhost" value="localhost"
                                       onChange={event => setLoginApiEndpoint(event.currentTarget.value)}/>
                                <label htmlFor="api">API endpoint</label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-floating">
                                <input type="number" className="form-control" id="port" placeholder="8000" value="8000"/>
                                <label htmlFor="port">Port</label>
                            </div>
                        </div>
                        */}

                        {/* User login credentials */}
                        <h6 className="text-muted my-2 col-md-12">Login Credentials</h6>

                        <FloatingLabel className={"float-input col-md-6"} labelId={"label3"} label="Username"
                                       type={"text"} initialValue={""}
                                       onChange={event => setUsername(event.currentTarget.value)}/>

                        <FloatingLabel className={"float-input col-md-6"} labelId={"label4"} label="Password"
                                       type={"password"} initialValue={""}
                                       onChange={event => setPassword(event.currentTarget.value)}/>

                        {/*
                        <div className="col-md">
                            <div className="form-floating">
                                <input type="text" className="form-control" id="API endpoint" placeholder="." value=""
                                       onChange={event => setUsername(event.currentTarget.value)}/>
                                <label htmlFor="floatingInputValue">Username</label>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <input type="password" className="form-control" id="password" placeholder="." value=""
                                       onChange={event => setPassword(event.currentTarget.value)}/>
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        */}

                        {/* Login button */}
                        <div className="col-12 mt-2 login-btn-group">
                            <Button type="submit" id="login-btn"
                                    onSubmit={(event: React.FormEvent<HTMLButtonElement>) => handleSubmit(event)}>Login</Button>
                        </div>
                    </Form>

                    <footer className={"form-hints"}>
                        <a href="#" className="text-decoration-none">Need Help?</a>
                        <h6 className="text-muted">SQL-Editor, 2021</h6>
                    </footer>
                </div>

                {/*
                <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                <Form.Control
                    type="password"
                    id="inputPassword5"
                    aria-describedby="passwordHelpBlock"
                />


                    <Form.Text id="passwordHelpBlock" muted>
                        Your password must be 8-20 characters long, contain letters and numbers, and
                        must not contain spaces, special characters, or emoji.
                    </Form.Text>
                */}

            </main>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

import React, {useState} from 'react';
import './App.scss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {Login} from './pages/login/Login';

import {Dashboard} from './pages/dashboard/Dashboard';

function App() {
    const [token, setToken] = useState("");

    if (!token) {
        return <Login setToken={setToken}/>
    }

    return (
        <div className={"wrapper"}>
            <h1>Application</h1>
            <BrowserRouter>
              <Switch>
                  <Route path="/dashboard">
                      <Dashboard />
                  </Route>
              </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

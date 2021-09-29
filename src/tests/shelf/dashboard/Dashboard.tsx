import React, {Component} from 'react';

type DashboardProps = {
    message: String;
}

export class Dashboard extends Component<DashboardProps> {
    static defaultProps = {
        message: 'Hello from the Dashboard!'
    }

    render() {
        return <p>{this.props.message}</p>
    }
}

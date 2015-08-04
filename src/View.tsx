/// <reference path="../reference/react/react.d.ts" />

import * as React from 'react';

// http://blog.mgechev.com/2015/07/05/using-jsx-react-with-typescript/
// https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html
// http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
// http://www.productiverage.com/writing-react-components-in-typescript

export class ViewProps {
    public name: string;
    public age: number;
}

export class ViewState {
    public age: number;
}

export default class View extends React.Component<ViewProps, ViewState> {
    constructor(props: ViewProps) {
        super(props);

        this.state = {
            age: props.age
        };
    }

    // this is bound to the correct instance
    handleAgeChange = (e: any) => {
        this.setState({
            age: Number.parseInt(e.target.value, 10) || 0
        });
    }

    // requires binding
    handleClick() {
        this.setState({
            age: this.state.age + 1
        });
    }

    render() {
        return (
            <div>
                <p>Hello {this.props.name}, ({this.state.age})!</p>
                <input type="text" value={this.state.age.toString()} onChange={this.handleAgeChange}/>
                <button onClick={this.handleClick.bind(this)}>Test</button>
            </div>
        );
    }
}
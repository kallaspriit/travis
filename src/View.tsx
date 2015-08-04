/// <reference path="../reference/react/react.d.ts" />

import * as React from 'react';

/*export default class Test {

}*/

export class DemoProps {
    public name: string;
    public age: number;
}

export default class View extends React.Component<DemoProps, any> {
    private foo: number;

    constructor(props: DemoProps) {
        super(props);

        this.foo = 42;
    }

    render() {
        return (
            <div>Hello {this.props.name}!</div>
        );
    }
}
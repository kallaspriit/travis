import * as React from 'react';

import Square from 'Square';
import View from 'View';

let square = new Square(5);

console.log('square area', square.size, square.getArea());

React.render(
    React.createElement(View, {name: 'Priit', age: 23}),
    document.getElementById('app')
);
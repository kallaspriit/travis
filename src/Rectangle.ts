import Shape from 'Shape';

export default class Rectangle implements Shape {
    protected width : number;
    protected height : number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}
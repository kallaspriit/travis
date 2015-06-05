interface Shape {
    getArea() : number;
}

class Rectangle implements Shape {
    private width : number;
    private height : number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}
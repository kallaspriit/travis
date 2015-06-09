import Rectangle from 'Rectangle';

export default class Square extends Rectangle {

    constructor(size: number) {
        super(size, size);
    }

    get size() {
        return this.width;
    }

}
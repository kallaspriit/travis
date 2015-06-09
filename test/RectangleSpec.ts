/// <reference path="../reference/jasmine/jasmine.d.ts" />

import Rectangle from '../src/Rectangle';

describe('Rectangle', function () {

    it('should calculate rectangle area', function () {
        var rectangle = new Rectangle(4, 5),
            area = rectangle.getArea();

        expect(area).toEqual(20);
    });

});
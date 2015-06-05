/// <reference path="../reference/jasmine/jasmine.d.ts" />

describe('Geometry', function () {

    it('should calculate rectangle area', function () {
        var rectangle = new Rectangle(3, 5),
            area = rectangle.getArea();

        expect(area).toEqual(15);
    });

});
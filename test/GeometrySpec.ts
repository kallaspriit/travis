/// <reference path="../reference/jasmine/jasmine.d.ts" />
/// <reference path="../src/Geometry.ts" />

describe('Geometry', function () {

    it('should calculate rectangle area', function () {
        var rectangle = new Rectangle(4, 5),
            area = rectangle.getArea();

        expect(area).toEqual(15);
    });

});
/// <reference path="../reference/jasmine/jasmine.d.ts" />

describe('Calculator', function() {

	it('should sum given values', function() {
		var result = sum(2, 5);

		expect(result).toEqual(7);
	});

	it('should sum negative numbers', function() {
		var result = sum(-2, -5);

		expect(result).toEqual(-7);
	});

});
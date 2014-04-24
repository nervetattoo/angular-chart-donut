describe('chart.donut', function() {
    var mod;
    beforeEach(function() {
        mod = angular.module('chart.donut');
    });

    it('exists', function() {
        expect(mod).not.toBe(null);
    });

    describe('<chart-donut>', function() {
        var el, scope;

        beforeEach(module('chart.donut'));

        var html = '<div chart-donut data="percentage" size=150 title="Test"></div>';
        beforeEach(inject(function($rootScope, $compile) {
            el = angular.element(html);
            scope = $rootScope;
            $compile(el)(scope);
            scope.percentage = 10;
            scope.$digest();
            scope.$apply();
        }));

        it('should render an svg el', function() {
            var shouldHaveOneOf = {
                'path': 2,
                'circle': 3 // bg, drop-pin, inner
            };
            var svg = angular.element(el.find('svg'));

            expect(svg.css('height')).toBe('150px');
            expect(svg.css('width')).toBe('92px');

            var key;
            for (selector in shouldHaveOneOf) {
                expect(svg.find(selector).length).toBe(shouldHaveOneOf[selector]);
            }
        });
    });
});

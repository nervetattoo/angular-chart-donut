describe('ng.donut-chart', function() {
    var mod;
    beforeEach(function() {
        mod = angular.module('ng.donut-chart');
    });

    it('exists', function() {
        expect(mod).not.toBe(null);
    });

    describe('<donut-chart>', function() {
        var el, scope;

        beforeEach(module('ng.donut-chart'));

        var html = '<div donut-chart data="percentage" size=150 title="Test"></div>';
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

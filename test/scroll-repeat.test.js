describe('Scroll Repeat Directive', function() {

    var element, scope, $compile, mockWindowService,
        windowHeight = 60, scrollTop = 0;

    // Mock the window service which is responsible for firing events and getting
    // window dimensions
    beforeEach(function() {
        angular.mock.module('ks.ngScrollRepeat', function($provide) {
            mockWindowService = {
                height: function() {return windowHeight},
                scrollTop: function() {return scrollTop},
                registerForScroll: function() {},
                deregisterForScroll: function() {},
                WINDOW_SCROLL: 'WINDOW_SCROLL'
            };
            $provide.value('WindowService', mockWindowService);
        });
    });

    // Get scope and $compile from the angular injector
    beforeEach(inject(['$rootScope', '$compile', function(rootScope, compile) {
        scope = rootScope.$new();
        $compile = compile;
    }]));

    // destroy elements
    afterEach(function() {
        if (element !== undefined) {
            $(element).remove();
            scope.$destroy();
        }
    });

    function initItems(theScope, numItems) {
        theScope.items = [];
        for (var i = 0; i<numItems; i++) {
            theScope.items.push({id: 1, description: 'Item ' + i});
        }
    }

    function fireScrollEvent() {
        scope.$broadcast(mockWindowService.WINDOW_SCROLL);
        scope.$digest();
    }

    function compileDirective(itemSize, pageSize, tolerance) {
        var elementHtml = '<div><div ng-scroll-repeat="item in items" page-size="'+ pageSize +'"' +
            'tolerance="' + tolerance + '" class="item">' +
            '<div class="id">{{item.id}}</div>' +
            '<div class="desc">{{item.description}}</div>' +
            '</div></div>';

        initItems(scope, itemSize);
        element = angular.element(elementHtml);
        $(document.body).append(element);
        element = $compile(element)(scope);
        scope.$digest();
    }

    function mockScrollTop(theScrollTop) {
        scrollTop = theScrollTop;
    }

    function mockWindowHeight(theHeight) {
        windowHeight = theHeight;
    }

    function mockWindowHeightAndScroll(theHeight, theScrollTop) {
        mockWindowHeight(theHeight);
        mockScrollTop(theScrollTop);
    }

    function scrollToElement(element) {
        var rowHeight = element.height();
        var lastRowTop = element.offset().top;
        mockScrollTop(lastRowTop + rowHeight - windowHeight);
    }

    it('paginates accordingly on the first load', function() {
        compileDirective(10, 1, 0);
        expect(element.find('.item').length).toBe(1);
    });

    it('loads new data on scroll', function() {
        mockWindowHeightAndScroll(20, 0);
        compileDirective(10, 1, 0);
        expect(element.find('.item').length).toBe(1);

        scrollToElement(element.find('.item:last'));
        fireScrollEvent();
        expect(element.find('.item').length).toBe(2);
    });

    it('fires bottom-reached-before event before it loads new page', function() {
        mockWindowHeightAndScroll(20, 0);
        compileDirective(10, 1, 0);
        expect(element.find('.item').length).toBe(1);
        scrollToElement(element.find('.item:last'));

        spyOn(scope, '$broadcast').and.callThrough();
        fireScrollEvent();
        expect(scope.$broadcast).toHaveBeenCalledWith('bottom-reached-before');
        expect(scope.$broadcast).toHaveBeenCalledWith('bottom-reached-after');
    });

    it('does not show new data when data bottom is below tolerance area', function() {
        mockWindowHeightAndScroll(10, 0);
        compileDirective(100, 10, 0);

        fireScrollEvent();
        expect(element.find('.item').length).toBe(10);
    });

    it('keeps loading new data as the user scrolls', function() {
        mockWindowHeightAndScroll(10, 0);
        compileDirective(100, 10, 0);

        scrollToElement(element.find('.item:last'));
        fireScrollEvent();

        expect(element.find('.item').length).toBe(20);

        scrollToElement(element.find('.item:last'));
        fireScrollEvent();
        expect(element.find('.item').length).toBe(30);
    });

    it('does not allow startsFrom in the filters list', function() {
        var elementHtml = '<div><div ng-scroll-repeat="item in items | startFrom: 1"</div>{{item.id}}</div>';
        expect(function() {
            $compile(elementHtml)(scope);
        }).toThrow();
    });

    it('does not allow limitTo in the filters list', function() {
        var elementHtml = '<div><div ng-scroll-repeat="item in items | limitTo: 1"</div>{{item.id}}</div>';
        expect(function() {
            $compile(elementHtml)(scope);
        }).toThrow();
    });

    it('resets the number of pages loaded when the collection changes', function() {
        mockWindowHeightAndScroll(10, 0);
        compileDirective(100, 10, 0);
        scrollToElement(element.find('.item:last'));
        fireScrollEvent();

        expect(element.find('.item').length).toBe(20);

        initItems(scope, 50);
        scope.$digest();

        expect(element.find('.item').length).toBe(10);
    });

    it('deregisters when destroyed', function() {
        mockWindowHeightAndScroll(20, 0);
        compileDirective(10, 1, 0);
        expect(element.find('.item').length).toBe(1);

        spyOn(mockWindowService, 'deregisterForScroll');
        scope.$destroy();
        expect(mockWindowService.deregisterForScroll).toHaveBeenCalledWith(scope);
    });
});

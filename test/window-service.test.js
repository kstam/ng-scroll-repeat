describe('Window Service', function() {
    var scope1, scope2,
        scope1Listener = {listener: function() {}},
        scope2Listener = {listener: function() {}},
        windowService;

    beforeEach(module('ks.WindowService'));

    // Get scope and register event listeners
    beforeEach(inject(['$rootScope', 'WindowService', function(rootScope, theWindowService) {
        scope1 = rootScope.$new();
        scope2 = rootScope.$new();

        windowService = theWindowService;
        scope1.$on(windowService.WINDOW_SCROLL, function() {
            scope1Listener.listener();
        });
        scope2.$on(windowService.WINDOW_SCROLL, function() {
            scope2Listener.listener();
        });
    }]));

    afterEach(function() {
        scope1.$destroy();
        scope2.$destroy();
    });

    it('is defined correctly as a module', function() {
        expect(windowService).not.toBeUndefined();
    });

    it('doesnt allow registering a non scope object', function() {
        expect(function() {
            windowService.registerForScroll({});
        }).toThrow();
    });

    it('fires WINDOW_SCROLL event on all the registered scopes on scroll', function() {
        spyOn(scope1Listener, 'listener');
        spyOn(scope2Listener, 'listener');
        windowService.registerForScroll(scope1);
        windowService.registerForScroll(scope2);

        $(window).trigger('scroll');
        expect(scope1Listener.listener).toHaveBeenCalled();
        expect(scope2Listener.listener).toHaveBeenCalled();
    });

    it('does not fire WINDOW_SCROLL event on unregistered scopes on scroll', function() {
        spyOn(scope1Listener, 'listener');
        spyOn(scope2Listener, 'listener');
        windowService.registerForScroll(scope1);
        windowService.registerForScroll(scope2);
        windowService.deregisterForScroll(scope1);

        $(window).trigger('scroll');
        expect(scope1Listener.listener).not.toHaveBeenCalled();
        expect(scope2Listener.listener).toHaveBeenCalled();
    });

    it('fires WINDOW_SCROLL event on the scope on window scroll', function() {
        spyOn(scope1Listener, 'listener');
        spyOn(scope2Listener, 'listener');
        windowService.registerForScroll(scope1);

        $(window).trigger('scroll');
        expect(scope1Listener.listener).toHaveBeenCalled();
        expect(scope2Listener.listener).not.toHaveBeenCalled();
    });

});

angular.module('ks.WindowService', [])
    .factory('WindowService', ['$window', function ($window) {
        var windowElement = angular.element($window);
        var WINDOW_SCROLL = 'WINDOW_SCROLL';
        var listeners = [];

        windowElement.on('scroll', function () {
            var scope;
            for (var index in listeners) {
                scope = listeners[index];
                scope.$broadcast(WINDOW_SCROLL);
            }
        });

        return {
            WINDOW_SCROLL: WINDOW_SCROLL,
            height: function () {
                return windowElement.height();
            },
            scrollTop: function () {
                return windowElement.scrollTop();
            },
            registerForScroll: function ($scope) {
                if ($scope && angular.isFunction($scope.$broadcast)) {
                    listeners.push($scope);
                } else {
                    throw new Error('Cannot register a non-scope object for scroll');
                }
            },
            deregisterForScroll: function ($scope) {
                listeners.splice(listeners.indexOf($scope), 1);
            }
        };
    }]);

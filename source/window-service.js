angular.module('ks.WindowService', [])
    .factory('WindowService', ['$window', function ($window) {
        var windowElement = angular.element($window);
        var WINDOW_SCROLL = 'WINDOW_SCROLL';

        var safeApply = function(scope, fn) {
            if (scope.$$phase || scope.$root.$$phase) {
                fn();
            } else {
                scope.$apply(fn);
            }
        };

        return {
            WINDOW_SCROLL: WINDOW_SCROLL,
            height: function() {
                return windowElement.height();
            },
            scrollTop: function() {
                return windowElement.scrollTop();
            },
            registerForScroll: function($scope) {
                windowElement.on('scroll', function() {
                    safeApply($scope, function() {
                        $scope.$broadcast(WINDOW_SCROLL);
                    });
                });
            }
        }
    }]);

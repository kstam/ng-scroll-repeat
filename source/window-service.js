angular.module('ks.WindowService', [])
    .factory('WindowService', ['$window', function ($window) {
        var windowElement = angular.element($window);
        var WINDOW_SCROLL = 'WINDOW_SCROLL';

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
                    $scope.$broadcast(WINDOW_SCROLL);
                });
            }
        }
    }]);

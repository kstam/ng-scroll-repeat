angular.module('ks.scrollRepeat', ['ks-window-service'])
    .directive('scrollRepeat', ['$compile', 'WindowService', function ($compile, windowService) {
        'use strict';

        var DEFAULT_PAGE_SIZE = 50;
        var DEFAULT_TOLERANCE = 200;

        var verifyRepeatExpression = function (repeatExpression) {
            if (repeatExpression.match(/limitTo/) || repeatExpression.match(/startFrom/)) {
                throw new Error('"limitTo" and "startFrom" filters are not allowed in scroll-repeat directive');
            }
        };

        var calculateScrollBottomDiff = function (element) {
            var browserBottom = windowService.height();
            var elementBottom = element.offset().top - windowService.scrollTop() + element.height();
            return elementBottom - browserBottom;
        };

        var compile = function (tElement, tAttributes) {
            var repeatExpression = tAttributes.scrollRepeat;
            var match = repeatExpression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
            var collectionString = match[2];
            var pageSize = (tAttributes.pageSize) ? Number(tAttributes.pageSize) : DEFAULT_PAGE_SIZE;
            var tolerance = (tAttributes.tolerance) ? Number(tAttributes.tolerance) : DEFAULT_TOLERANCE;

            verifyRepeatExpression(repeatExpression);
            tElement.removeAttr('scroll-repeat');
            tElement.attr('ng-repeat', tAttributes.scrollRepeat + " | limitTo:visibleResults");

            return function link($scope, $element) {
                var totalLength;

                $scope.visibleResults = pageSize;
                $compile($element)($scope);

                $scope.$watch(collectionString, function (collection) {
                    totalLength = collection.length;
                }, true);

                var elementParent = $($element[0]).parent();

                windowService.registerForScroll($scope);

                $scope.$on(windowService.WINDOW_SCROLL, function () {
                    var diff = calculateScrollBottomDiff(elementParent);
                    if (diff <= tolerance && totalLength > $scope.visibleResults) {
                        $scope.visibleResults += pageSize;
                    }
                });
            };
        };
        return {
            replace: false,
            terminal: true,
            priority: 2000,
            restrict: 'A',
            compile: compile
        };
    }]);
angular.module('ks-window-service', [])
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


/*
Angular Scroll Repeat v0.0.4 by @kstam
Copyright (c) 2014

Full source at https://github.com/kstam/ng-scroll-repeat

MIT License, https://github.com/kstam/ng-scroll-repeat/blob/master/LICENSE
*/
angular.module('ks.ngScrollRepeat', ['ks.WindowService'])
    .directive('ngScrollRepeat', ['$compile', 'WindowService', function ($compile, windowService) {
        'use strict';

        var DEFAULT_PAGE_SIZE = 50;
        var DEFAULT_TOLERANCE = 200;
        var BOTTOM_REACHED_BEFORE_EVT = 'bottom-reached-before';
        var BOTTOM_REACHED_AFTER_EVT = 'bottom-reached-after';

        var safeApply = function(scope, fn) {
            if (scope.$$phase || scope.$root.$$phase) {
                fn();
            } else {
                scope.$apply(fn);
            }
        };

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
            var repeatExpression = tAttributes.ngScrollRepeat;
            var match = repeatExpression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
            var collectionString = match[2];
            var pageSize = (tAttributes.pageSize) ? Number(tAttributes.pageSize) : DEFAULT_PAGE_SIZE;
            var tolerance = (tAttributes.tolerance) ? Number(tAttributes.tolerance) : DEFAULT_TOLERANCE;

            verifyRepeatExpression(repeatExpression);
            tElement.removeAttr('ng-scroll-repeat');
            tElement.attr('ng-repeat', repeatExpression + " | limitTo:visibleResults");

            return function link($scope, $element) {
                var elementParent = $($element[0]).parent();
                var totalLength;

                $scope.visibleResults = pageSize;
                $compile($element)($scope);

                $scope.$watch(collectionString, function (collection) {
                    totalLength = collection.length;
                    $scope.visibleResults = pageSize;
                }, true);

                $scope.$on(windowService.WINDOW_SCROLL, function () {
                    var diff = calculateScrollBottomDiff(elementParent);
                    if (diff <= tolerance && totalLength > $scope.visibleResults) {
                        $scope.$broadcast(BOTTOM_REACHED_BEFORE_EVT);
                        safeApply($scope, function() {
                            $scope.visibleResults += pageSize;
                        });
                        $scope.$broadcast(BOTTOM_REACHED_AFTER_EVT);
                    }
                });

                windowService.registerForScroll($scope);

                $scope.$on('$destroy', function() {
                    windowService.deregisterForScroll($scope);
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

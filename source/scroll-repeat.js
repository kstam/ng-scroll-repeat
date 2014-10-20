angular.module('ks.scrollRepeat', [])
    .directive('scrollRepeat', function ($compile) {
        'use strict';

        var DEFAULT_INIT_SIZE = 50;
        var DEFAULT_STEP = 50;
        var DEFAULT_TOLERANCE = 200;

        var verifyRepeatExpression = function (repeatExpression) {
            if (repeatExpression.match(/limitTo/) || repeatExpression.match(/startFrom/)) {
                throw new Error('"limitTo" and "startFrom" filters are not allowed in scroll-repeat directive');
            }
        };

        var calculateScrollBottomDiff = function (element) {
            var browserBottom = $(window).height();
            var elementBottom = element.offset().top - $(window).scrollTop() + element.height();
            return elementBottom - browserBottom;
        };

        var compile = function (tElement, tAttributes) {
            var repeatExpression = tAttributes.scrollRepeat;
            var match = repeatExpression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
            var collectionString = match[2];
            var initSize = (tAttributes.initSize) ? Number(tAttributes.initSize) : DEFAULT_INIT_SIZE;
            var step = (tAttributes.step) ? Number(tAttributes.step) : DEFAULT_STEP;
            var tolerance = (tAttributes.tolerance) ? Number(tAttributes.tolerance) : DEFAULT_TOLERANCE;

            verifyRepeatExpression(repeatExpression);
            tElement.removeAttr('scroll-repeat');
            tElement.attr('ng-repeat', tAttributes.scrollRepeat + " | limitTo:visibleResults");

            return function link($scope, $element) {
                var totalLength;

                $scope.visibleResults = initSize;
                $compile($element)($scope);

                $scope.$watch(collectionString, function (collection) {
                    totalLength = collection.length;
                }, true);

                var elementParent = $($element[0]).parent();

                $(window).on('scroll', function () {
                    var diff = calculateScrollBottomDiff(elementParent);
                    if (diff <= tolerance && totalLength > $scope.visibleResults) {
                        safeApply($scope, function () {
                            $scope.visibleResults += step;
                        });
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
    });
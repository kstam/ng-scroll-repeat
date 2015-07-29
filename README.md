Angular Scroll Repeat
=====

An angular directive that uses the ng-repeat augmented with infinite scrolling functionality.

Install
---

Download from here:

- [Development](dist/ng-scroll-repeat.js)
- [Minimized](dist/ng-scroll-repeat.min.js)

Or using bower run

    bower install ng-scroll-repeat


Example
---

Check a live example <a href="https://rawgit.com/kstam/ng-scroll-repeat/master/example/index.html" target="_blank">here</a>

The code of the example can be found [here](./example/index.html)

Use
---

HTML - include ng-scroll-repeat.js

    <script src="path-to/ng-scroll-repeat.js"></script>
    
JS - inject ng-scroll-repeat

    angular.module('myApp',['ks.ngScrollRepeat']);

HTML

    <div ng-scroll-repeat="item in items" page-size="10" tolerance="200">
        <div>{{item.id}}</div>
        <div>{{item.description}}</div>
    </div>

OPTION - setup a callback function that will be triggered by the "bottom-reached" event.
This event is broadcast each time the bottom of the page is reached.
	
	    //before showing the new page data
		$scope.$on('bottom-reached-before', function() {
			// do whatever you want
		});

        //after showing the new page data
        $scope.$on('bottom-reached-after', function() {
            // do whatever you want
        });

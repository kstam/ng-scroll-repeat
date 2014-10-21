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

Use
---

HTML

    <div scroll-repeat="item in items" page-size="10" tolerance="200">
        <div>{{item.id}}</div>
        <div>{{item.description}}</div>
    </div>

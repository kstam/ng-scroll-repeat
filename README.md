KS Scroll Repeat
=====

An angular directive that uses the ng-repeat augmented with infinite scrolling functionality.

How to use
---

HTML

    <div scroll-repeat="item in items" page-size="10" tolerance="200">
        <div>{{item.id}}</div>
        <div>{{item.description}}</div>
    </div>

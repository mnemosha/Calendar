/* global app */

/*
* Adds drag events to the panel:
* 1. onDragStart - when mousedowned on element
* 2. onDragEnd - when mouse released
* 3. onDragCancel - when mouse left dragPanel element
* 4. onDrag - when mouse dragged
* */
app.directive('dragPanel', function() { 'use strict';
    function link(scope, element) {
        var dragStartCoord = 0,
            isDragging = false;

        element.on('mouseup', function(event) {
            if (event.button === 0 && isDragging) {
                event.relativeY = getRelativeYCoord(event);
                scope.onDragEnd({event: event});
                isDragging = false;
                scope.$apply();
            }
        });
        element.on('mouseleave', function() {
            if (isDragging) {
                scope.onDragCancel({event: event});
                isDragging = false;
                scope.$apply();
            }
        });
        element.on('mousedown', function(event) {
            if (event.button === 0) {
                event.relativeY = getRelativeYCoord(event);
                dragStartCoord = event.relativeY;
                scope.onDragStart({event: event});
                isDragging = true;
                scope.$apply();
            }
        });
        element.on('mousemove', function(event) {
            if (isDragging) {
                event.relativeY = getRelativeYCoord(event);
                event.dragStartCoord = dragStartCoord;
                scope.onDrag({event: event});
                scope.$apply();
            }
        });

        function getRelativeYCoord(event) {
            return event.pageY - element[0].getBoundingClientRect().top;
        }
    }

    return {
        scope: {
            onDrag: '&',
            onDragStart: '&',
            onDragEnd: '&',
            onDragCancel: '&'
        },
        link: function(scope, element, attrs) {
            element = $(element[0]); // convert angular.element to jQuery object. It's required for testing directive.
            link(scope, element, attrs);
        }
    };
});
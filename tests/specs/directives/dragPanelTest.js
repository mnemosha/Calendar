/* global describe, it, spyOn, beforeEach, expect, inject, jQuery, $ */

describe('dragPanel', function() { 'use strict';
    beforeEach(inject(function($compile) {
        this.element = $('<drag-panel on-drag-start="onDragStart()" ' +
                                     'on-drag="onDrag()" ' +
                                     'on-drag-cancel="onDragCancel()" ' +
                                     'on-drag-end="onDragEnd()"> ' +
                          '</drag-panel>');
        this.mousedownEvent = jQuery.Event('mousedown'); 
        this.mousedownEvent.button = 0;
        $compile(this.element)(this.scope);
    }));

    it('should call on-drag-start listener on mousedown', function() {
        this.scope.onDragStart = function() {};
        spyOn(this.scope, 'onDragStart');
        this.element.trigger(this.mousedownEvent);
        expect(this.scope.onDragStart).toHaveBeenCalled();
    });

    it('should not call on-drag-start listener if was clicked the right mouse button', function() {
        this.scope.onDragStart = function() {};
        spyOn(this.scope, 'onDragStart');
        this.mousedownEvent.button = 1;
        this.element.trigger(this.mousedownEvent);
        expect(this.scope.onDragStart).not.toHaveBeenCalled();
    });

    it('should call on-drag listener on mousemove if dragging', function() {
        var mousemoveEvent = jQuery.Event('mousemove');
        this.scope.onDrag = function() {};
        this.element.trigger(this.mousedownEvent);
        spyOn(this.scope, 'onDrag');
        this.element.trigger(mousemoveEvent);
        expect(this.scope.onDrag).toHaveBeenCalled();
    });

    it('should not call on-drag listener on mousemove if not dragging', function() {
        var mousemoveEvent = jQuery.Event('mousemove');
        this.scope.onDrag = function() {};
        spyOn(this.scope, 'onDrag');
        this.element.trigger(mousemoveEvent);
        expect(this.scope.onDrag).not.toHaveBeenCalled();
    });

    it('should call on-drag-cancel listener on mouseleave if before was called mousedown', function() {
        var mouseleaveEvent = jQuery.Event('mouseleave');
        this.scope.onDragCancel = function() {};
        spyOn(this.scope, 'onDragCancel');
        this.element.trigger(this.mousedownEvent);
        this.element.trigger(mouseleaveEvent);
        expect(this.scope.onDragCancel).toHaveBeenCalled();
    });

    it('should not call on-drag-cancel listener on mouseleave if not dragging', function() {
        var mouseleaveEvent = jQuery.Event('mouseleave');
        this.scope.onDragCancel = function() {};
        spyOn(this.scope, 'onDragCancel');
        this.element.trigger(mouseleaveEvent);
        expect(this.scope.onDragCancel).not.toHaveBeenCalled();
    });

    it('should call on-drag-end listener on mouseup if dragging', function() {
        var mouseup = jQuery.Event('mouseup');
        mouseup.button = 0;
        this.scope.onDragEnd = function() {};
        spyOn(this.scope, 'onDragEnd');
        this.element.trigger(this.mousedownEvent);
        this.element.trigger(mouseup);
        expect(this.scope.onDragEnd).toHaveBeenCalled();
    });

    it('should not call on-drag-end listener on mouseup if not dragging', function() {
        var mouseup = jQuery.Event('mouseup');
        mouseup.button = 0;
        this.scope.onDragEnd = function() {};
        spyOn(this.scope, 'onDragEnd');
        this.element.trigger(mouseup);
        expect(this.scope.onDragEnd).not.toHaveBeenCalled();
    });
});


/* global module, beforeEach, inject */

beforeEach(module('app'));
beforeEach(inject(function($rootScope) { 'use strict';
    this.scope = $rootScope.$new();
}));
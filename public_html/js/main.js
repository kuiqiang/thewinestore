'use strict';

(function () {
  var wineStoreApp = angular.module('wineStoreApp', []);

  wineStoreApp.controller('SearchFormController', function () {
    this.formIsShown = false;

    this.toggleForm = function () {
      this.formIsShown = !this.formIsShown;
    };

    this.templates = [{name: 'searchForm', url: 'templates/search-form.html'}];
  });
})();

'use strict';

(function () {
  var wineStoreApp = angular.module('wineStoreApp', ['ui.bootstrap']);

  wineStoreApp.controller('AppController', function ($scope) {
    $scope.searchFormIsShown = false;

    $scope.toggleSearchForm = function () {
      $scope.searchFormIsShown = !$scope.searchFormIsShown;
      if ($scope.searchFormIsShown) {
        $("#search-form").slideDown('600');
      }
      else {
        $("#search-form").slideUp('600');
      }
    };

    $scope.templates = {};

    $scope.search = {
      wineName: "",
      region: "",
      wineryName: "",
      minYears: "",
      maxYears: "",
      minCost: "",
      maxCost: "",
      minInStock: "",
      minPurchases: ""
    };

    $scope.save = function () {
      $scope.$broadcast('show-errors-check-validity');

      if ($scope.userForm.$valid) {
        //Do Something
      }
    };
  });

  wineStoreApp.directive('showErrors', function ($timeout, showErrorsConfig) {
    var getShowSuccess, linkFn;

    getShowSuccess = function (options) {
      var showSuccess;
      showSuccess = showErrorsConfig.showSuccess;
      if (options && options.showSuccess !== null) {
        showSuccess = options.showSuccess;
      }
      return showSuccess;
    };

    linkFn = function (scope, el, attrs, formCtrl) {
      var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses;
      blurred = false;
      options = scope.$eval(attrs.showErrors);
      showSuccess = getShowSuccess(options);
      inputEl = el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = inputNgEl.attr('name');
      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute';
      }
      inputNgEl.bind('blur', function () {
        blurred = true;
        return toggleClasses(formCtrl[inputName].$invalid);
      });
      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        if (!blurred) {
          return;
        }
        return toggleClasses(invalid);
      });
      scope.$on('show-errors-check-validity', function () {
        return toggleClasses(formCtrl[inputName].$invalid);
      });
      return toggleClasses = function (invalid) {
        el.toggleClass('has-error', invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', !invalid && formCtrl[inputName].$viewValue.length > 0);
        }
      };
    };
    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem) {
        if (!elem.hasClass('form-group')) {
          throw 'show-errors element does not have the \'form-group\' class';
        }
        return linkFn;
      }
    };
  }
  );

  wineStoreApp.provider('showErrorsConfig', function () {
    var _showSuccess;
    _showSuccess = false;
    this.showSuccess = function (showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.$get = function () {
      return {showSuccess: _showSuccess};
    };
  });
})();

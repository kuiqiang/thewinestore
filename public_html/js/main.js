'use strict';

(function () {
  var wineStoreApp = angular.module('wineStoreApp', []);

  wineStoreApp.controller('AppController', function ($scope, $http, $filter) {
    /* Search form */
    $scope.searchFormIsShown = false;
    $scope.searchPerformed = false;
    $scope.regions;
    $scope.search = {
      wineName: "",
      regionName: "",
      wineryName: "",
      startingYear: "",
      endingYear: "",
      minCost: "",
      maxCost: "",
      minInStock: "",
      minPurchases: ""
    };

    $scope.toggleSearchForm = function () {
      $scope.searchFormIsShown = !$scope.searchFormIsShown;
      if ($scope.searchFormIsShown)
        $("#search-form").slideDown('600');
      else
        $("#search-form").slideUp('600');
    };

    $scope.getRegions = function () {
      $http.get('/assignment-1/public_html/php/getRegions.php').success(function (regions) {
        $scope.regions = regions;
      }).error(function (regions, status) {
        console.log(status);
      });
    };

    $scope.getRegions();

    /* Results */
    $scope.wines = {};
    $scope.matchCount = 0;

    $scope.getWines = function () {
      $http.get('/assignment-1/public_html/php/getWines.php', {params: $scope.search}).success(function (wines) {
        $scope.wines = wines;
        $scope.searchPerformed = true;
        if (typeof $scope.wines === "object")
          $scope.matchCount = Object.keys($scope.wines).length;
      }).error(function (wines, status) {
        console.log(status);
      });
    };

    /* Sorting */
    $scope.sortOptions = [
      {option: "wineName", name: "Wine name"},
      {option: "varieties", name: "Varieties"},
      {option: "year", name: "Year"},
      {option: "winery", name: "Winery"},
      {option: "region", name: "Region"},
      {option: "price", name: "Price"},
      {option: "inStock", name: "In stock"},
      {option: "numberOfPurchases", name: "No. of purchases"}
    ];
    $scope.currentSortOption = $scope.sortOptions[0];
  });

  wineStoreApp.controller('SearchFormController', function ($scope) {
    $scope.thisYear = new Date().getFullYear();
  });

  wineStoreApp.directive('myLesserThanOrEquals', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, c) {
        scope.$watch(attrs.ngModel, function () {
          var thatVal = parseInt(scope.searchForm[attrs.myLesserThanOrEquals].$viewValue),
                  thisVal = parseInt(c.$viewValue);

          if (isNaN(thisVal) || isNaN(thatVal))
            return;

          c.$setValidity('myLesserThanOrEquals', thisVal <= thatVal);
          scope.searchForm[attrs.myLesserThanOrEquals].$setValidity('myGreaterThanOrEquals', thisVal <= thatVal);
        });
      }
    };
  });

  wineStoreApp.directive('myGreaterThanOrEquals', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, c) {
        scope.$watch(attrs.ngModel, function () {
          var thatVal = parseInt(scope.searchForm[attrs.myGreaterThanOrEquals].$viewValue),
                  thisVal = parseInt(c.$viewValue);

          if (isNaN(thisVal) || isNaN(thatVal))
            return;

          c.$setValidity('myGreaterThanOrEquals', thisVal >= thatVal);
          scope.searchForm[attrs.myGreaterThanOrEquals].$setValidity('myLesserThanOrEquals', thisVal >= thatVal);
        });
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
    }
    ;
  });
})();

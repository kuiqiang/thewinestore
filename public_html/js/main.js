'use strict';

(function () {
  var wineStoreApp = angular.module('wineStoreApp', ['ngAnimate']);

  wineStoreApp.controller('AppController', function ($scope, $http, $timeout) {
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
    $scope.loading = false;

    $scope.getWines = function () {
      $scope.loading = true;
      $http.get('/assignment-1/public_html/php/getWines.php', {params: $scope.search}).success(function (wines) {
        wines.forEach(function (wine) {
          wine.price = parseFloat(wine.price);
        });
        $scope.wines = wines;
        $scope.searchPerformed = true;
        $scope.loading = false;
        if (typeof $scope.wines === "object")
          $scope.matchCount = Object.keys($scope.wines).length;
      }).error(function (wines, status) {
        console.log(status);
        $scope.loading = false;
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
      {option: "numberOfPurchases", name: "No. of purchases"},
      {option: "-wineName", name: "Wine name (desc)"},
      {option: "-varieties", name: "Varieties (desc)"},
      {option: "-year", name: "Year (desc)"},
      {option: "-winery", name: "Winery (desc)"},
      {option: "-region", name: "Region (desc)"},
      {option: "-price", name: "Price (desc)"},
      {option: "-inStock", name: "In stock (desc)"},
      {option: "-numberOfPurchases", name: "No. of purchases (desc)"}
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
})();

'use strict';

(function () {
  var wineStoreApp = angular.module('wineStoreApp', ['ngAnimate']);

  wineStoreApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

  wineStoreApp.controller('AppController', function ($scope, $http, $timeout) {
    /* Search form */
    $scope.searchFormIsShown = false;
    $scope.thisYear = new Date().getFullYear();
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
        $scope.search.regionName = $scope.regions[0].regionName;
      }).error(function (regions, status) {
        console.log(status);
      });
    };

    $scope.getRegions();

    $scope.loading = true;
    $timeout(function () {
      $scope.loading = false;
    }, 500);
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
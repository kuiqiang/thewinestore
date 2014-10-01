'use strict';

(function () {
  var wineStoreApp = angular.module('wineStoreApp', ['ngAnimate']);

  wineStoreApp.controller('AppController', function ($scope) {
    $scope.searchFormIsShown = false;

    $scope.toggleSearchForm = function () {
      $scope.searchFormIsShown = !$scope.searchFormIsShown;
      if($scope.searchFormIsShown) {
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
  });
})();

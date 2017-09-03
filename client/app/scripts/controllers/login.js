'use strict';

angular.module('openstudioAngularApp')
.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginForm = $localStorage.getObject('userinfo','{}');

    $scope.login = function() {
        if($scope.rememberMe) {
           $localStorage.storeObject('userinfo',$scope.loginForm);
         }

        AuthFactory.login($scope.loginForm);
        $scope.logindialog.close();

    };

    $scope.register = function () {
        //assumes user has come from login dialog
        //
        $scope.registerdialog = ngDialog.open({
          template: 'views/register.html',
          scope: $scope,
          className: 'ngdialog-theme-default',
          appendClassName: 'ngdialog-register',
          controller:"RegisterController" });
          console.log('register id: ' + $scope.registerdialog.id);
          //ngDialog.close($scope.logindialog.id);
    };
}]);

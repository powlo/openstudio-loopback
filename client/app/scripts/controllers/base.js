'use strict';

angular.module('openstudioAngularApp')
.controller('BaseCtrl', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', 'ezfb',
function ($scope, $state, $rootScope, ngDialog, AuthFactory, ezfb) {

    $scope.loggedIn = false;
    $scope.username = '';

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    $scope.openLogin = function () {
        $scope.logindialog = ngDialog.open({
          template: 'views/login.html',
          scope: $scope,
          className: 'ngdialog-theme-default',
          appendClassName: 'ngdialog-login',
          controller:"LoginController"
        });
    };

    $scope.fblogin = function(){
      ezfb.login(function (res) {
        if (res.authResponse) {
          console.log("Response: ");
          console.log(res);
        }
      }, {scope: 'email'});
    };

    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $scope.stateis = function(curstate) {
       return $state.is(curstate);
    };

}]);

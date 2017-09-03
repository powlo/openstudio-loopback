'use strict';

angular.module('openstudioAngularApp')
.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    //$scope.register={};
    $scope.registerData={};

    $scope.doRegister = function() {
        console.log(JSON.stringify('Valid? ' + $scope.regForm.$valid));
        AuthFactory.register($scope.registerData,
          function(response) {
            authFac.login({
              username: registerData.username,
              password: registerData.password
            });
            if (registerData.rememberMe) {
              $localStorage.storeObject('userinfo', {
                username: registerData.username,
                email: registerData.email,
                password: registerData.password
              });
            }
            $rootScope.$broadcast('registration:Successful');
          },
          function(response) {
            for (var m in response.data.error.details.messages) {
              $scope.regForm[m].$error.exists = true;
            }
          }
        );
        //ngDialog.close($scope.registerdialog.id);

    };
}]);

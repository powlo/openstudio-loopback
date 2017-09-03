'use strict';

angular.module('openstudioAngularApp')
  .controller('RegisterController', ['$scope', '$rootScope', '$state','$localStorage', 'AuthFactory',
    function($scope, $rootScope, $state, $localStorage, AuthFactory) {

      $scope.registerData = {};

      $scope.doRegister = function() {
        AuthFactory.register($scope.registerData,
          function() {
            AuthFactory.login({
              username: $scope.registerData.username,
              password: $scope.registerData.password
            });
            if ($scope.registerData.rememberMe) {
              $localStorage.storeObject('userinfo', {
                username: $scope.registerData.username,
                email: $scope.registerData.email,
                password: $scope.registerData.password
              });
            }
            //why broadcast on rootscope and not scope?
            $rootScope.$broadcast('registration:Successful');
            $state.go('app.map');
          },
          function(response) {
            const fields = Object.keys(response.data.error.details.codes);
            fields.forEach(function(field){
              $scope.regForm[field].$invalid = true;
              response.data.error.details.codes[field].forEach(function(code){
                $scope.regForm[field].$error[code] = true;
              });
            });
          });
        //ngDialog.close($scope.registerdialog.id);
      };
    }
  ]);

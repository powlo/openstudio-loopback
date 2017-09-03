'use strict';

angular.module('openstudioAngularApp')
  .factory('$localStorage', ['$window', function($window) {
    return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      remove: function(key) {
        $window.localStorage.removeItem(key);
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    };
  }])
  .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope',
    '$window', 'baseURL', 'apiBaseURL', 'ngDialog',
    function($resource, $http, $localStorage, $rootScope,
      $window, baseURL, apiBaseURL) {

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken;

    function useCredentials(credentials) {
      isAuthenticated = true;
      username = credentials.username;
      authToken = credentials.token;

      // Set the token as header for your requests!
      $http.defaults.headers.common['x-access-token'] = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      $localStorage.remove(TOKEN_KEY);
    }

    function loadUserCredentials() {
      var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
      if (credentials.username !== undefined) {
        useCredentials(credentials);
      }
    }

    function storeUserCredentials(credentials) {
      $localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
    }

    authFac.login = function(data) {

      $resource(apiBaseURL + "studiousers/login")
        .save(data,
          function(response) {
            storeUserCredentials({
              username: data.username,
              token: response.id
            });
            $rootScope.$broadcast('login:Successful');
          },
          function() {
            isAuthenticated = false;
          }

        );

    };

    authFac.logout = function() {
      //we do an empty post because the access token should be in the header
      $resource(apiBaseURL + "studiousers/logout").save();
      destroyUserCredentials();
    };

    authFac.register = function(registerData, success, failure) {
      $resource(apiBaseURL + "studiousers")
        .save(registerData, success, failure);
    };

    authFac.isAuthenticated = function() {
      return isAuthenticated;
    };

    authFac.getUsername = function() {
      return username;
    };

    loadUserCredentials();

    return authFac;

  }]);

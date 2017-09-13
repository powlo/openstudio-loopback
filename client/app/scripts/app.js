'use strict';

/**
 * @ngdoc overview
 * @name openstudioAngularApp
 * @description
 * # openstudioAngularApp
 *
 * Main module of the application.
 */
angular
    .module('openstudioAngularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ngResource',
    'ngMessages',
    'ngDialog',
    'lbServices',
    'uiGmapgoogle-maps',
    'angular.filter',
    'ezfb'
  ])
    .config(['$stateProvider', '$urlRouterProvider',
      'LoopBackResourceProvider', 'uiGmapGoogleMapApiProvider', 'ezfbProvider',
      function ($stateProvider, $urlRouterProvider,
      LoopBackResourceProvider, uiGmapGoogleMapApiProvider, ezfbProvider) {
        LoopBackResourceProvider.setUrlBase('http://openstudio-powlo.rhcloud.com/api');

        //Configure Google Map API
        uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBK8FryBmEpUNMPy31IcoF9iErtDI7JG3Q',
        libraries: 'drawing'
        });

        //Setup Facebook SDK.
        ezfbProvider.setLocale('en_GB');
        ezfbProvider.setInitParams({
          appId: '1872067373051846'
        });

        $stateProvider
            .state('app', {
              url: '',
              templateUrl : 'views/base.html',
              controller  : 'BaseCtrl'
            })
            .state('app.map', {
              url: '/map/',
              templateUrl: 'views/map.html',
              controller: 'MapCtrl'
            })
            .state('app.events', {
              url: '/events/?search',
              templateUrl: 'views/event_list.html',
              controller: 'EventListCtrl'
            })
            .state('app.events.detail', {
              url: ':id',
              templateUrl: 'views/event_detail.html',
              controller: 'EventDetailCtrl'
            })
            .state('app.login', {
              url: '/login/',
              templateUrl: 'views/login.html',
              controller: 'LoginController'
            })
            .state('app.register', {
              url: '/register/',
              templateUrl: 'views/register.html',
              controller: 'RegisterController'
            });
        $urlRouterProvider.otherwise('/events/');
    }]);

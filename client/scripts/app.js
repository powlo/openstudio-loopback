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
    'angular.filter'
  ])
    .config(function ($stateProvider, $urlRouterProvider,
      LoopBackResourceProvider, uiGmapGoogleMapApiProvider) {
        LoopBackResourceProvider.setUrlBase('http://localhost:8080/api');

        uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBK8FryBmEpUNMPy31IcoF9iErtDI7JG3Q'
        });

        $stateProvider
            .state('app', {
              url: '',
              views: {
                'header': {
                    templateUrl : 'views/header.html',
                    controller  : 'HeaderCtrl'
                }
              }
            })
            .state('app.events', {
                url: '/events/?search',
                views: {
                  'content@': {
                    templateUrl: 'views/event_list.html',
                    controller: 'EventListCtrl'
                  }
                }
            })
            .state('app.events.detail', {
                url: ':id',
                views: {
                  'content@': {
                    templateUrl: 'views/event_detail.html',
                    controller: 'EventDetailCtrl'
                  }
                }
            });
        $urlRouterProvider.otherwise('/events/');
    });

'use strict';

angular.module('openstudioAngularApp')
  .controller('EventListCtrl', [
    '$rootScope', '$scope', '$stateParams', '$filter', 'uiGmapGoogleMapApi', 'Event',
    function($rootScope, $scope, $stateParams, $filter, uiGmapGoogleMapApi, Event) {

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      Event.find({
          "filter": {
            "where": {
              "and": [{
                  "date": {
                    "gte": today
                  }
                },
                {
                  "date": {
                    "lt": tomorrow
                  }
                }
              ]
            }
          }
        },
        function(objs) { /*success*/
          $scope.events = objs;
        },
        function(err) { /*error*/
          console.log("Error: " + JSON.stringify(err));
        });
    }
  ]);

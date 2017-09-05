'use strict';

angular.module('openstudioAngularApp')
  .controller('EventListCtrl', [
    '$rootScope', '$scope', 'Event',
    function($rootScope, $scope, Event) {

      function getEvents(filter) {
        Event.find(filter,
          function(objs) { /*success*/
            console.log("Events: " + objs.length);
            console.log(objs[0]);
            $scope.events = objs;
          },
          function(err) { /*error*/
            console.log("Error: " + JSON.stringify(err));
          });
      }

      //Used in the view to select which day to see events.
      //Unncessary?
      $scope.filter = {
        date: 'today',
        text: ''
      };

      $scope.$watch('filter.date', function(newVal){
        console.log("date changed!");
        console.log("New Val: " + newVal);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        if (newVal === 'tomorrow'){
          today.setDate(today.getDate()+1);
          tomorrow.setDate(tomorrow.getDate()+1);
        }
        let filter = null;
        if (newVal !== 'all'){
          filter = {
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
            }
        }
        getEvents(filter);
      });
    }
  ]);

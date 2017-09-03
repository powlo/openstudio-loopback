'use strict';

angular.module('openstudioAngularApp')
  .controller('MapCtrl', [
    '$rootScope', '$scope', 'uiGmapGoogleMapApi', 'Event',
    function($rootScope, $scope, uiGmapGoogleMapApi, Event) {
      $scope.map = {
        center: {
          latitude: 52.2053,
          longitude: 0.1218
        },
        zoom: 15
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      uiGmapGoogleMapApi.then(function(maps) {
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
            objs.forEach(function(event) {
              let icon = {
                url: 'images/map-marker-point.svg',
                size: new maps.Size(50, 50),
                scaledSize: new maps.Size(50, 50)
              };
              let m = {
                geopoint: {},
                icon: icon,
                id: event.id
              };
              m.geopoint.latitude = event.geopoint.lat;
              m.geopoint.longitude = event.geopoint.lng;
              event.marker = m;
            });
            $scope.events = objs;
          },
          function(err) { /*error*/
            console.log("Error: " + JSON.stringify(err));
          });
      });
    }
  ]);

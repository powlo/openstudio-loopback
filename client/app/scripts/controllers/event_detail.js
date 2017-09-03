'use strict';

angular.module('openstudioAngularApp')
    .controller('EventDetailCtrl', ['$scope', '$stateParams', 'Event', function ($scope, $stateParams, Event) {
        $scope.event = {};
        $scope.loading = true;
        Event.findById(
          {id: $stateParams.id},
          function (response) {
              $scope.hero = { title: '', image: response.image };
              response.address = [response.thoroughfare, response.premise, response.postal_code].filter(x => x !== '').join(', ');
              $scope.event = response;
              $scope.loading = false;


              //I'm uneasy about this since we're making display
              //decisions in the controller
              let latLng = new google.maps.LatLng(52.2053,0.1218);

              let mapProp= {
                center: latLng,
                zoom:15,
              };

              let map = new google.maps.Map(document.getElementById("eventMap"),mapProp);

              var geocoder = new google.maps.Geocoder();
              console.log($scope.event.address);
              geocoder.geocode( { address: $scope.event.address, componentRestrictions: {
          country: 'UK'}}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
                });
                } else {
                  console.log("Geocode was not successful for the following reason: " + status);
                }
                });

          },
          function (response) {
              console.log(response);
          });



}]);

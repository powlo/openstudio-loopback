//Filters array by exact date match
'use strict';

angular.module('openstudioAngularApp')
.filter('dateIs', function () {
  return function (items, dt) {

    if (!items) {
      return [];
    }
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      const item = items[i];
      const item_date = new Date(item.date);
      //could be a job for moment.js
      if (item_date.getHours() === dt.getHours()) {
        filtered.push(item);
      }
    }
    return filtered;
  };
});

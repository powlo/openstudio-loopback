'use strict';

angular.module('openstudioAngularApp')
.filter('prettydate', ['$filter', function($filter){
  const std_date = $filter('date');
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate()+1);

  return function(dateToFormat, ...args){
    const d = new Date(dateToFormat);
    d.setHours(0,0,0,0);
    if (d.getTime() === today.getTime()){
      return 'today';
    }
    else if (d.getTime() === tomorrow.getTime()) {
      return 'tomorrow';
    }
    return std_date(dateToFormat, ...args);
  };
}]);

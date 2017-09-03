//Bump dates in the db to today, to aid testing.

const app = require('../server');
const Event = app.models.Event;

const today = new Date();
today.setHours(12,0,0,0);

Event.find({order: 'date ASC'}, function(err, events){
  const earliest = events[0].date;
  const diff = today - earliest;

  events.forEach(function(event){
    event.date = new Date(event.date.getTime() + diff);
    event.save();
  });
  app.datasources.MongoDB.disconnect();
});

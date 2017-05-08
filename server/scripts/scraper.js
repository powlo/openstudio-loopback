//This scraper will go through the "Studios" page and pull out events.
/*jshint esversion: 6 */
const loopback = require('loopback');
const scrapeIt = require('scrape-it');
const request = require('request');
const path = require('path');
const fs = require('fs');
const async = require('async');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBK8FryBmEpUNMPy31IcoF9iErtDI7JG3Q'
});

const base_url = 'https://www.camopenstudios.co.uk';
const grid_url = base_url + '/cos-search/a-to-z-grid';
const container_url = 'http://localhost:8080/api/Containers/content/download/{file}';
const container_dir = '../data/upload/content';

const app = require('../server');
const Event = app.models.Event;
const Container = app.models.Container;

//utility function. Maybe move to own module.
function get_rnd() {
  return Math.floor(Math.random() * Math.pow(10, 15) * 9 + Math.pow(10, 15)).toString(16);
}

const event_scrape = {
  studio_number: '.cos-studio-number',
  name: '.cos-public-name',
  image: {
    selector: '.cos-rhs .content > img',
    attr: 'src'
  },
  location_type: '.cos-location-type',
  media_type: '.cos-media-type',
  text: '.cos-text',
  thoroughfare: '.cos-address .thoroughfare',
  premise: '.cos-address .premise',
  locality: '.cos-address .locality',
  state: '.cos-address .state',
  postal_code: '.cos-address .postal-code',
  telephone: ".cos-public-telephone",
  email: ".cos-public-email",
  website: ".cos-website"
};

const events_scrape = {
  urls : {
    listItem: '.item-cos-grid-list .views-row',
    data: {
      url: {
        selector: '.cos-rhs > a',
        attr: 'href',
        convert: x => base_url + x
      }
    }
  },
  next: {
    selector: '.pager .pager__item--next > a',
    attr: 'href'
  }
};

function event_cb (err, page) {
  if (err) {
    console.log(JSON.stringify(err));
    return;
  }
  if (page.name === '' || undefined) {
    console.log('Got empty page for ' + page);
    return;
  }
  var rnd = get_rnd();
  //we pipe the image to a local dir and rewrite the image attribute
  var image_fname = path.join(container_dir, rnd + ".jpeg");
  request(page.image).pipe(fs.createWriteStream(image_fname));
  page.image = container_url.replace(/{file}/, rnd + ".jpeg");
  const address = [page.thoroughfare, page.premise, page.postal_code].filter(x => x !== '').join(', ');
  googleMapsClient.geocode({address: address},
    function(err, response) {
    if (!err) {
      //assume first result is best!
      const first_result = response.json.results[0];
      page.geopoint = new loopback.GeoPoint({lat: first_result.geometry.location.lat,
                              lng: first_result.geometry.location.lng});
      Event.upsertWithWhere({name: page.name}, page, function(err, obj){
        if (err) process.stdout.write("!");
        else process.stdout.write(".");
      });
    }
  });
}

function events_cb(err, page) {
    if (err) {
      console.log(err);
      return;
    }
    async.eachSeries(page.urls, function(item, cb) {
      scrapeIt(item.url, event_scrape, event_cb);
      setTimeout(function(){ cb(); }, 1000);
    }, function(err){
      if (err){
        console.log(err);
        return;
      }
      if (page.next){
        scrapeIt(base_url + page.next, events_scrape, events_cb);
      }
      else app.datasources.MongoDB.disconnect();
    });

}

scrapeIt(grid_url, events_scrape, events_cb);

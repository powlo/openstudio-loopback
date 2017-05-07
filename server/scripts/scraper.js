//This scraper will go through the "Studios" page and pull out events.
/*jshint esversion: 6 */

const scrapeIt = require('scrape-it');
const request = require('request');
const path = require('path');
const fs = require('fs');
const async = require('async');

const base_url = 'https://www.camopenstudios.co.uk';
const grid_url = base_url + '/cos-search/a-to-z-grid';
const container_url = 'http://localhost:8080/api/Containers/content/download/{file}';
const container_dir = '../data/upload/content';
const base_dir = '../raw/';

const app = require('../server');
const Event = app.models.Event;
const Container = app.models.Container;

fs.mkdir(base_dir, function (err) {});

//utility function. Maybe move to own module.
function get_rnd() {
  return Math.floor(Math.random() * Math.pow(10, 15) * 9 + Math.pow(10, 15)).toString(16);
}

//probably better to do a callback instead of passing around an array
function scrape_grid(grid_url, event_urls) {
  scrapeIt(grid_url, {
    events : {
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
  }, (err, page) => {
      if (err) {
        console.log('eek');
        console.log(err);
        return;
      }
      event_urls = event_urls.concat(page.events);
      if (page.next){
        scrape_grid(base_url + page.next, event_urls);
      }
      else {
        //the recursion nightmare is over
        console.log('Total event urls: ' + event_urls.length);
        event_urls.forEach(function(thing) {

          scrape_event(thing.url);
        });
      }
  });
}

function scrape_event(url) {
  console.log('scraping event at ' + url);
  scrapeIt(url, {
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
  }, (err, page) => {
    if (err) {
      console.log("oh no");
      console.log(JSON.stringify(err));
      return;
    }
    if (page.name === '' || undefined) {
      console.log('Got empty page for ' + url);
      return;
    }
    var rnd = get_rnd();
    //we pipe the image to a local dir and rewrite the image attribute
    var image_fname = path.join(container_dir, rnd + ".jpeg");
    request(page.image).pipe(fs.createWriteStream(image_fname));
    page.image = container_url.replace(/{file}/, rnd + ".jpeg");
    Event.upsertWithWhere({name: page.name}, page, function(err, obj){
      console.log('Created/updated db entry for "' + obj.name + '"');
    });
  });
}

event_urls = [];
scrape_grid(grid_url, event_urls);

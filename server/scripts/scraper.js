//This scraper will go through the a-z and pull artists that are taking
//part in the open studio event.
//It will then pull artist details and POST them to the server.

const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const fs = require('fs');
const async = require('async');

const base_url = 'https://www.camopenstudios.co.uk';
const grid_url = base_url + '/cos-search/a-to-z-grid';
const base_dir = '../raw/'
fs.mkdir(base_dir, function (err) {});

//given a url return a json object for an artist
var getdetails = function (url) {
    request({
        url: url,
        timeout: 20000000
    }, function (error, response, body) {
        if (error) {
            console.log('Error fetching from ' + url);
            console.log(error);
            return;
        }
        if (response.statusCode !== 200) {
            console.log('Status code: ' + response.statusCode + ' for ' + url);
            console.log(body);
            return;
        }

        var $ = cheerio.load(body);
        //if (!$('.ds-artist-summary .user-summary').has('h2.block__title:contains("July Open Studios")')) return;

        var studio_number = $('.cos-studio-number').text();
        var name = $('.cos-public-name').text().trim();
        var location_type = $('.cos-location-type').text().trim();
        var media_type = $('.cos-media-type').text().trim();
        var text = $('.cos-text').text().trim();
        var thoroughfare = $('.cos-address .thoroughfare').text().trim();
        var premise = $('.cos-address .premise').text().trim();
        var locality = $('.cos-address .locality').text().trim();
        var state = $('.cos-address .state').text().trim();
        var postal_code = $('.cos-address .postal-code').text().trim();
        var telephone = $(".cos-public-telephone").text().trim();
        var email = $(".cos-public-email").text().trim();
        var website = $(".cos-website").text().trim();

        if (!name) return; //we done goofed

        var artist = new Object();

        artist['studio_number'] = $('.cos-studio-number').text();
        artist['name'] = $('.cos-public-name').text().trim();
        artist['location_type'] = $('.cos-location-type').text().trim();
        artist['media_type'] = $('.cos-media-type').text().trim();
        artist['text'] = $('.cos-text').text().trim();
        artist['thoroughfare'] = $('.cos-address .thoroughfare').text().trim();
        artist['premise'] = $('.cos-address .premise').text().trim();
        artist['locality'] = $('.cos-address .locality').text().trim();
        artist['state'] = $('.cos-address .state').text().trim();
        artist['postal_code'] = $('.cos-address .postal-code').text().trim();
        artist['telephone'] = $(".cos-public-telephone").text().trim();
        artist['email'] = $(".cos-public-email").text().trim();
        artist['website'] = $(".cos-website").text().trim();

        dir = path.join(base_dir, artist['studio_number']);

        fs.mkdir(dir, function () {
            details_fname = path.join(dir, 'details.json');
            image_fname = path.join(dir, 'image.jpeg');
            fs.writeFile(details_fname, JSON.stringify(artist, null, '\t'));
            var ws = fs.createWriteStream(image_fname);
            var image = $('.file-image img').get(0);
            request(image.attribs.src).pipe(ws);
        })
    });
}

request(grid_url, function (error, response, body) {
    var $ = cheerio.load(body);
    var grid = $('.item-cos-grid-list .views-row');

    var urls = grid.map(function (index, element) {
        return base_url + $(element).find('a').first().get(0).attribs.href;
    });
    urls.each(function () {
        getdetails(this.toString());
    })
});

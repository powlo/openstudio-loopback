//This scraper will go through the a-z and pull artists that are taking
//part in the open studio event.
//It will then pull artist details and POST them to the server.

const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const fs = require('fs');
const async = require('async');

const base_url = 'https://www.camopenstudios.co.uk';
const grid_url = base_url + '/artist-search/a-to-z-grid';
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
        if (!$('.ds-artist-summary .user-summary').has('h2.block__title:contains("July Open Studios")')) return;

        var id = $('.ds-artist-summary .title').text().trim().toLowerCase().replace(/\s+/gi, '-');
        var name = $('.ds-artist-summary .title').text().trim();
        var tags = $('.ds-artist-summary .subtitle').text().trim();
        var outline = $('.ds-artist-summary .summary-text').text().trim();
        var description = $('.ds-artist-summary .long-text').text().trim();
        var telephone = $(".summary-contact .label:contains('Telephone')").text().trim();
        var email = $(".summary-contact .label:contains('Email')").text().trim();
        var website = $(".summary-contact .label:contains('Website')").text().trim();

        if (!name) return;

        var artist = {
            id: id,
            name: name
        };
        if (outline) artist["outline"] = outline;
        if (description) artist["description"] = description;
        if (telephone) artist["telephone"] = telephone;
        if (email) artist["email"] = email;
        if (website) artist["website"] = website;

        dir = path.join(base_dir, id);

        fs.mkdir(dir, function () {
            details_fname = path.join(dir, 'details.json');
            image_fname = path.join(dir, 'image.jpeg');
            fs.writeFile(details_fname, JSON.stringify(artist, null, '\t'));
            var ws = fs.createWriteStream(image_fname);
            var image = $('img[alt="Member image"]').get(0);
            request(image.attribs.src).pipe(ws);
        })
    });
}

request(grid_url, function (error, response, body) {
    var $ = cheerio.load(body);
    var grid = $('.item-grid-list .views-row');

    var urls = grid.map(function (index, element) {
        return base_url + $(element).find('a').first().get(0).attribs.href;
    });
    urls.each(function () {
        getdetails(this.toString());
    })
});
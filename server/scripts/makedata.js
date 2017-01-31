//This should be rewritten as back end agnostic. Ie just make a series of
//posts to a url.

var fs = require('fs');
var path = require('path');
var request = require('request');

var app = require('../server');
var Artist = app.models.Artist;
var Container = app.models.Container;

const base_dir = '../raw/';
const container_dir = '../data/upload/content';
const container_url = 'http://localhost:8080/api/Containers/content/download/{file}';

console.log(path.resolve(base_dir));
fs.readdir(base_dir, function (err, items) {
    for (let i = 0; i < items.length; i++) {
        var data_fname = path.join(base_dir, items[i], 'details.json');

        console.log('Processing ' + items[i]);
        fs.readFile(data_fname, (err, data) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    console.log('Warning: No json found at ' + err.path);
                    return;
                } else {
                    throw err;
                }
            }
            try {
                var obj = JSON.parse(data);
            } catch (SyntaxError) {
                console.log('Couldn\'t parse data in file ' + data_fname + ' for ' + items[i]);
                return;
            }
            Artist.create(obj, function (err, artist) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                var image_fname = path.join(base_dir, items[i], 'image.jpeg');
                var rnd_jpeg = Math.floor(Math.random() * Math.pow(10, 15) * 9 + Math.pow(10, 15)).toString(16) + '.jpeg';
                var rnd_fname = path.join(container_dir, rnd_jpeg);
                var rd_stream = fs.createReadStream(image_fname);
                var wr_stream = fs.createWriteStream(rnd_fname);
                rd_stream.on('error', function (err) {
                    console.log('Cannot read from ' + image_fname);
                    console.log(err);
                });
                wr_stream.on('error', function (err) {
                    console.log('Cannot write to ' + rnd_fname);
                });
                wr_stream.on('finish', function () {
                    artist.image = container_url.replace(/{file}/, rnd_jpeg);
                    artist.save();
                    console.log('Created record for ' + obj.name);
                });
                rd_stream.pipe(wr_stream);
            });
        });
    }
});
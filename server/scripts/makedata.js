//This should be rewritten as back end agnostic. Ie just make a series of
//posts to a url.

var fs = require('fs');
var path = require('path');
var request = require('request');

var app = require('../server');
var Event = app.models.Event;
var Container = app.models.Container;

const base_dir = '../raw/';
const container_dir = '../data/upload/content';
const container_url = 'http://localhost:8080/api/Containers/content/download/{file}';

function get_rnd() {
  return Math.floor(Math.random() * Math.pow(10, 15) * 9 + Math.pow(10, 15)).toString(16);
}

function copyfile(src, dest) {
  var rd_stream = fs.createReadStream(src);
  var wr_stream = fs.createWriteStream(dest);
  rd_stream.pipe(wr_stream);
}

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

            //create a random file name and copy to content folder
            var src = path.join(base_dir, items[i], 'image.jpeg');
            var rnd = get_rnd();
            var dest = path.join(container_dir, rnd + ".jpeg");
            copyfile(src, dest);
            obj.image = container_url.replace(/{file}/, rnd + ".jpeg");
            Event.create(obj, function (err, event) {
                if (err) {
                    console.log(err.message);
                    return;
                }
            });
        });
    }
});

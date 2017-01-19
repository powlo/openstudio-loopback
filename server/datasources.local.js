const path = require('path');

module.exports = {
    "MongoDB": {
        hostname: 'localhost',
        port: 0
    },
    "filestore": {
        "root": path.join(__dirname, 'data', 'upload')
    }
};
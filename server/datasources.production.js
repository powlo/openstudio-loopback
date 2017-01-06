var path = require('path');

module.exports = {
    "MongoDB": {
        hostname: process.env.OPENSHIFT_MONGODB_DB_HOST,
        port: process.env.OPENSHIFT_MONGODB_DB_PORT,
        user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
        password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD
    },
    "filestore": {
        "root": path.resolve(process.env.OPENSHIFT_DATA_DIR, "upload")
    }
};
var app = require('../server');
var prompt = require('prompt');

var MongoDB = app.dataSources.MongoDB;
var Role = app.models.Role;
var RoleMapping = app.models.RoleMapping;

prompt.start();

prompt.get(['username', 'email', 'password'], function (err, result) {
    if (err) {
        return onErr(err);
    }

    app.models.StudioUser.create({
        username: result.username,
        email: result.email,
        password: result.password
    }, function (err, user) {
        if (err) throw (err);

        //create the admin role
        Role.findOrCreate({
            name: 'admin'
        }, function (err, role) {
            if (err) throw (err);
            //make admin
            role.principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id
            }, function (err, principal) {
                if (err) throw (err);
                MongoDB.disconnect();
            });
        });
    });
});
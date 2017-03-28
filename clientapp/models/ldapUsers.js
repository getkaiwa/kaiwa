/*global app, client*/
"use strict";

var BaseCollection = require('./baseCollection');
var ldapUser = require('./ldapUser');

module.exports = BaseCollection.extend({
    type: 'ldapUsers',
    model: ldapUser.user,
    comparator: function (model1, model2) {
        var name1 = model1.displayName.toLowerCase();
        var name2 = model2.displayName.toLowerCase();
        if (name1 === name2) {
            return 0;
        }
        if (name1 < name2) {
            return -1;
        }
        return 1;
    },
    initialize: function (model, options) {
        this.bind('change', this.sort, this);
    },
    fetch: function (cb) {
        var self = this;

        if(SERVER_CONFIG.ldapEnabled)
        $.post('/ldap/users', ldapUser.ldapData(), function(users) {
            var toRemove = [];
            for ( var i = 0; i < self.models.length; i++) {
                toRemove.push(self.models[i].id);
            }

            users = JSON.parse(users);
            users.forEach(function(user) {
                user.id = user.uid;
                var existing = self.get(user.id);
                if (!existing) {
                    self.add(user);
                }

                var index = toRemove.indexOf(user.id);
                if (index > -1) {
                    toRemove.splice(index, 1);
                }
            });

            self.remove(toRemove);

            if (cb) cb();
        });
    },
    addUser: function (id) {
        var self = this;

        if(SERVER_CONFIG.ldapEnabled)
        $.post('/ldap/users/add', ldapUser.ldapData({newUid: id}), function(result) {
            result = JSON.parse(result);
            if (result) {
                self.fetch();
            }
        });
    },
    deleteUser: function (id) {
        var self = this;

        if(SERVER_CONFIG.ldapEnabled)
        $.post('/ldap/users/delete', ldapUser.ldapData({removeUid: id}), function(result) {
            result = JSON.parse(result);
            if (result) {
                self.fetch();
            }
        });
    }
});

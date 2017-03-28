/*global app, me, client, URL, $*/
"use strict";

var _ = require('underscore');
var HumanModel = require('human-model');

exports.ldapData = function (data) {
    if (!data) data = {};
    data.uid = app.config.jid.substring(0, app.config.jid.indexOf('@'));
    data.password = app.config.credentials.password;

    return data;
};

exports.user = HumanModel.define({
    initialize: function (attrs) {

    },
    type: 'ldapUser',
    props: {
        id: ['string', true, false],
        cn: ['string', true, false],
        sn: ['string', false, ''],
        givenName: ['string', false, ''],
        displayName: ['string', false, ''],
        mail: ['string', false, ''],
        objectClass: ['array', false, []]
    },
    save: function(userInfos, cb) {
        var change = false;
        var oldValues = {};
        for (var property in userInfos) {
            if (userInfos.hasOwnProperty(property) && this[property] !== undefined) {
                oldValues[property] = this[property];
                if (this[property] != userInfos[property])
                    change = true;
            }
        }

        if (!change)
            return;

        var self = this;
        $.post('/ldap/user/' + this.id, exports.ldapData(userInfos), function(result) {
            result = JSON.parse(result);

            if (result) {
                for (var property1 in userInfos) {
                    if (userInfos.hasOwnProperty(property1) && self[property1] !== undefined) {
                        self[property1] = userInfos[property1];
                    }
                }
            }
            else {
                for (var property2 in oldValues) {
                    if (oldValues.hasOwnProperty(property2) && self[property2] !== undefined) {
                        self[property2] = '';
                        self[property2] = oldValues[property2];
                    }
                }
            }

            cb();
        });
    },
    changePassword: function(newPassword) {
        var self = this;

        $.post('/ldap/user/' + this.id + '/password', exports.ldapData({newPassword: newPassword}), function(result) {
            result = JSON.parse(result);
            if (!result) {
                app.ldapUsers.fetch();
            }
        });
    },
    meIsAdmin: function() {
        return me.isAdmin;
    }
});

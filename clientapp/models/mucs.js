/*global app, client, me, SERVER_CONFIG*/
"use strict";

var async = require('async');
var BaseCollection = require('./baseCollection');
var MUC = require('./muc');


module.exports = BaseCollection.extend({
    type: 'mucs',
    model: MUC,
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
    loadBookmarks: function () {
        var self = this;
        app.whenConnected(function () {
            client.getBookmarks(function (err, res) {
                if (err) return;

                var mucs = res.privateStorage.bookmarks.conferences;
                mucs.forEach(function (muc) {
                    self.add(muc);
                    if (muc.autoJoin) {
                        self.get(muc.jid).join();
                    }
                });
            });
        });
    },
    init: function () {
        var self = this;
        app.whenConnected(function () {

            function _fetch(init) {
                self.fetch(function() {
                    self.update();
                    if (init) self.trigger('loaded');
                    setTimeout(_fetch, 30000);
                });
            }
            _fetch(true);

        });
    },
    fetch: function(cb) {
        var self = this;
        while(app.mucInfos.length > 0) {
            app.mucInfos.pop();
        }

        if (SERVER_CONFIG.muc) {
            if (client.sessionStarted) {

                var rooms = [];
                client.getDiscoItems(SERVER_CONFIG.muc, '', function (err, res) {
                    if (err) return;

                    rooms = res.discoItems.items;
                    if (rooms === undefined)
                        rooms = [];
                    var roomNum = 0;

                    rooms.forEach (function (room) {
                      client.getDiscoInfo(room.jid, '', function (err, res) {

                        roomNum++;
                        if (err) return;

                        var features = res.discoInfo.features;
                        var persistent = features.indexOf("muc_persistent") > -1;
                        var mucInfo = {
                          id: room.jid.full,
                          name: room.name,
                          jid: room.jid,
                          nick: me.nick,
                          autoJoin: persistent,
                          persistent: persistent
                        };

                        app.mucInfos.push(mucInfo);

                      }).then(function() {
                        if (cb && roomNum == rooms.length) cb();
                      });
                    });
                }).then(function() {
                    if (cb && !rooms.length) cb();
                });

            } else {
                app.whenConnected(function () {
                    self.fetch(cb);
                });
            }
            return;
        }

        if (cb) cb();

    },
    update: function () {
        if (SERVER_CONFIG.muc) {
            var toRemove = [];
            for ( var i = 0; i < this.models.length; i++) {
                toRemove.push(this.models[i]);
            }

            for (var j = 0; j < app.mucInfos.length; j++) {

                var mucInfo = app.mucInfos[j];
                var muc = this.get(mucInfo.jid);
                if (muc) {
                    muc.name = mucInfo.name;
                    muc.autoJoin =  mucInfo.autoJoin;
                    muc.persistent = mucInfo.persistent;

                    var index = toRemove.indexOf(muc);
                    if (index > -1) {
                        toRemove.splice(index, 1);
                    }
                }
                else {
                    this.add(mucInfo);
                    muc = this.get(mucInfo.jid);
                }

                if (muc.autoJoin && !muc.joined) {
                    muc.join();
                }

            }

            this.remove(toRemove);

            while(app.mucInfos.length > 0) {
                app.mucInfos.pop();
            }
        }
    },
    save: function (cb) {
        var self = this;
        app.whenConnected(function () {
            var models = [];
            self.models.forEach(function (model) {
                models.push({
                    name: model.name,
                    jid: model.jid,
                    nick: model.nick,
                    autoJoin: model.autoJoin
                });
            });
            client.setBookmarks({conferences: models}, cb);
        });
    }
});

/*global $, app, me, client, SERVER_CONFIG*/
"use strict";

var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var async = require('async');
var StanzaIO = require('stanza.io');

var AppState = require('./models/state');
var MeModel = require('./models/me');
var LdapUsers = require('./models/ldapUsers');
var MainView = require('./views/main');
var Router = require('./router');
var Storage = require('./storage');
var xmppEventHandlers = require('./helpers/xmppEventHandlers');
var pushNotifications = require('./helpers/pushNotifications');
var Notify = require('notify.js');
var Desktop = require('./helpers/desktop');
var AppCache = require('./helpers/cache');

var SoundEffectManager = require('sound-effect-manager');

module.exports = {
    launch: function () {

        var self = window.app = this;
        self.JID = StanzaIO.JID;
        var config = localStorage.config;

        if (!config) {
            console.log('missing config');
            window.location = '/login';
            return;
        }

        app.config = JSON.parse(config);
        app.config.useStreamManagement = true;

        _.extend(this, Backbone.Events);

        var profile = {};
        async.series([
            function (cb) {
                app.composing = {};
                app.timeInterval = 0;
                app.mucInfos = [];
                app.notifications = new Notify();
                app.soundManager = new SoundEffectManager();
                app.desktop = new Desktop();
                app.cache = new AppCache();
                app.storage = new Storage();
                app.storage.open(function(success) {
                  if (!success) {
                    console.error('IndexedDB is not activated (private mode?)');
                  }
                  cb();
                });
            },
            function (cb) {
                app.storage.profiles.get(app.config.jid, function (err, res) {
                    if (res) {
                        profile = res;
                        profile.jid = {full: app.config.jid, bare: app.config.jid};
                        app.config.rosterVer = res.rosterVer;
                    }
                    cb();
                });
            },
            function (cb) {
                app.state = new AppState();
                app.me = window.me = new MeModel(profile);

                window.onbeforeunload = function () {
                    if (app.api.sessionStarted) {
                        app.api.disconnect();
                    }
                };

                self.api = window.client = StanzaIO.createClient(app.config);
                client.use(pushNotifications);
                xmppEventHandlers(self.api, self);

                self.api.once('session:started', function () {
                    app.state.hasConnected = true;
                    cb();
                });
                self.api.connect();
            },
            function (cb) {
                app.soundManager.loadFile('/sounds/ding.wav', 'ding');
                app.soundManager.loadFile('/sounds/threetone-alert.wav', 'threetone-alert');
                cb();
            },
            function (cb) {
                app.whenConnected(function () {
                    function getInterval() {
                        if (client.sessionStarted) {
                            client.getTime(self.id, function (err, res) {
                                if (err) return;
                                self.timeInterval = res.time.utc - Date.now();
                            });
                            setTimeout(getInterval, 600000);
                        }
                    }
                    getInterval();
                });
                cb();
            },
            function (cb) {
                app.whenConnected(function () {
                    me.publishAvatar();
                });

                function start() {
                    // start our router and show the appropriate page
                    app.history.start({pushState: true, root: '/'});
                    if (app.history.fragment === '' && SERVER_CONFIG.startup)
                        app.navigate(SERVER_CONFIG.startup);
                    cb();
                }

                new Router();
                app.history = Backbone.history;
                app.history.on("route", function(route, params) {
                    app.state.pageChanged = params;
                });

                self.view = new MainView({
                    model: app.state,
                    el: document.body
                });
                self.view.render();

                app.ldapUsers = new LdapUsers();

                if (me.contacts.length) {
                    start();
                } else {
                    me.contacts.once('loaded', start);
                }
            }
        ]);
    },
    whenConnected: function (func) {
        if (app.api.sessionStarted) {
            func();
        } else {
            app.api.once('session:started', func);
        }
    },
    navigate: function (page) {
        var url = (page.charAt(0) === '/') ? page.slice(1) : page;
        app.state.markActive();
        app.history.navigate(url, true);
        $('#toggle-sidebar').prop("checked", false);
    },
    renderPage: function (view, animation) {
        var container = $('#pages');

        if (app.currentPage) {
            app.currentPage.hide(animation);
        }
        // we call render, but if animation is none, we want to tell the view
        // to start with the active class already before appending to DOM.
        container.append(view.render(animation === 'none').el);
        view.show(animation);
    },
    serverConfig: function () {
        return SERVER_CONFIG;
    }
};

$(function () {
    module.exports.launch();
});

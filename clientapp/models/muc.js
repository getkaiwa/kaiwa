/*global app, me, client, SERVER_CONFIG*/
"use strict";

var _ = require('underscore');
var async = require('async');
var uuid = require('node-uuid');
var htmlify = require('../helpers/htmlify');
var HumanModel = require('human-model');
var Resources = require('./resources');
var Messages = require('./messages');
var Message = require('./message');
var avatarHandler = require('../helpers/avatarHandler');

module.exports = HumanModel.define({
    initialize: function (attrs) {
        if (attrs.jid) {
            this.id = attrs.jid.full;
        }
        var self = this;
        this.resources.bind("add remove reset", function(){
            self.membersCount = self.resources.length;
        });
    },
    type: 'muc',
    props: {
        id: ['string', true],
        name: 'string',
        autoJoin: ['bool', false, false],
        nick: 'string',
        jid: 'object'
    },
    session: {
        subject: 'string',
        activeContact: ['bool', false, false],
        lastInteraction: 'date',
        lastSentMessage: 'object',
        unreadCount: ['number', false, 0],
        persistent: ['bool', false, false],
        joined: ['bool', true, false],
        membersCount: ['number', false, 0],
    },
    derived: {
        displayName: {
            deps: ['name', 'jid'],
            fn: function () {
                var disp = this.name;
                if (!disp) disp = this.jid.jid;
                return disp.split('@')[0];
            }
        },
        displayUnreadCount: {
            deps: ['unreadCount'],
            fn: function () {
                if (this.unreadCount > 0) {
                    if (this.unreadCount < 100)
                      return this.unreadCount.toString();
                    else
                      return '99+';
                }
                return '';
            }
        },
        displaySubject: {
            deps: ['subject'],
            fn: function () {
                return htmlify.toHTML(this.subject);
            }
        },
        hasUnread: {
            deps: ['unreadCount'],
            fn: function () {
                return this.unreadCount > 0;
            }
        }
    },
    collections: {
        resources: Resources,
        messages: Messages
    },
    getName: function (jid) {
        var nickname = jid.split('/')[1];
        var name = nickname;
        var xmppContact = me.getContact(nickname);
        if (xmppContact) {
            name = xmppContact.displayName;
        }
        return name !== '' ? name : nickname;
    },
    getNickname: function (jid) {
        var nickname = jid.split('/')[1];
        return nickname != this.getName(jid) ? nickname : '';
    },
    getAvatar: function (jid) {
        var avatar = avatarHandler.getGravatar('').uri;
        var xmppContact = me.getContact(jid.split('/')[1]);
        if (xmppContact) {
            avatar = xmppContact.avatar;
        }
        return avatar;
    },
    addMessage: function (message, notify) {
        message.owner = me.jid.bare;

        var self = this;

        var mentions = [];
        var toMe = false;
        this.resources.forEach(function (resource) {
            if (message.body.toLowerCase().indexOf('@' + resource.mucDisplayName) >= 0) {
                mentions.push('@' + resource.mucDisplayName);
                if (resource.mucDisplayName === self.nick)
                    toMe = true;
            }
        });
        if (message.body.toLowerCase().indexOf('@all') >= 0) {
            mentions.push('@all');
        }
        message.mentions = mentions;

        var mine = message.from.resource === this.nick;

        if (mine) {
            message._mucMine = true;
        }

        if (notify && (!this.activeContact || (this.activeContact && !app.state.focused)) && !mine) {
            this.unreadCount++;
            if (toMe) {
                app.notifications.create(this.displayName, {
                    body: message.body,
                    icon: this.avatar,
                    tag: this.id,
                    onclick: _.bind(app.navigate, app, '/groupchat/' + encodeURIComponent(this.jid))
                });
                if (me.soundEnabled)
                    app.soundManager.play('threetone-alert');
            }
            else
            {
                if (me.soundEnabled)
                    app.soundManager.play('ding');
            }
        }

        message.acked = true;

        if (mine) {
            this.lastSentMessage = message;
        }

        var existing = Message.idLookup(message.from.full, message.mid);
        if (existing) {
            existing.set(message);
            existing.save();
        } else {
            this.messages.add(message);
            message.save();
        }

        var newInteraction = new Date(message.created);
        if (!this.lastInteraction || this.lastInteraction < newInteraction) {
            this.lastInteraction = newInteraction;
        }
    },
    join: function (manual) {
        var self = this;
        if (!this.nick) {
            this.nick = me.jid.local;
        }
        this.messages.reset();
        this.resources.reset();

        client.joinRoom(this.jid, this.nick, {
            joinMuc: {
                history: {
                    maxstanzas: 50
                }
            }
        });

        if (manual) {
            var form = {
                fields: [
                    {
                      type: 'hidden',
                      name: 'FORM_TYPE',
                      value: 'http://jabber.org/protocol/muc#roomconfig'
                    },
                    {
                      type: 'boolean',
                      name: 'muc#roomconfig_changesubject',
                      value: true
                    },
                    {
                      type: 'boolean',
                      name: 'muc#roomconfig_persistentroom',
                      value: true
                    },
                ]
            };
            client.configureRoom(this.jid, form, function(err, resp) {
                if (err) return;
            });

            if (SERVER_CONFIG.domain && SERVER_CONFIG.admin) {
                client.setRoomAffiliation(this.jid, SERVER_CONFIG.admin + '@' + SERVER_CONFIG.domain, 'owner', 'administration', function(err, resp) {
                    if (err) return;
                    client.setRoomAffiliation(self.jid, me.jid, 'none', 'administration');
                });
            }
        }

        // After a reconnection
        client.on('muc:join', function (pres) {
            if (self.messages.length) {
                self.fetchHistory(true);
            }
        });
    },
    fetchHistory: function(allInterval) {
        var self = this;
        app.whenConnected(function () {
            var filter = {
                'to': self.jid,
                rsm: {
                    max: 40,
                    before: !allInterval
                }
            };

            if (allInterval) {
                var lastMessage = self.messages.last();
                if (lastMessage && lastMessage.created) {
                    var start = new Date(lastMessage.created);
                    filter.start = start.toISOString();
                }
            } else {
                var firstMessage = self.messages.first();
                if (firstMessage && firstMessage.created) {
                    var end = new Date(firstMessage.created);
                    filter.end = end.toISOString();
                }
            }

            client.searchHistory(filter, function (err, res) {
                if (err) return;

                var results = res.mamResult.items || [];
                if (filter.rsm.before) {
                  results.reverse();
                }
                results.forEach(function (result) {
                    var msg = result.forwarded.message;

                    msg.mid = msg.id;
                    delete msg.id;

                    if (!msg.delay) {
                        msg.delay = result.forwarded.delay;
                    }

                    if (msg.replace) {
                        var original = Message.idLookup(msg.from[msg.type == 'groupchat' ? 'full' : 'bare'], msg.replace);
                        // Drop the message if editing a previous, but
                        // keep it if it didn't actually change an
                        // existing message.
                        if (original && original.correct(msg)) return;
                    }

                    var message = new Message(msg);
                    message.archivedId = result.id;
                    message.acked = true;

                    self.addMessage(message, false);
                });

                if (allInterval) {
                  self.trigger('refresh');
                  if (results.length === filter.rsm.max)
                      self.fetchHistory(true);
                }
            });
        });
    },
    leave: function () {
        this.resources.reset();
        client.leaveRoom(this.jid, this.nick);
    },
    destroy: function (cb) {
        client.sendIq({
            type: 'set',
            to: this.jid,
            mucOwner: {
            destroy: {
                jid: this.jid,
                password: '',
                reason: ''
            } }
        }, function (err, res) {
            cb(err);
        });
    }
});

/*global $, app, me, client*/
"use strict";

var _ = require('underscore');
var StayDown = require('staydown');
var BasePage = require('./base');
var templates = require('../templates');
var Message = require('../views/message');
var MessageModel = require('../models/message');
var embedIt = require('../helpers/embedIt');
var htmlify = require('../helpers/htmlify');
var attachMediaStream = require('attachmediastream');


module.exports = BasePage.extend({
    template: templates.pages.chat,
    initialize: function (spec) {
        var self = this;
        this.editMode = false;

        this.listenTo(this, 'pageloaded', this.handlePageLoaded);
        this.listenTo(this, 'pageunloaded', this.handlePageUnloaded);

        this.listenTo(this.model.messages, 'change', this.refreshModel);
        this.listenTo(this.model.messages, 'reset', this.renderCollection);
        this.listenTo(this.model, 'refresh', this.renderCollection);

        app.state.bind('change:connected', this.connectionChange, this);
        this.model.bind('change:avatar', this.handleAvatarChanged, this);

        this.render();
    },
    events: {
        'keydown textarea': 'handleKeyDown',
        'keyup textarea': 'handleKeyUp',
        'click .call': 'handleCallClick',
        'click .accept': 'handleAcceptClick',
        'click .end': 'handleEndClick',
        'click .mute': 'handleMuteClick'
    },
    srcBindings: {
        streamUrl: 'video.remote'
    },
    textBindings: {
        displayName: 'header .name',
        formattedTZO: 'header .tzo',
        status: 'header .status',
        chatStateText: '.chatBox .contactState'
    },
    classBindings: {
        chatState: 'header',
        idle: '.user_presence',
        show: '.user_presence',
        onCall: '.conversation'
    },
    show: function (animation) {
        BasePage.prototype.show.apply(this, [animation]);
        this.sendChatState('active');

        this.firstChanged = true;
        var self = this;
        $('.messages').scroll(function() {
            if (self.firstChanged && $(".messages li:first-child").offset().top > 0) {
                self.firstChanged = false;
                self.model.fetchHistory();
            }
        });

        this.$chatInput.focus();
    },
    hide: function () {
        BasePage.prototype.hide.apply(this);
        this.sendChatState('inactive');
    },
    render: function () {
        if (this.rendered) return this;
        var self = this;

        this.rendered = true;

        this.renderAndBind();

        this.$chatInput = this.$('.chatBox textarea');
        this.$chatInput.val(app.composing[this.model.jid] || '');
        this.$chatBox = this.$('.chatBox');
        this.$messageList = this.$('.messages');

        this.staydown = new StayDown(this.$messageList[0], 500);
        this.renderCollection();

        this.listenTo(this.model.messages, 'add', this.handleChatAdded);
        this.listenToAndRun(this.model, 'change:jingleResources', this.handleJingleResourcesChanged);

        $(window).on('resize', _.bind(this.resizeInput, this));

        this.registerBindings(me, {
            srcBindings: {
                streamUrl: 'video.local'
            }
        });

        return this;
    },
    handlePageLoaded: function () {
        this.staydown.checkdown();
        this.resizeInput();
    },
    handleCallClick: function (e) {
        e.preventDefault();
        this.model.call();
        return false;
    },
    renderCollection: function () {
        var self = this;

        this.$messageList.empty();
        delete this.firstModel;
        delete this.firstDate;
        delete this.lastModel;
        delete this.lastDate;

        this.model.messages.each(function (model, i) {
            self.appendModel(model);
        });
        this.staydown.checkdown();
    },
    handleKeyDown: function (e) {
        if (e.which === 13 && !e.shiftKey) {
            app.composing[this.model.jid] = '';
            this.sendChat();
            this.sendChatState('active');
            e.preventDefault();
            return false;
        } else if (e.which === 38 && this.$chatInput.val() === '' && this.model.lastSentMessage) {
            this.editMode = true;
            this.$chatInput.addClass('editing');
            this.$chatInput.val(this.model.lastSentMessage.body);
            e.preventDefault();
            return false;
        } else if (e.which === 40 && this.editMode) {
            this.editMode = false;
            this.$chatInput.removeClass('editing');
            e.preventDefault();
            return false;
        } else if (!e.ctrlKey && !e.metaKey) {
            if (!this.typing || this.paused) {
                this.typing = true;
                this.paused = false;
                this.$chatInput.addClass('typing');
                this.sendChatState('composing');
            }
        }
    },
    handleKeyUp: function (e) {
        this.resizeInput();
        app.composing[this.model.jid] = this.$chatInput.val();
        if (this.typing && this.$chatInput.val().length === 0) {
            this.typing = false;
            this.$chatInput.removeClass('typing');
            this.sendChatState('active');
        } else if (this.typing) {
            this.pausedTyping();
        }
    },
    pausedTyping: _.debounce(function () {
        if (this.typing && !this.paused) {
            this.paused = true;
            this.sendChatState('paused');
        }
    }, 3000),
    sendChatState: function (state) {
        //if (!this.model.supportsChatStates) return;
        client.sendMessage({
            to: this.model.lockedResource || this.model.jid,
            chatState: state
        });
    },
    sendChat: function () {
        var message;
        var val = this.$chatInput.val();

        if (val) {
            this.staydown.intend_down = true;

            var links = _.map(htmlify.collectLinks(val), function (link) {
                return {url: link};
            });

            message = {
                id: client.nextId(),
                to: new app.JID(this.model.lockedResource || this.model.jid),
                type: 'chat',
                body: val,
                requestReceipt: true,
                oobURIs: links
            };
            if (this.model.supportsChatStates) {
                message.chatState = 'active';
            }
            if (this.editMode) {
                message.replace = this.model.lastSentMessage.id;
            }

            client.sendMessage(message);

            // Prep message to create a Message model
            message.from = me.jid;
            message.mid = message.id;
            delete message.id;

            if (this.editMode) {
                this.model.lastSentMessage.correct(message);
            } else {
                var msgModel = new MessageModel(message);
                this.model.addMessage(msgModel, false);
                this.model.lastSentMessage = msgModel;
            }
        }
        this.editMode = false;
        this.typing = false;
        this.paused = false;
        this.$chatInput.removeClass('typing');
        this.$chatInput.removeClass('editing');
        this.$chatInput.val('');
    },
    handleChatAdded: function (model) {
        this.appendModel(model, true);
    },
    refreshModel: function (model) {
        var existing = this.$('#chat' + model.cid);
        existing.replaceWith(model.bareMessageTemplate(existing.prev().hasClass('message_header')));
        existing = this.$('#chat' + model.cid);
        embedIt(existing);
    },
    handleJingleResourcesChanged: function (model, val) {
        var resources = val || this.model.jingleResources;
        this.$('button.call').prop('disabled', !resources.length);
    },
    handleAvatarChanged: function (contact, uri) {
        if (!me.isMe(contact.jid)) {
            $('.' + contact.jid.substr(0, contact.jid.indexOf('@')) + ' .messageAvatar img').attr('src', uri);
        }
    },
    appendModel: function (model, preload) {
        var newEl, first, last;
        var msgDate = Date.create(model.timestamp);
        var messageDay = msgDate.format('{month} {ord}, {yyyy}');

        if (this.firstModel === undefined || msgDate > Date.create(this.firstModel.timestamp)) {
            if (this.firstModel === undefined) {
                this.firstModel = model;
                this.firstDate = messageDay;
            }

            if (messageDay !== this.lastDate) {
                var dayDivider1 = $(templates.includes.dayDivider({day_name: messageDay}));
                this.staydown.append(dayDivider1[0]);
                this.lastDate = messageDay;
            }

            var isGrouped1 = model.shouldGroupWith(this.lastModel);
            if (isGrouped1) {
                newEl = $(model.partialTemplateHtml);
                last = this.$messageList.find('li').last();
                last.find('.messageWrapper').append(newEl);
                last.addClass('chatGroup');
                this.staydown.checkdown();
            } else {
                newEl = $(model.templateHtml);
                if (!me.isMe(model.sender.jid)) newEl.addClass(model.sender.jid.substr(0, model.sender.jid.indexOf('@')));
                this.staydown.append(newEl[0]);
                this.lastModel = model;
            }
            if (!model.pending) embedIt(newEl);
        }
        else {
            var scrollDown = this.$messageList.prop('scrollHeight') - this.$messageList.scrollTop();
            var firstEl = this.$messageList.find('li').first();

            if (messageDay !== this.firstDate) {
                var dayDivider = $(templates.includes.dayDivider({day_name: messageDay}));
                firstEl.before(dayDivider[0]);
                firstEl = this.$messageList.find('li').first();
                this.firstDate = messageDay;
            }

            var isGrouped2 = model.shouldGroupWith(this.firstModel);
            if (isGrouped2) {
                newEl = $(model.partialTemplateHtml);
                first = this.$messageList.find('li').first().next();
                first.find('.messageWrapper div:first').after(newEl);
                first.addClass('chatGroup');
            } else {
                newEl = $(model.templateHtml);
                if (!me.isMe(model.sender.jid)) newEl.addClass(model.sender.jid.substr(0, model.sender.jid.indexOf('@')));
                firstEl.after(newEl[0]);
                this.firstModel = model;
            }
            if (!model.pending) embedIt(newEl);

            this.$messageList.scrollTop(this.$messageList.prop('scrollHeight') - scrollDown);
            this.firstChanged = true;
        }
    },
    handleAcceptClick: function (e) {
        e.preventDefault();
        var self = this;

        this.$('button.accept').prop('disabled', true);
        if (this.model.jingleCall.jingleSession.state == 'pending') {
            if (!client.jingle.localStream) {
                client.jingle.startLocalMedia(null, function (err) {
                    if (err) {
                        self.model.jingleCall.end({
                            condition: 'decline'
                        });
                    } else {
                        client.sendPresence({to: new app.JID(self.model.jingleCall.jingleSession.peer) });
                        self.model.jingleCall.jingleSession.accept();
                    }
                });
            } else {
                client.sendPresence({to: new app.JID(this.model.jingleCall.jingleSession.peer) });
                this.model.jingleCall.jingleSession.accept();
            }
        }
        return false;
    },
    handleEndClick: function (e) {
        e.preventDefault();
        var condition = 'success';
        if (this.model.jingleCall) {
            if (this.model.jingleCall.jingleSession && this.model.jingleCall.jingleSession.state == 'pending') {
                condition = 'decline';
            }
            this.model.jingleCall.end({
                condition: condition
            });
        }
        return false;
    },
    handleMuteClick: function (e) {
        return false;
    },
    resizeInput: _.throttle(function () {
        var height;
        var scrollHeight;
        var heightDiff;
        var newHeight;
        var newMargin;
        var marginDelta;
        var maxHeight = parseInt(this.$chatInput.css('max-height'), 10);

        this.$chatInput.removeAttr('style');
        height = this.$chatInput.outerHeight(),
        scrollHeight = this.$chatInput.get(0).scrollHeight,
        newHeight = Math.max(height, scrollHeight);
        heightDiff = height - this.$chatInput.innerHeight();

        if (newHeight > maxHeight) newHeight = maxHeight;
        if (newHeight > height) {
            this.$chatInput.css('height', newHeight+heightDiff);
            this.$chatInput.scrollTop(this.$chatInput[0].scrollHeight - this.$chatInput.height());
            newMargin = newHeight - height + heightDiff;
            marginDelta = newMargin - parseInt(this.$messageList.css('marginBottom'), 10);
            if (!!marginDelta) {
                this.$messageList.css('marginBottom', newMargin);
            }
        } else {
            this.$messageList.css('marginBottom', 0);
        }
    }, 300),
    connectionChange: function () {
        if (app.state.connected) {
            this.$chatInput.attr("disabled", false);
        } else {
            this.$chatInput.attr("disabled", "disabled");
        }
    }
});

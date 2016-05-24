/*global $, app, me, client*/
"use strict";

var _ = require('underscore');
var StayDown = require('staydown');
var BasePage = require('./base');
var templates = require('../templates');
var MUCRosterItem = require('../views/mucRosterItem');
var Message = require('../views/mucMessage');
var MessageModel = require('../models/message');
var embedIt = require('../helpers/embedIt');
var htmlify = require('../helpers/htmlify');
var tempSubject = '';

module.exports = BasePage.extend({
    template: templates.pages.groupchat,
    initialize: function (spec) {
        var self = this;
        this.editMode = false;

        this.listenTo(this, 'pageloaded', this.handlePageLoaded);
        this.listenTo(this, 'pageunloaded', this.handlePageUnloaded);

        this.listenTo(this.model.messages, 'change', this.refreshModel);
        this.listenTo(this.model.messages, 'reset', this.renderMessages);
        this.listenTo(this.model, 'refresh', this.renderMessages);

        app.state.bind('change:connected', this.connectionChange, this);

        this.render();
    },
    events: {
        'keydown textarea': 'handleKeyDown',
        'keyup textarea': 'handleKeyUp',
        'click .status': 'clickStatusChange',
        'blur .status': 'blurStatusChange',
        'keydown .status': 'keyDownStatusChange',
        'click #members_toggle': 'clickMembersToggle'
    },
    classBindings: {
        joined: '.controls'
    },
    textBindings: {
        displayName: 'header .name',
        subject: 'header .status',
        membersCount: '#members_toggle_count'
    },
    show: function (animation) {
        BasePage.prototype.show.apply(this, [animation]);
        client.sendMessage({
            type: 'groupchat',
            to: this.model.jid,
            chatState: 'active'
        });

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
        client.sendMessage({
            type: 'groupchat',
            to: this.model.jid,
            chatState: 'inactive'
        });
    },
    render: function () {
        if (this.rendered) return this;
        this.rendered = true;

        this.renderAndBind();
        this.$chatInput = this.$('.chatBox textarea');
        this.$chatInput.val(app.composing[this.model.jid] || '');
        this.$chatBox = this.$('.chatBox');
        this.$messageList = this.$('.messages');
        this.$autoComplete = this.$('.autoComplete');

        this.staydown = new StayDown(this.$messageList[0], 500);

        this.renderMessages();

        this.renderCollection(this.model.resources, MUCRosterItem, this.$('.groupRoster'));

        this.listenTo(this, 'rosterItemClicked', this.rosterItemSelected);
        this.listenTo(this.model.messages, 'add', this.handleChatAdded);
        this.listenTo(this.model.resources, 'add', this.handleResourceAdded);

        $(window).on('resize', _.bind(this.resizeInput, this));

        this.registerBindings();

        return this;
    },
    renderMessages: function () {
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
    handleChatAdded: function (model) {
        this.appendModel(model, true);
    },
    handleResourceAdded: function (model) {
        var xmppContact = me.getContact(model.id.split('/')[1]);
        if (xmppContact) {
            xmppContact.bind('change:avatar', this.handleAvatarChanged, this);
        }
    },
    handleAvatarChanged: function(contact, uri) {
        if (!me.isMe(contact.jid)) {
            $('.' + contact.jid.substr(0, contact.jid.indexOf('@')) + ' .messageAvatar img').attr('src', uri);
        }
    },
    handlePageLoaded: function () {
        this.staydown.checkdown();
        this.resizeInput();
    },
    handleKeyDown: function (e) {
        if ((e.which === 13 || e.which === 9) && !e.shiftKey) { // Enter or Tab
            if (this.$autoComplete.css('display') != 'none') {
                var nickname = this.$autoComplete.find(">:nth-child(" + this.autoCompletePos + ")>:first-child").text();
                this.rosterItemSelected(nickname);
            } else if (e.which === 13){
                app.composing[this.model.jid] = '';
                this.sendChat();
            }
            e.preventDefault();
            return false;
        } else if (e.which === 38) { // Up arrow

            if (this.$autoComplete.css('display') != 'none') {
                var count1 = this.$autoComplete.find(">li").length;
                var oldPos1 = this.autoCompletePos;
                this.autoCompletePos = (oldPos1 - 1) < 1 ? count1 : oldPos1 - 1;

                this.$autoComplete.find(">:nth-child(" + oldPos1 + ")").removeClass('selected');
                this.$autoComplete.find(">:nth-child(" + this.autoCompletePos + ")").addClass('selected');

            }
            else if (this.$chatInput.val() === '' && this.model.lastSentMessage) {
                this.editMode = true;
                this.$chatInput.addClass('editing');
                this.$chatInput.val(this.model.lastSentMessage.body);
            }
            e.preventDefault();
            return false;
        } else if (e.which === 40) { // Down arrow

            if (this.$autoComplete.css('display') != 'none') {
                var count2 = this.$autoComplete.find(">li").length;
                var oldPos2 = this.autoCompletePos;
                this.autoCompletePos = (oldPos2 + 1) > count2 ? 1 : oldPos2 + 1;

                this.$autoComplete.find(">:nth-child(" + oldPos2 + ")").removeClass('selected');
                this.$autoComplete.find(">:nth-child(" + this.autoCompletePos + ")").addClass('selected');
            }
            else if (this.editMode) {
                this.editMode = false;
                this.$chatInput.removeClass('editing');
            }
            e.preventDefault();
            return false;
        } else if (!e.ctrlKey && !e.metaKey) {
            if (!this.typing || this.paused) {
                this.typing = true;
                this.paused = false;
                client.sendMessage({
                    type: 'groupchat',
                    to: this.model.jid,
                    chatState: 'composing'
                });
            }
        }
    },
    handleKeyUp: function (e) {
        this.resizeInput();
        app.composing[this.model.jid] = this.$chatInput.val();
        if (this.typing && this.$chatInput.val().length === 0) {
            this.typing = false;
            this.paused = false;
            client.sendMessage({
                type: 'groupchat',
                to: this.model.jid,
                chatState: 'active'
            });
        } else if (this.typing) {
            this.pausedTyping();
        }

        if (([38, 40, 13]).indexOf(e.which) === -1) {
            var lastWord = this.$chatInput.val().split(' ').pop();
            if (lastWord.charAt(0) === '@') {
              var models = this.model.resources.search(lastWord.substr(1) || '', true, true);
              if (models.length) {
                this.renderCollection(models, MUCRosterItem, this.$autoComplete);
                this.autoCompletePos = 1;
                this.$autoComplete.find(">:nth-child(" + this.autoCompletePos + ")").addClass('selected');
                this.$autoComplete.show();
              }
              else
                this.$autoComplete.hide();
            }

            if (this.$autoComplete.css('display') != 'none') {
                if( lastWord ===  '') {
                    this.$autoComplete.hide();
                    return;
                }
            }
        }
    },
    rosterItemSelected: function (nickName) {
        if (nickName == me.nick)
            nickName = 'me';
        var val = this.$chatInput.val();
        var splited = val.split(' ');
        var length = splited.length-1;
        var lastWord = splited.pop();
        if (('@' + nickName).indexOf(lastWord) > -1)
            splited[length] = '@' + nickName + ' ';
        else
            splited.push('@' + nickName + ' ');
        this.$chatInput.val(splited.join(' '));
        this.$autoComplete.hide();
        this.$chatInput.focus();
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
    pausedTyping: _.debounce(function () {
        if (this.typing && !this.paused) {
            this.paused = true;
            client.sendMessage({
                type: 'groupchat',
                to: this.model.jid,
                chatState: 'paused'
            });
        }
    }, 3000),
    sendChat: function () {
        var message;
        var val = this.$chatInput.val();

        if (val) {
            this.staydown.intend_down = true;

            var links = _.map(htmlify.collectLinks(val), function (link) {
                return {url: link};
            });

            message = {
                to: this.model.jid,
                type: 'groupchat',
                body: val,
                chatState: 'active',
                oobURIs: links
            };
            if (this.editMode) {
                message.replace = this.model.lastSentMessage.mid || this.model.lastSentMessage.cid;
            }

            var id = client.sendMessage(message);
            message.mid = id;
            message.from = new app.JID(this.model.jid.bare + '/' + this.model.nick);

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
        this.$chatInput.removeClass('editing');
        this.$chatInput.val('');
    },
    clickStatusChange: function (e) {
        tempSubject = e.target.textContent;
    },
    blurStatusChange: function (e) {
        var subject = e.target.textContent;
        if (subject === '')
            subject = true;
        client.setSubject(this.model.jid, subject);
        e.target.textContent = tempSubject;
    },
    keyDownStatusChange: function (e) {
        if (e.which === 13 && !e.shiftKey) {
            e.target.blur();
            return false;
        }
    },
    clickMembersToggle: function (e) {
        var roster = $('.groupRoster');
        if (roster.css('visibility') == 'hidden')
            roster.css('visibility', 'visible');
        else
            roster.css('visibility', 'hidden');
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
                newEl.addClass(model.sender.getNickname(model.from.full));
                this.staydown.append(newEl[0]);
                this.lastModel = model;
            }
            if (!model.pending) embedIt(newEl);
        }
        else {
            var scrollDown = this.$messageList.prop('scrollHeight') - this.$messageList.scrollTop();
            var firstEl = this.$messageList.find('li').first();

            if (messageDay !== this.firstDate) {
                var dayDivider2 = $(templates.includes.dayDivider({day_name: messageDay}));
                firstEl.before(dayDivider2[0]);
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
                newEl.addClass(model.sender.getNickname(model.from.full));
                firstEl.after(newEl[0]);
                this.firstModel = model;
            }
            if (!model.pending) embedIt(newEl);

            this.$messageList.scrollTop(this.$messageList.prop('scrollHeight') - scrollDown);
            this.firstChanged = true;
        }
    },
    refreshModel: function (model) {
        var existing = this.$('#chat' + model.cid);
        existing.replaceWith(model.bareMessageTemplate(existing.prev().hasClass('message_header')));
    },
    connectionChange: function () {
        if (app.state.connected) {
            this.$chatInput.attr("disabled", false);
        } else {
            this.$chatInput.attr("disabled", "disabled");
        }
    }
});

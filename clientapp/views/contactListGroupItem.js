/*global $, app, me*/
"use strict";

var _ = require('underscore');
var HumanView = require('human-view');
var templates = require('../templates');
var ContactListItem = require('../views/contactListItem');

module.exports = HumanView.extend({
    template: templates.includes.contactListGroupItem,
    textBindings: {
        name: '.name'
    },
    render: function () {
        this.renderAndBind({contactgroup: this.model});

        this.renderCollection(this.model.contacts, ContactListItem, this.$(".group-entries"));

        return this;
    }
});

/*global app*/
"use strict";

var async = require('async');
var Contacts = require('./contacts');
var HumanModel = require('human-model');

module.exports = HumanModel.define({
    initialize: function (name) {
         this.name = name;
    },
    type: 'contactgroup',
    props: {
        name: ['string', false, '']
    },
    collections: {
        contacts: Contacts
    }
});

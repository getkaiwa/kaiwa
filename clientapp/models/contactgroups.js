/*global app*/
"use strict";

var BaseCollection = require('./baseCollection');
var ContactGroup = require('../models/contactgroup');


module.exports = BaseCollection.extend({
    type: 'contactgroups',
    model: ContactGroup,
    comparator: function (model1, model2) {

        var name1 = model1.name.toLowerCase();
        var name2 = model2.name.toLowerCase();

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
    }
});

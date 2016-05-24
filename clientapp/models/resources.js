/*global app, client, me, SERVER_CONFIG*/
"use strict";

var BaseCollection = require('./baseCollection');
var Resource = require('./resource');

module.exports = BaseCollection.extend({
    type: 'resources',
    model: Resource,
    comparator: function (res1, res2) {
        if (res1.priority > res2.priority) {
            return -1;
        }
        if (res1.priority < res2.priority) {
            return 1;
        }
        if (res1.show === res2.show) {
            if (!!res1.idleSince && !!res2.idleSince) {
                return 0;
            }
            if (res1.idleSince && !!res2.idleSince) {
                return 1;
            }
            return -1;

        }

        var ranking = {
            xa: 0,
            away: 1,
            '': 2,
            chat: 3,
            dnd: 3
        };
        var r1 = ranking[res1.show];
        var r2 = ranking[res2.show];

        if (r1 === r2) {
            return 0;
        }
        if (r1 > r2) {
            return -1;
        }
        return 1;
    },
    search : function (letters, removeMe, addAll) {
        if(letters === "" && !removeMe) return this;

        var collection = new module.exports(this.models);
        if (addAll)
            collection.add({id: this.parent.jid.bare + '/all'});

        var pattern = new RegExp('^' + letters + '.*$', "i");
        var filtered = collection.filter(function(data) {
            var nick = data.get("mucDisplayName");
            if (nick === me.nick) return false;
            return pattern.test(nick);
        });
        return new module.exports(filtered);
    }
});

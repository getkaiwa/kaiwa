"use strict";

// SCHEMA
//    jid: 'string',
//    ver: 'string'


function RosterVerStorage(storage) {
    this.storage = storage;
}

RosterVerStorage.prototype = {
    constructor: {
        value: RosterVerStorage
    },
    setup: function (db) {
        if (db.objectStoreNames.contains('rosterver')) {
            db.deleteObjectStore('rosterver');
        }
        db.createObjectStore('rosterver', {
            keyPath: 'jid'
        });
    },
    transaction: function (mode) {
        var trans = this.storage.db.transaction('rosterver', mode);
        return trans.objectStore('rosterver');
    },
    set: function (jid, ver, cb) {
        cb = cb || function () {};
        var data = {
            jid: jid,
            ver: ver
        };
        var request = this.transaction('readwrite').put(data);
        request.onsuccess = function () {
            cb(false, data);
        };
        request.onerror = cb;
    },
    get: function (jid, cb) {
        cb = cb || function () {};
        if (!jid) {
            return cb('not-found');
        }
        var request = this.transaction('readonly').get(jid);
        request.onsuccess = function (e) {
            var res = request.result;
            if (res === undefined) {
                return cb('not-found');
            }
            cb(false, request.result);
        };
        request.onerror = cb;
    },
    remove: function (jid, cb) {
        cb = cb || function () {};
        var request = this.transaction('readwrite')['delete'](jid);
        request.onsuccess = function (e) {
            cb(false, request.result);
        };
        request.onerror = cb;
    }
};


module.exports = RosterVerStorage;

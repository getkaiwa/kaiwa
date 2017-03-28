/*global IDBKeyRange*/
"use strict";

// SCHEMA
//    jid: string
//    name: string
//    subscription: string
//    groups: array
//    rosterID: string


function RosterStorage(storage) {
    this.storage = storage;
}

RosterStorage.prototype = {
    constructor: {
        value: RosterStorage
    },
    setup: function (db) {
        if (db.objectStoreNames.contains('roster')) {
            db.deleteObjectStore('roster');
        }
        var store = db.createObjectStore('roster', {
            keyPath: 'storageId'
        });
        store.createIndex("owner", "owner", {unique: false});
    },
    transaction: function (mode) {
        var trans = this.storage.db.transaction('roster', mode);
        return trans.objectStore('roster');
    },
    add: function (contact, cb) {
        cb = cb || function () {};
        var request = this.transaction('readwrite').put(contact);
        request.onsuccess = function () {
            cb(false, contact);
        };
        request.onerror = cb;
    },
    get: function (id, cb) {
        cb = cb || function () {};
        if (!id) {
            return cb('not-found');
        }
        var request = this.transaction('readonly').get(id);
        request.onsuccess = function (e) {
            var res = request.result;
            if (res === undefined) {
                return cb('not-found');
            }
            cb(false, request.result);
        };
        request.onerror = cb;
    },
    getAll: function (owner, cb) {
        cb = cb || function () {};
        var results = [];

        var store = this.transaction('readonly');
        var request = store.index('owner').openCursor(IDBKeyRange.only(owner));
        request.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                cb(false, results);
            }
        };
        request.onerror = cb;
    },
    remove: function (id, cb) {
        cb = cb || function () {};
        var request = this.transaction('readwrite')['delete'](id);
        request.onsuccess = function (e) {
            cb(false, request.result);
        };
        request.onerror = cb;
    },
    clear: function (cb) {
        cb = cb || function () {};
        var request = this.transaction('readwrite').clear();
        request.onsuccess = function () {
            cb(false, request.result);
        };
        request.onerror = cb;
    }
};


module.exports = RosterStorage;

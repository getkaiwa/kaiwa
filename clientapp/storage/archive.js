/*global IDBKeyRange*/
"use strict";

function ArchiveStorage(storage) {
    this.storage = storage;
}

ArchiveStorage.prototype = {
    constructor: {
        value: ArchiveStorage
    },
    setup: function (db) {
        if (db.objectStoreNames.contains('archive')) {
            db.deleteObjectStore('archive');
        }
        var store = db.createObjectStore('archive', {
            keyPath: 'archivedId'
        });
        store.createIndex("owner", "owner", {unique: false});
    },
    transaction: function (mode) {
        var trans = this.storage.db.transaction('archive', mode);
        return trans.objectStore('archive');
    },
    add: function (message, cb) {
        cb = cb || function () {};
        var request = this.transaction('readwrite').put(message);
        request.onsuccess = function () {
            cb(false, message);
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
            request.result.acked = true;
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
                cursor.value.acked = true;
                results.push(cursor.value);
                cursor.continue();
            } else {
                cb(false, results);
            }
        };
        request.onerror = cb;
    },
 
};


module.exports = ArchiveStorage;

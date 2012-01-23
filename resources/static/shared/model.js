/*globals BrowserID: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

BrowserID.Models = {};
BrowserID.Model = (function() {
  "use strict";

  var bid = BrowserID,
      storage = bid.Storage;

  var Model = bid.Class({
    init: function(config) {
      config = config || {};

      var self=this,
          storageKey = config.storage_key;

      self.storageKey = storageKey;

      if(config.data) {
        self.data = config.data;
      }
      else if(storageKey) {
        self.data = storage.get(storageKey);
      }

      self.data = self.data || {};
    },

    destroy: function() {
      this.data = null;
    },

    /**
     * Set a bit of data with the model
     * @method set
     * @param {string} name
     * @param {variant} value
     */
    set: function(name, value) {
      this.data[name] = value;
    },

    /**
     * Get a bit of data from the model
     * @method get
     * @param {string} name
     */
    get: function(name) {
      return this.data[name];
    },

    /**
     * Save the model to the backing store
     * @method save
     */
    save: function() {
      var self=this,
          storageKey = self.storageKey;

      if(storageKey) {
        storage.set(storageKey, self.data);
      }
      else {
        throw "cannot save model without backing store";
      }
    },

    /**
     * Remove a bit of data from the model.
     * @method remove
     * @param {string} name
     */
    remove: function(name) {
      var self=this;

      if(self.data.hasOwnProperty(name)) {
        self.data[name] = null;
        delete self.data[name];
      }
    },

    /**
     * Get a copy of the data in a hash.
     * @method toObject
     * @returns {object}
     */
    toObject: function() {
      return this.data;
    },

    /**
     * Get a list of the keys in the data object
     * @method keys
     * @returns {array of strings}
     */
    keys: function() {
      return Object.keys(this.data);
    }
  });

  return Model;

}());


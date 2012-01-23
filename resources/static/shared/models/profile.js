/*globals BrowserID: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

BrowserID.Models.Profile = (function() {
  var bid = BrowserID,
      sc;

  var Model = bid.Model.extend({
    init: function(config) {
      config.storage_key = "profile";

      sc.init.call(this, config);
    }
  });

  sc = Model.sc;

  return Model;
}());


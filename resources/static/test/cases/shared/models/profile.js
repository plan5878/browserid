/*globals BrowserID: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  "use strict";

  var bid = BrowserID,
      Profile = bid.Models.Profile,
      testHelpers = bid.TestHelpers,
      model;

  module("shared/models/profile", {
    setup: function() {
      model = Profile.create({});
    },

    teardown: function() {
      model.destroy();
    }
  });

  test("can create", function() {
    ok(model, "model created");
  });

}());


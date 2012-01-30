/*jshint browsers:true, forin: true, laxbreak: true */
/*global test: true, start: true, stop: true, module: true, ok: true, equal: true, BrowserID:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var controller,
      el = $("body"),
      bid = BrowserID,
      register = bid.TestHelpers.register;

  function createController(options) {
    controller = bid.Modules.XXX_MODULE_NAME.create();
    controller.start(options);
  }

  module("controllers/XXX_module_name", {
    setup: function() {
    },

    teardown: function() {

    }
  );



}());

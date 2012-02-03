/*jshint browsers:true, forin: true, laxbreak: true */
/*global test: true, start: true, stop: true, module: true, ok: true, equal: true, BrowserID:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";
  var controller,
      bid = BrowserID,
      xhr = bid.Mocks.xhr,
      network = bid.Network,
      testHelpers = bid.TestHelpers,
      register = testHelpers.register;

  function createController(verifier, message) {
    controller = bid.Modules.ConvertAccount.create();
    controller.start({ });
  }

  module("controllers/convert_account", {
    setup: function() {
      testHelpers.setup();
    },

    teardown: function() {
      testHelpers.teardown();
      if (controller) {
        try {
          // Controller may have already destroyed itself.
          controller.destroy();
        } catch(e) {}
      }
    }
  });

  test("shows full screen", function() {
    createController();

    ok($("body").hasClass("fullscreen"), true, "body shows fullscreen");
  });

  asyncTest("submit happy case - trigger 'new_user' message with email and password", function() {
    createController();

    $("#email").val("testuser@testuser.com");
    $("#password").val("password");

    register("new_user", function(msg, info) {
      equal(info.email, "testuser@testuser.com", "correct email");
      equal(info.password, "password", "correct password");
      start();
    });

    controller.submit(function(status) {
      equal(status, true, "correct status");
    });
  });

  asyncTest("learnMore - show the learn more screen", function() {
    createController();

    controller.learnMore(function() {
      start();
    });
  });

}());

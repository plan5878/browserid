/*jshint browsers:true, forin: true, laxbreak: true */
/*global test: true, start: true, module: true, ok: true, equal: true, BrowserID:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var bid = BrowserID,
      network = bid.Network,
      storage = bid.Storage,
      xhr = bid.Mocks.xhr,
      WindowMock = bid.Mocks.WindowMock,
      testHelpers = bid.TestHelpers,
      validToken = true,
      controller,
      config = {
        token: "token"
      },
      winMock;

  module("pages/verify_email_address", {
    setup: function() {
      testHelpers.setup();
      bid.Renderer.render("#page_head", "site/verify_email_address", {});
      $(".siteinfo,.password_entry,#congrats,#cannotcomplete").hide();
    },
    teardown: function() {
      testHelpers.teardown();
    }
  });

  function createController(options, callback) {
    winMock = new WindowMock();
    controller = BrowserID.verifyEmailAddress.create();
    options = options || {};
    options.window = winMock;
    options.document = winMock.document;
    options.ready = callback;
    controller.start(options);
  }

  asyncTest("verifyEmailAddress with good token and sit to redirect to - immediately submit, redirect user", function() {
    localStorage.redirectTo = "http://redirect.to";
    storage.setStagedOnBehalfOf("browserid.org");

    createController({ token: "token" }, function() {
      equal(winMock.document.location, "http://redirect.to");
      start();
    });
  });

  asyncTest("verifyEmailAddress with bad token", function() {
    xhr.useResult("invalid");

    createController({ token: "token" }, function() {
      ok($("#cannotconfirm").is(":visible"), "cannot confirm box is visible");
      start();
    });
  });

  asyncTest("verifyEmailAddress with emailForVerficationToken XHR failure", function() {
    xhr.useResult("ajaxError");
    createController({ token: "token" }, function() {
      testHelpers.testErrorVisible();
      start();
    });
  });

  /*
  asyncTest("submit with good token, missing password", function() {
    createController({ token: "token" }, function() {
      $("#password").val("");
      $("#vpassword").val("password");

      controller.submit(function() {
        equal($("#congrats").is(":visible"), false, "congrats is not visible, missing password");
        start();
      });
    });
  });

  asyncTest("submit with good token, missing verification password", function() {
    bid.verifyEmailAddress("token");

    $("#password").val("password");
    $("#vpassword").val("");

    createController({ token: "token" }, function() {
      controller.submit(function() {
        equal($("#congrats").is(":visible"), false, "congrats is not visible, missing verification password");
        start();
      });
    });
  });

  asyncTest("submit with good token, different passwords", function() {
    createController({ token: "token" }, function() {
      $("#password").val("password");
      $("#vpassword").val("pass");

      controller.submit(function() {
        equal($("#congrats").is(":visible"), false, "congrats is not visible, different passwords");
        start();
      });
    });
  });
*/
  asyncTest("submit with good token, both passwords, no redirect - show congrats", function() {
    createController({ token: "token" }, function() {
      $("#password").val("password");
      $("#vpassword").val("password");

      controller.submit(function() {
        equal($("#congrats").is(":visible"), true, "congrats is visible, we are complete");
        start();
      });
    });
  });

  asyncTest("submit with good token, both passwords, with redirect - set document.location", function() {
    localStorage.redirectTo = "redirect_url";
    createController({ token: "token" }, function() {
      $("#password").val("password");
      $("#vpassword").val("password");

      controller.submit(function() {
        equal(winMock.document.location, "redirect_url", "document redirected to redirect_url");
        equal(localStorage.redirectTo, null, "redirectTo has been cleared");
        start();
      });
    });
  });


}());

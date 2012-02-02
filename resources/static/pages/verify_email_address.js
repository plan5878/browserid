/*globals BrowserID: true, $:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

BrowserID.verifyEmailAddress = (function() {
  "use strict";

  var bid = BrowserID,
      dom = bid.DOM,
      network = bid.Network,
      errors = bid.Errors,
      pageHelpers = bid.PageHelpers,
      helpers = bid.Helpers,
      complete = helpers.complete,
      win = window,
      doc = document,
      token,
      redirectTo,
      sc;

  function showSiteInfo() {
    $(".siteinfo").hide();
    var staged = bid.Storage.getStagedOnBehalfOf();
    if (staged) {
      dom.setInner('.website', staged);
      $('.siteinfo').show();
    }
  }

  function showEmailAddress(oncomplete) {
    network.emailForVerificationToken(token, function(info) {
      if (info) {
        dom.setInner('#email', info.email);
        complete(oncomplete);
      }
      else {
        pageHelpers.replaceFormWithNotice("#cannotconfirm", oncomplete);
      }
    }, pageHelpers.getFailure(errors.completeUserRegistration, oncomplete));
  }

  function submit(oncomplete) {
    var pass = localStorage.NEW_ACCOUNT_PASSWORD;

    network.completeUserRegistration(token, pass, function(registered) {
      // XXX How can we get this localStorage stuff out of here?
      localStorage.removeItem("NEW_ACCOUNT_PASSWORD");
      if (redirectTo && registered) {
        localStorage.removeItem("redirectTo");
        win.alert("You are now registered with BrowserID, but the original site you tried signing into is closed.  You will now be redirected to the site and will have to sign in again.");
        doc.location = redirectTo;
        complete(oncomplete);
      }
      else {
        var selector = registered ? "#congrats" : "#cannotcomplete";
        pageHelpers.replaceFormWithNotice(selector, oncomplete);
      }
    }, pageHelpers.getFailure(errors.completeUserRegistration, oncomplete));
  }

  var Module = bid.Modules.PageModule.extend({
    start: function(options) {
      var self=this;

      self.checkRequired(options, "token");

      token = options.token;
      doc = options.document || window.document;
      win = options.window || window;

      // Save this off early because if the user is not logged in, the storage
      // info will be cleared by time they hit submit.
      redirectTo = localStorage.redirectTo;

      sc.start.call(self, options);

      showSiteInfo();
      showEmailAddress();
      self.submit(options.ready);
    },

    submit: submit
  });

  sc = Module.sc;

  return Module;

}());

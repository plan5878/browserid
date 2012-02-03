/*jshint browser:true, jQuery: true, forin: true, laxbreak:true */
/*global _: true, BrowserID: true, PageController: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
BrowserID.Modules.ConvertAccount = (function() {
  "use strict";

  var bid = BrowserID,
      dom = bid.DOM,
      helpers = bid.Helpers,
      complete = helpers.complete,
      cancelEvent = helpers.cancelEvent,
      sc;

  function submit(callback) {
    var email = helpers.getAndValidateEmail("#email"),
        password = dom.getInner("#password"),
        // XXX Move this passwordAndValidationPassword into a helper function.
        valid = !!(email && bid.Validation.passwordAndValidationPassword(password, password));

    if(valid) {
      this.close("new_user", { email: email, password: password });
      bid.Screens.fullscreen.hide();
    }

    complete(callback, valid);
  }

  function learnMore(callback) {
    dom.addClass("body", "about");
    complete(callback);
  }

  var Module = bid.Modules.PageModule.extend({
    start: function(options) {
      var self=this;

      self.hideWait();
      self.hideError();
      self.hideDelay();
      bid.Screens.fullscreen.show("convert_account");

      sc.start.call(self, options);

      self.bind("#learn_more", "click", cancelEvent(learnMore));
    },

    submit: submit,
    learnMore: learnMore
  });

  sc = Module.sc;

  return Module;

}());

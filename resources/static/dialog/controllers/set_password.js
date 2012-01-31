/*jshint browser:true, jQuery: true, forin: true, laxbreak:true */
/*global _: true, BrowserID: true, PageController: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
BrowserID.Modules.SetPassword = (function() {
  "use strict";
  var bid = BrowserID,
      dom = bid.DOM,
      complete = bid.Helpers.complete,
      cancelEvent = bid.Helpers.cancelEvent,
      sc;

  function submit(callback) {
    var pass = dom.getInner("#password"),
        vpass = dom.getInner("#vpassword");

    var valid = bid.Validation.passwordAndValidationPassword(pass, vpass);
    if(valid) {
      localStorage.NEW_ACCOUNT_PASSWORD = pass;
      this.close("password_set", { password: pass });
    }

    complete(callback, valid);
  }

  function cancel() {
    this.close("cancel_state");
  }

  var Module = bid.Modules.PageModule.extend({
    start: function(options) {
      var self=this;

      self.renderDialog("set_password");

      self.bind("#cancel", "click", cancelEvent(cancel));

      sc.start.call(self, options);
    },

    submit: submit
  });

  sc = Module.sc;

  return Module;
}());

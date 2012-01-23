/*jshint browser:true, jQuery: true, forin: true, laxbreak:true */
/*global BrowserID:true, PageController: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
BrowserID.Modules = BrowserID.Modules || {};
BrowserID.Modules.Profile = (function() {
  "use strict";

  var bid = BrowserID,
      Module = bid.Module,
      dom = bid.DOM,
      sc;

  // Try and generalize this into a form.
  function getSelector(key) {
    return "[name=" + key + "]";
  }

  function useSrc(key) {
    return key === "photo";
  }

  function saveFormData() {
    var model = this.model;

    model.keys().forEach(function(key) {
      if(useSrc(key)) {
        model.set(key, dom.getAttr(getSelector(key), "src"));
      }
      else {
        model.set(key, dom.getInner(getSelector(key)));
      }
    });

    model.save();
  }

  function getFormData() {
    var model = this.model,
        formData = {};

    model.keys().forEach(function(key) {
      var checked = !!dom.getAttr("input[for=" + key + "]", "checked");
      if(checked) {
        if(useSrc(key)) {
          formData[key] = dom.getAttr(getSelector(key), "src");
        }
        else {
          formData[key] = dom.getInner(getSelector(key));
        }
      }
    });

    return formData;
  }

  function submit() {
    var self=this,
        formData = getFormData.call(self);

    saveFormData.call(self);
    self.publish("profile_ready", formData);
  }

  function setPhoto(uri) {
    dom.setAttr("#photo", "src", uri);
    var model = this.model;
    model.set("photo", uri);
  }

  var Module = bid.Modules.PageModule.extend({
    start: function(config) {
      var self=this;
      self.checkRequired(config, "model", "uploader");

      self.model = config.model;
      self.uploader = config.uploader;

      sc.start.call(self, config);

      self.renderDialog("profile", config.model.toObject());

      // XXX can we get this uploader stuff out of here?  Since it is its own
      // module, can we make it so that both the profile and the photo uploader
      // are started when we need to show the profile?
      self.uploader.start({
        onchange: setPhoto.bind(self)
      });
    },

    stop: function() {
      var self=this;

      sc.stop.call(self);
      self.uploader.stop();
    },

    submit: submit

    // BEGIN TESTING API
    ,
    setPhoto: setPhoto
    // END TESTING API
  });

  sc = Module.sc;

  return Module;
}());

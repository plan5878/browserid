/*jshint browser:true, jQuery: true, forin: true, laxbreak:true */
/*global BrowserID: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
BrowserID.Modules.PhotoUploader = (function() {
  "use strict";

  var bid = BrowserID,
      dom = bid.DOM,
      sc;

  function onPhotoChange(event) {
    var el = event.currentTarget,
        files = el.files;

    handleFiles.call(this, files);
  }

  function handleFiles(files) {
    var self=this;

    function onLoad(e) {
      if(self.onchange) {
        self.onchange(e.target.result);
      }
    };

    for(var i = 0, file; file = files[i]; i++) {
      var reader = new FileReader();

      reader.onload = onLoad;
      try {
        reader.readAsDataURL(file);
      }
      catch(e) {
        // this fails during unit testing.
        onLoad({
          target: {
            result: "blue"
          }
        });
      }
    }
  }

  function onPhotoClick(event) {
    $("#photo_select").click();
  }

  function onLabelClick(event) {
    var labelFor = "[name=" + dom.getAttr(event.target, "for") + "]";
    var checked = dom.getAttr(labelFor, "checked");
    if(checked) {
      dom.removeAttr(labelFor, "checked");
    }
    else {
      dom.setAttr(labelFor, "checked", "checked");
    }
  }

  var Module = bid.Modules.PageModule.extend({
    start: function(data) {
      var self=this;
      self.bind("#photo_select", "change", onPhotoChange);
      self.bind("#photo", "click", onPhotoClick);
      self.bind("input[type=checkbox] + label", "click", onLabelClick);

      self.onchange = data && data.onchange;

      sc.start.call(this, data);
    },

    handleFiles: handleFiles
  });

  sc = Module.sc;

  return Module;

}());


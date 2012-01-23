(function() {
  "use strict";

  var bid = BrowserID,
      testHelpers = bid.TestHelpers,
      storage = bid.Storage,
      Model = bid.Model,
      model;

  module("shared/model", {
    setup: function() {
      model = Model.create({});
      testHelpers.setup();
    },

    teardown: function() {
      if(model) model.destroy();
      testHelpers.teardown();
    }
  });

  test("operations without backing store.", function() {
    model.set("name", "value");

    equal(model.get("name"), "value", "value correctly retreived");

    model.remove("name");
    equal(typeof model.get("name"), "undefined", "removing item returns undefined");

    var error;
    try {
      model.save();
    }
    catch(e) {
      error = e;
    }

    equal(error, "cannot save model without backing store", "Correct error thrown");
  });

  test("operations with backing store: must call save to save data updates", function() {
    storage.set("model", { name: "stored_value" });
    model = Model.create({
      storage_key: "model"
    });

    equal(model.get("name"), "stored_value", "model loaded from storage");
    model.remove("name");
    model.save();

    var model2 = Model.create({
      storage_key: "model"
    });
    equal(typeof model2.get("name"), "undefined", "remove removes data from storage");

    model2.destroy();
  });

  test("keys returns data keys", function() {
    model.set("field1", "value1");

    var keys = model.keys();
    equal(keys.length, 1, "keys returns an array with each key name");
  });

  test("toObject returns the data object", function() {
    model.set("field1", "value1");

    var data = model.toObject();
    equal(data.field1, "value1", "data retreived");
  });

}());



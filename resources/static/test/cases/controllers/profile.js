/*jshint browsers:true, forin: true, laxbreak: true */
/*global test: true, start: true, stop: true, module: true, ok: true, equal: true, BrowserID:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var bid = BrowserID,
      testHelpers = bid.TestHelpers,
      ProfileModel = bid.Models.Profile,
      ProfileModule = bid.Modules.Profile,
      mediator = bid.Mediator,
      model,
      profileModule,
      imgURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAPCAYAAABzyUiPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACQNJREFUeNrcWGlwU9cV1mJtlmTLkpF3bCF5keQNEtvIDsVZaIAWYwOpk9KWtEOaSdtM0sykM/zpMm0nIb9oOyFtpokhywBxAAMx4MQsQ6eDcQGDbWzj3VJkwItkSZa8Su53HveZV+JOKH86kzvz+T3d99695373nO+ca/FHH+7/WCQSlQAyQA6EAS9wAdiz/Qc/6hGx9vFHH4i+Ia0aeAkQAwusb4H9Fjb++ZvAaXDxlYGigHyxSGxeWByHaylALvBi86Wm/OKS1R2ib1bbDqz9H95fa7FkbsL1s6UIHCfykpNTmvILCpqmQlPK0bHRhJtdnRvD4bBiZOROHd55BAh8dVzx4uaJxWLRwsLC19gh3PD/axulP/Hx8W16vcHl9/uX3b59qyhWp+sxGo09dy0Vi+bn52UTE95Uj8dj7R/oPxwTG5tntdq67yeQa2qN2mMwxDeIDKKLqWlpqi9dzt9j4J2BQCAdjysQvhdxLQCOsu9+BTL6cT0IxIA82tU4oAU4xYZNAixACLgiIO9RQAJcBeZZH82TyOSDjMwGngNMQDtwArh53w6UA6WABzgG3GL9cUyW2gA38BNmx2+BWf7j9AxTa06O9Wh7e5sEBH6SYEzoLiouOYBHPYKwlp84XvcWuCjtuNH+DxCYgb4pfgwJfyOVSMPMEB9wGx/oqF+n0/WyxTUBR7Ra7V9wnQT+aDQmlKSlpf2UGbmX+oCTUVFRRKIKsJKWSiSSWuhHMpsqB/gXcEmj1b6Gft4GIrMpPn5ZkcFg2Ij7LuA3AAnPW0BndHT0z/E+uXECcBg4x+Z8h2xQKBQviu9Gxcu0iTKZ7JBUKt2H+/eAXd+rfrYc30v5NQcnJ7W4XL9+rYWLrumZaTVtHpwlALwGaIB/gotyrGFqenraeKzuaIvQAxcJHBkZMZ8921iOD54H/oyubXK53FX++BPHcU8k9tF78MhfwChPRobpC5vNrnC5XH9DtyY3N+/gmm+tfTcmJmYArl+IxbYCTvomEolkYPLn2FRb+TmjVdEk5isZ0XqJVDqzatUjxePj40foeVZW9snKyi27VztKaxAdNwoLVxWyKPg7sEWlUnXQnPQeRd3MzMxfN2z8joMEn76fm5srgwztQGg2OBxl78tk8tIlNCTmvt9qlgOqsf4PQDhFwBzWwEXV5GQgu+H0qc+FIcwN6PGM23DZLRzJtMJ8TaWKdrHw2MHNFhMzuKmicj+F2vFjdWv5voLClRRen0JLf/fJoQP9oVDIkpWd/Xpvb++ZSDj8pNv9pQ3GyLA52/jxp6ZCBmYst5HQn9bZudkIbhX022qztas1msNmjaXdbLYsQ1dxW1sredB36XnVlm210N7B5cvTGzD+O8FgcHN/f98uXVzczya8XtLlCMjft2KF2XVXQkTXMX/kATQyxEWlVEp2UDS8zaKMa2Njo+tOnaw/hM2qXtRAIgEh2QWmpdhJNQwqRSLZBC2crazaupcnOiUl9TouAzCESHydE5w4/SDra2fDnQU2RMKR5RDqhpE7d570er1GpomFCN2O8HxYz/RVz+uSUqEMJCUmNeL2Vfp9sr7+pXAkHIcNoOxHkUAevZO3ubn5UnFfb48b+vttftEeryclOSl5DREIj/ODvCF018A210Mkm4jAY+XCB/D+NFyeWiQQ2tNTstpxkAm19Ny5M88Mu92vYFe3Dg0N7uRDeHZ2VolLKxswltMBiYT0c1Awvp/+IJQVNqu9HQSK/L4JI7SGwkuUmJjknJmebnG5nNsRElZe/KPVah/COADPeRWk7JmbmyWNeoGAOZzYXIqS2/wkvT3dG2ijhAtD2KoUSmXivRwg8j0EeRr6Aw0NCgjM5R8aExKuQtoojCWLBJLXMa2jZCECeZR1X+Fy/uhoBQbrg3EYbYFUWskKbtp1DbxEyn6LhLsF3dOmpKaSEaGxsfEcfF/FpeakJKdYLKkjAq9euewAYWIqgZDhKHH4cP8nm90+gfvKgN9vcA8PF8MLyZsbfT7fH8gOWpg9N+9olFQ6v3CvQBLH6eIgoWMGQd0kfgjP60Sy3P1oUQkRGWTklXLMarXOdeuePsEk4fNFApHBiIxowSDrF9mQyWbgsjHMcN6wMEv3xuBkMF5YEqHlMQ2h0CQvqoU37fB4vZupH5pFHneN1ux2ux0gLApa26NUKun9Tnqn48aN/dDML3C7DKG6vqf75puQgYLcvHw7PJmzobBwZSsrq+YERaa4peXqYw/CEvSVr20HmYQE2W9XxeaqNxhxFJGXaVy5XOGpqKiswf0QK6vuLRq7Zjp7pvHxW7eGl1NEA7/mrIRzWDKzkAt6cpawYQ9Q5p3wZrqcThtKiPPw0F+ymkuELH2FLY7KjR3wIqVGoxlkx0Ii8QjCksvKGSYTnXac6Cejn6dMivsGCgaAIx4L8CHbi5FIWjDWytOn6p+Bu9WwsKZs/iw7dl17EAL7+nqLuro6f0hOQL+x9tz6z058H7dPsGRDHkgnkHTwMP/0+g3v4Uql3j5hFjZxQuHzmYFd/1HjoKxwOEo/RDkyhZbPaeDMrNBLP0VoN8EzV1+4cP5tlq3uumB+QS20wsN2L1ugH91sB6ld5Msaq9XayWrBalbHvSwQci5L2+12SjA+kPdjLOQyyLPTWFT78UdRhP4w2gVKItDr2P/CHWV0Ed7JomqJ72RJ7YWlPigrW1ODROtnNeWCkMB3UbhWQZPkvF6AlKk4vd6N+qpbDWFHF/0XYVqv128DAUPCUAd5DpxcDng9njWouZRKlWrMlGFqsdlzyfVrsZMciciIVITnWMyZXSwsqJ2HNJxDjSdDCM+w8H0DIR4JTAa2hIJBI6RRglPScKYl83JmVvYAnlNY9+Fs6vD5fXsnA4FUeHEUJvaaLZZmnCzUoWDIgP5aVBWUKXVL8HFQo9GmRMmi1F9z6OQutJ70jAyKhBqmiffeY+fXNSxshYI7xcKHFjvNbwRz93bBcYdvJLI2lmDGmTfdFDyXslCkayM7slGjE8pj7BTUyEsy8wwbm0/CMjWdYAYEY+rYtynMGWjMZpYMKRM72DpOL8FRnjCzPkC7fz1c+7cAAwCB4rgcEmoe7AAAAABJRU5ErkJggg==";

  var imgURI2 = "https://diresworb.org/i/icon.png";

  module("controllers/profile", {
    setup: function() {
      testHelpers.setup();

      $("#formModule input").val("");
      $("#profile_photo").attr("src", "");
      $("input[type=checkbox]").attr("checked", "checked");

      model = ProfileModel.create({
        data: {
          name: "John Bravo",
          photo: imgURI
        }
      });

      profileModule = ProfileModule.create({
        target: "#formModule"
      });
      profileModule.start({
        model: model
      });
    },

    teardown: function() {
      testHelpers.teardown();
      profileModule.destroy();
    }
  });


  test("profile module start fills in data", function() {
    equal($("input[name=name]").val(), "John Bravo", "input filled in after start");
    equal($("img[name=photo]").attr("src"), imgURI, "on startup, image URI set correctly");
  });

  asyncTest("data is saved on submit.  Submit raises message", function() {
    $("input[name=name]").val("Johnny Bravo");
    $("img[name=photo]").attr("src", imgURI2);

    equal(model.get("name"), "John Bravo", "model not updated until submit");

    mediator.subscribe("profile_ready", function(msg, data) {
      equal(model.get("name"), "Johnny Bravo", "name updated on submit");
      equal(model.get("photo"), imgURI2, "photo updated on submit");

      equal(data.name, "Johnny Bravo", "data name passed correctly");

      start();
    });
    profileModule.submit();
  });

  test("stop works", function() {
    profileModule.stop();

    // this should have no effect on the element after stop
    model.set("name", "Johnny Bravo");
    equal($("input[name=name]").val(), "John Bravo", "after stop, changes to the model do not effect fields");
  });

  test("setPhoto", function() {
    profileModule.setPhoto(imgURI);

    equal($("#photo").attr("src"), imgURI, "image URI is set");
    equal(model.get("photo"), imgURI, "model correctly updated");
  });


}());



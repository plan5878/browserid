const        path = require('path'),
              url = require('url'),
            wsapi = require('./wsapi.js'),
        httputils = require('./httputils.js'),
          connect = require('connect'),
        webfinger = require('./webfinger.js'),
         sessions = require('cookie-sessions'); 

const STATIC_DIR = path.join(path.dirname(__dirname), "static");

exports.handler = function(request, response, serveFile) {
  // dispatch!
  var urlpath = url.parse(request.url).pathname;

  if (urlpath === '/sign_in') {
    serveFile(path.join(STATIC_DIR, "dialog", "index.html"), response);
  } else if (/^\/wsapi\/\w+$/.test(urlpath)) {
    try {
      var method = path.basename(urlpath);
      wsapi[method](request, response);
    } catch(e) {
      var errMsg = "oops, error executing wsapi method: " + method + " (" + e.toString() +")";
      console.log(errMsg);
      httputils.fourOhFour(response, errMsg);
    }
  } else if (/^\/users\/[^\/]+.xml$/.test(urlpath)) {
    var identity = path.basename(urlpath).replace(/.xml$/, '').replace(/^acct:/, '');

    webfinger.renderUserPage(identity, function (resultDocument) {
      if (resultDocument === undefined) {
        httputils.fourOhFour(response, "I don't know anything about: " + identity + "\n");
      } else {
        httputils.xmlResponse(response, resultDocument);
      }
    });
  } else {
    // node.js takes care of sanitizing the request path
    serveFile(path.join(STATIC_DIR, urlpath), response);
  }
};

exports.setup = function(server) {
  var week = (7 * 24 * 60 * 60 * 1000);
  server.use(sessions({
      secret: 'v3wy s3kr3t',
      session_key: "browserid_state",
      path: '/'
  }));
}

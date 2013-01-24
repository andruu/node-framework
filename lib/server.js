require('sugar');
require('phpjs').registerGlobals();

var http          = require('http'),
    qs            = require('qs'),
    url           = require('url'),
    path          = require('path'),
    Cookies       = require('cookies'),
    util          = require('util'),
    Log           = require('log'),
    log           = new Log('info'),
    accepts_types = require('./objects').accepts_types;

function start (router, port, renderer) {

  function requestListener (request, response) {

    var postData = '';
    request.setEncoding("utf8");

    request.addListener('data', function (postDataChunk) {
      postData += postDataChunk;
    });

    request.addListener('end', function () {
      request.params = Object.extended({});
      request.accepts = request.headers.accept.split(',').remove(/\*\/\*/);
      request.postData = postData;
      request.pathname = url.parse(request.url).pathname;
      request.format = path.extname(request.pathname).remove('.');

      if (request.pathname != '/' && request.pathname.endsWith('/')) {
        request.pathname = request.pathname.slice(0, -1);
      }

      // Set querystring parameters
      var querystring = Object.extended(qs.parse(url.parse(request.url).query));
      querystring.each(function (key, value) {
        request.params[key] = value;
      });

      // Set post data parameters
      var poststring = Object.extended(qs.parse(postData));
      poststring.each(function (key, value) {
        request.params[key] = value;
      });

      response.render = function (view, locals) {
        renderer.render(view, request, response, locals);
      };

      response.renderStatic = function (path) {
        return renderer.renderStatic(path, request, response);
      };

      // Format (responds_to)
      response.format = function (object) {
        var type;
        object = Object.extended(object);
        accepts_types.merge(array_flip(accepts_types));
        object.keys().each(function (key) {
          if (key.match(/\//)) {
            type = key;
          } else {
            type = accepts_types[key];
          }
          request.accepts.each(function (accept) {
            type.split(',').each(function(_type) {
              if (accept.has(_type.trim())) {
                return object[key]();
              }
            });
          });
        });
      };

      response.send = function (content) {
        response.writeHead(200);
        response.end(content);
      };

      response.json = function (object) {
        body = JSON.stringify(object);
        response.writeHead({
          'Content-Type': 'application/json',
          'Content-Length': body.length
        });
        response.send(body);
      };

      // Redirect
      response.redirect = function (url) {
        response.writeHead(301, { Location: url });
        response.end();
      };

      // Set up cookies
      var cookies = new Cookies(request, response);

      request.cookies = cookies;

      response.setCookie = function (name, values, options) {
        cookies.set(name, values, options);
      };

      request.getCookie = function (name, options) {
        return cookies.get(name, options);
      };

      response.renderError = function (status) {
        renderer.render('errors/' + status, request, response, {__status: 404});
      }

      router.route(request, response);
    });
  }
  var server = http.createServer(requestListener);
  server.listen(port);
  log.info('Server started on port %s', port);
}

exports.start = start;
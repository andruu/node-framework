require('sugar');

var http = require('http'),
    qs   = require('qs'),
    url  = require('url'),
    Log  = require('log'),
    log  = new Log('info');

function start (router, port, renderer) {

  function requestListener (request, response) {

    var postData = '';
    request.setEncoding("utf8");

    request.addListener('data', function (postDataChunk) {
      postData += postDataChunk;
    });

    request.addListener('end', function () {
      request.params = Object.extended({});
      request.postData = postData;
      request.pathname = url.parse(request.url).pathname;

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

      router.route(request, response);
    });
  }
  var server = http.createServer(requestListener);
  server.listen(port);
  log.info('Server started on port %s', port);
}

exports.start = start;
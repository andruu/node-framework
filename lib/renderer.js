require('sugar');

var fs            = require('fs'),
    Log           = require('log'),
    log           = new Log('info'),
    content_types = require('./objects').content_types;

module.exports = function () {
  var engine;

  function _render (view, request, response, locals) {
    if (!locals) locals = {};
    locals = Object.merge(locals, {
      cookies: request.cookies,
      params: request.params
    });
    engine.render(view, request, response, staticFile, locals);
  }

  function _renderStatic (path, request, response) {
    var fullPath = 'public' + path;
    fs.exists(fullPath, function (exists) {

      var extension = path.split('.').last();
      if (content_types.has(extension)) {
        content_type = content_types[extension];
      } else {
        content_type = content_types['txt'];
      }

      if (exists) {
        staticFile(fullPath, function (file) {
          response.writeHead(200, {
            'Content-Type': content_type,
            'Content-Length': file.length
          });
          response.end(file);
          log.info('[%s] 200 Request to %s', request.method, request.pathname);
        });
      } else {
        log.info('[%s] 404 Request to %s', request.method, request.pathname);
        response.renderError(404);
      }
    });
  }

  var staticFile = function (path, callback) {
    fs.readFile(path, function (err, data) {
      callback(data);
    });
  };

  return {
    render: function (view, request, response, locals) {
      _render(view, request, response, locals);
    },
    renderStatic: function (path, request, response) {
      _renderStatic(path, request, response);
    },
    setEngine: function (_engine) {
      engine = require('./renderers/' + _engine + '');
    },
    getEngine: function () {
      return engine;
    }
  }
};
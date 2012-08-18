require('sugar');

var fs = require('fs');

module.exports = function () {
  var engine;

  function _render (view, request, response, locals) {
    engine.render(view, request, response, staticFile, locals);
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
    setEngine: function (_engine) {
      engine = require('./renderers/' + _engine + '');
    },
    getEngine: function () {
      return engine;
    }
  }
};
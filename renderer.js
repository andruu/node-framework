module.exports = function () {
  var engine;

  function _render (view, request, response, locals) {
    engine.render(view, request, response, locals);
  }

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
require('sugar');

var Log           = require('log'),
    log           = new Log('info'),
    content_types = require('./objects').content_types;

module.exports = function () {

  this.routes = Object.extended({
    GET:    Object.extended({}),
    POST:   Object.extended({}),
    PUT:    Object.extended({}),
    DELETE: Object.extended({})
  });

  this.addRoute = function (method, path, callback) {
    var params = [];
    var offset = 0;
    while (match = path.substr(offset).match(/\/:([a-zA-Z0-9_]+)/)) {
      offset = offset + match.index;
      var length = match[0].length;
      params.push(match[1]);
      offset += length;
    }
    path = path.replace(/:[a-zA-Z0-9_]+/g, '(\\S+)');
    if (!params.isEmpty()) {
      this.routes[method][path] = {method: method, path: path, callback: callback, params: params.unique()};
    } else {
      this.routes[method][path] = {method: method, path: path, callback: callback};
    }
  };

  this.get = function (path, callback) {
    this.addRoute('GET', path, callback);
  };

  this.post = function (path, callback) {
    this.addRoute('POST', path, callback);
  };

  this.put = function (path, callback) {
    this.addRoute('PUT', path, callback);
  };

  this.delete = function (path, callback) {
    this.addRoute('DELETE', path, callback);
  };

  this.findRoute = function (request) {

    var self = this;
    var route;
    if (request.params['_method']) {
      request.method = request.params['_method'].toUpperCase();
    }
    // var routeKeys = this.routes[request.method].keys().sortBy('length');
    var routeKeys = this.routes[request.method].keys();
    if ('/' === request.pathname && routeKeys.some('/')) {
      return this.routes[request.method]['/'];
    }
    routeKeys.remove('/').each(function (key) {
      regexp = new RegExp(key);
      if (!route) {
        if (request.pathname.match(regexp)) {
          route = self.routes[request.method][key];
        }
      }
    });

    return route;
  }

  var isStaticResource = function (path) {
    var isStatic = false;
    content_types.keys().each(function (key) {
      if (path.endsWith('.' + key)) {
        isStatic = true;
      }
    });
    return isStatic;
  }

  this.route = function (request, response) {

    if (isStaticResource(request.pathname)) {
      response.renderStatic(request.pathname);
      return;
    }

    var route = this.findRoute(request);

    if (route) {
      if (route.params) {

        var regex = new RegExp(route.path);
        var params = request.pathname.match(regex);

        route.params.each(function (param, key) {
          request.params[param] = params[key + 1];
        });
      }
      log.info('[%s] 200 Request to %s', request.method, request.pathname);
      route.callback(request, response);
    } else if ('/' === request.pathname) {
      log.info('[%s] 200 Request to /', request.method);
      response.writeHead(200);
      response.end('Index');
    } else {
      response.renderStatic(request.pathname);
    }
  };
};
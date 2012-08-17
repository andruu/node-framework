require('sugar');

var Log = require('log'),
    log = new Log('info');

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
    var counter = 0;
    while (match = path.substr(offset).match(/\/:([a-z]+)/)) {
      offset = offset + match.index;
      var length = match[0].length;
      params.push(match[1]);
      counter++;
      offset += length;
    }
    path = path.replace(/:[a-z]+/g, '(\\S+)');
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
    
    var route;
    var routeKeys = router.routes[request.method].keys().sortBy('length');

    if ('/' === request.pathname && routeKeys.some('/')) {
      return router.routes[request.method]['/'];
    }

    routeKeys.remove('/').each(function (key) {
      regexp = new RegExp(key);
      if (request.pathname.match(regexp)) {
        route = router.routes[request.method][key];
      }
    });

    return route;
  }

  this.route = function (request, response) {
    var route = this.findRoute(request);

    if (route) {
      if (route.params) {
        
        var regex = new RegExp(route.path);
        var params = request.pathname.match(regex);
        
        route.params.each(function (param, key) {
          request.params[param] = params[key + 1];
        });
      }
      route.callback(request, response);

    } else if ('/' === request.pathname) {
      response.writeHead(200);
      response.end('Index');
    } else {
      response.writeHead(404);
      response.end('File not found');
    }

  };
};
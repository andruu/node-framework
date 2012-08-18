var server   = require('./lib/server'),
    Router   = require('./lib/router'),
    router   = new Router(),
    Renderer = require('./lib/renderer'),
    renderer = new Renderer();

renderer.setEngine('jade');

router.get('/', function (request, response) {
  response.render('index');
});

server.start(router, 8888, renderer);
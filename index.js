var server   = require('./lib/server'),
    Router   = require('./lib/router'),
    router   = new Router(),
    Renderer = require('./lib/renderer'),
    renderer = new Renderer();

renderer.setEngine('jade');

router.get('/', function (request, response) {
  response.render('index');
});

router.get('/users/new/:id', function (request, response) {
  console.log(request.params.id);
  response.render('users/new', {
    id: request.params.id
  });
});

server.start(router, 8888, renderer);
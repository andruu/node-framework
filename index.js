var server   = require('./lib/server'),
    Router   = require('./lib/router'),
    router   = new Router(),
    Renderer = require('./lib/renderer'),
    renderer = new Renderer(),
    util     = require('util');

renderer.setEngine('jade');

router.get('/', function (request, response) {
  console.log(util.inspect(request.getCookie('name')));
  response.render('index', {method: request.method});
});

router.get('/posts', function (request, response) {
  response.render('index', {method: request.method});
});
router.post('/posts', function (request, response) {
  response.render('index', {method: request.method});
});
router.put('/posts', function (request, response) {
  response.render('index', {method: request.method});
});
router.delete('/posts', function (request, response) {
  response.render('index', {method: request.method});
});

router.get('/users/new', function (request, response) {
  response.render('users/new', {title: 'New User'});
});

router.get('/users/:first_name/:last_name', function (request, response) {
  response.setCookie('name', JSON.stringify({
    first_name: request.params.first_name,
    last_name: request.params.last_name
  }));
  response.render('users/show', {
    title: 'Hello World',
    first_name: request.params.first_name,
    last_name: request.params.last_name
  });
});

router.get('/users/new/:id', function (request, response) {
  console.log(request.params.id);
  response.render('users/new', {
    id: request.params.id
  });
});

server.start(router, 8888, renderer);
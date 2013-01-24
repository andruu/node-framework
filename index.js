var server   = require('./lib/server'),
    Router   = require('./lib/router'),
    router   = new Router(),
    Renderer = require('./lib/renderer'),
    renderer = new Renderer(),
    util     = require('util'),
    port     = process.env.PORT || 8888;

renderer.setEngine('jade');

router.get('/', function (request, response) {
  console.log(util.inspect(request.params));
  response.render('index', {method: request.method});
});

router.post('/contact', function (request, response) {
  response.json(request.params);
});

router.get('/posts', function (request, response) {
  response.format({
    html: function () {
      response.render('index', {method: request.method});
    },
    json: function () {
      response.json({
        first_name: 'andrew',
        last_name: 'weir'
      });
    },
    'text/javascript': function () {
      response.send('console.log("Hello World");');
    }
  });
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

router.get('/users/new/:id', function (request, response) {
  response.render('users/new', {
    title: 'Hello World',
    id: request.params.id
  });
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
    first_name: request.params.first_name.titleize(),
    last_name: request.params.last_name.titleize()
  });
});

router.get('/:page', function (request, response) {
  response.render('pages/' + request.params.page, {
    title: request.params.page,
    page: request.params.page
  });
});

server.start(router, port, renderer);
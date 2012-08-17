var server = require('./server'),
    Router = require('./router')
    router = new Router();


router.get('/address/:city/:state/:zip', function (request, response) {
  response.write(JSON.stringify(request.params));
  response.end('called the address view');
});

router.get('/users/:slug/:id', function (request, response) {
  response.write(JSON.stringify(request.params));
  response.end('called the users view with id');
});

router.get('/users/:slug', function (request, response) {
  response.write(JSON.stringify(request.params));
  response.end('called the users view');
});

router.get('/posts/:slug', function (request, response) {
  response.write(JSON.stringify(request.params));
  response.end('called the posts view');
});

router.get('/', function (request, response) {
  response.end('called the index');
});

server.start(router, 8888);
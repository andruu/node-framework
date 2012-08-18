var fs   = require('fs'),
    jade = require('jade');

var render = function (view, request, response, staticFile, locals) {
  if (!locals) locals = {};
  var fullPath = 'views/' + view + '.jade';
  fs.exists(fullPath, function (exists) {
    if (exists) {
      staticFile(fullPath, function (file) {

        // Set default application.jade
        if (!locals['layout']) {
          file = "extends layouts/application\n" + file;
        } else {
          file = "extends layouts/" + locals['layout'] + "\n" + file;
        }
        
        var fn = jade.compile(file, {
          filename: fullPath,
          pretty: true
        });
        var output = fn(locals);

        response.writeHead(200, {
          'Content-Type': 'text/html',
          'Content-Length': output.length
        });
        response.end(output);
      });
    } else {
      response.writeHead(404);
      response.end('Template not found');
    }
  });
};

exports.render = render;
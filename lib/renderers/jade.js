 var fs   = require('fs'),
     jade = require('jade');

var render = function (view, request, response, staticFile, locals) {
  if (!locals) locals = {};
  var fullPath = 'views/' + view + '.jade';
  fs.exists(fullPath, function (exists) {
    if (exists) {
      staticFile(fullPath, function (file) {
        
        var fn = jade.compile(file, {
          filename: fullPath,
          pretty: true
        });
        var output = fn(locals);
        
        var status;
        if (locals.__status) {
          status = locals.__status;
        } else {
          status = 200;
        }

        response.writeHead(status, {
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
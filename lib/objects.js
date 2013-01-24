require('sugar');

var content_types = Object.extended({
  'html': 'text/html',
  'htm':  'text/html',
  'css':  'text/css',
  'js':   'text/javascript',
  'jpg':  'image/jpeg',
  'jpeg': 'image/jpeg',
  'png':  'image/png',
  'gif':  'image/gif',
  'xml':  'text/xml',
  'json': 'application/json',
  'zip':  'application/zip',
  'txt':  'text/plain',
  'ico':  'image/x-icon'
});

var accepts_types = Object.extended({
  "javascript":   "text/javascript",
  "js":           "text/javascript",
  "json":         "application/json",
  "css":          "text/css",
  "html":         "text/html",
  "text":         "text/plain",
  "txt":          "text/plain",
  "csv":          "application/vnd.ms-excel, text/plain",
  "form":         "application/x-www-form-urlencoded",
  "file":         "multipart/form-data",
  "xhtml":        "application/xhtml+xml, application/xhtml, text/xhtml",
  "xhtml-mobile": "application/vnd.wap.xhtml+xml",
  "xml":          "application/xml, text/xml",
  "rss":          "application/rss+xml",
  "atom":         "application/atom+xml"
});

exports.content_types = content_types;
exports.accepts_types = accepts_types;
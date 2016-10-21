//Fast shared worker implementation of intercom
var connections = [];

self.addEventListener('connect', function(e) {
  var port = e.ports[0];
  connections.push(port);
  port.addEventListener('message', function(e) {
    connections.forEach(function(conn) {
      conn.postMessage(e.data);
    });
  }, false);
  port.start();
}, false);
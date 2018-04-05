/**
 * @file
 * System module.
 */

import eventHandler from '../../lib/EventHandler';
import express from 'express';


function main() {
  eventHandler.on('delivery', () => {
    const SERVER_PORT = 3000;

    const server = express();

    var routes = {};
    eventHandler.emit('routes', routes);

    for (var routeId in routes) {
      if (routes.hasOwnProperty(routeId)) {
        var route = routes[routeId];

        if (typeof(server[route.type]) == 'function') {
          var args = [route.uri].concat(route.callback);
          server[route.type](...args);
        }
        else {
          console.log("Invalid route type: {type}".replace('{type}', route.type));
        }
      }
    }

    server.listen(SERVER_PORT, function () {
      for (var routeId in routes) {
        if (routes.hasOwnProperty(routeId)) {
          var route = routes[routeId];
          console.log(`New route defined for http://localhost:${SERVER_PORT}${route.uri}`);
        }
      }
    });
  });
}

module.exports = main;

/**
 * @file
 * GraphQL module.
 */

import eventHandler from '../../lib/EventHandler';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';

function main() {
  eventHandler.on('routes', (routes) => {

    // Get schema.
    var schemaContainer = {};
    eventHandler.emit('graphql.schema', schemaContainer);

    var schema = schemaContainer.schema;
    // Endpoint route.
    routes.graphql = {
      uri: '/graphql',
      type: 'use',
      callback: [
        bodyParser.json(),
        graphqlExpress({ schema })
      ],
    };

    // UI route.
    routes.graphqli = {
      uri: '/graphqli',
      type: 'use',
      callback: [
        graphiqlExpress({ endpointURL: '/graphql' })
      ],
    };

  });
}

module.exports = main;

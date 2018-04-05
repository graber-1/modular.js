/**
 * @file
 * Example module.
 */

import eventHandler from '../../core/lib/EventHandler';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import fs from 'fs';
import path from 'path';
import mocks from './mocks';
import resolvers from './resolvers';

function main() {
  eventHandler.on('graphql.schema', (schemaContainer) => {
    var typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), {encoding: 'utf-8'}, function (err, data) {
      if (err) {
        console.log(err);
      }
    });

    if (!typeDefs.length) {
      throw('An error occurred while getting GraphQL schema.');
    }

    var schema = makeExecutableSchema({ typeDefs, resolvers });
    addMockFunctionsToSchema({ schema, mocks });
    schemaContainer.schema = schema;
  });
}

module.exports = main;

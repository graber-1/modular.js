/**
 * @file
 * The main app file, all starts here.
 */

import moduleHandler from './core/lib/ModuleHandler'
import eventHandler from './core/lib/EventHandler';

const modules = [
  'system',
  'graphql',
  'express',
  'example',
];

modules.forEach(moduleHandler.load);

eventHandler.emit('delivery');

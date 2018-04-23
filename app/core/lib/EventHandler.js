import EventEmitter from 'events';

class EventHandler extends EventEmitter {}

// TODO: Add caching of listeners to be able to alter their order.
console.log('Event handler has been initialized.');
const eventHandler = new EventHandler();

export default eventHandler;

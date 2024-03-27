import fetch from 'node-fetch';
import ws from 'ws';

// polyfill fetch & websocket
const globalAny = global as any;
globalAny.AbortController = AbortController;
globalAny.fetch = fetch;
globalAny.WebSocket = ws;

export { makeClient } from './ui-v2';

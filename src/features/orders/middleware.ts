import { createListenerMiddleware } from "@reduxjs/toolkit";
import { cleanup, initialize, overrideBook, updateOrder } from "./slice";

const TIMEOUT = 2 * 1000;
const PING_INTERVAL = 5 * 1000;

let ws: WebSocket;
let timeout: NodeJS.Timeout;
let connectionId: number;
let reconnectTimeout: NodeJS.Timeout;

export const ordersMiddleware = createListenerMiddleware()

ordersMiddleware.startListening({
  actionCreator: initialize,
  effect: async (action, { dispatch }) => {
    if (ws) { ws.close(); }
    ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    const setUpReconnect = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        console.log('RECONNECT TIMEOUT');
        dispatch(action);
      }, PING_INTERVAL + TIMEOUT);
    }

    const setUpCheckTimeout = () => {
      if (timeout) clearTimeout(timeout);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      timeout = setTimeout(() => {
        ws.send(JSON.stringify({ event: 'ping', cid: connectionId }));
        setUpReconnect();
      }, PING_INTERVAL)
    };

    ws.onerror = () => {
      console.log('WS ERROR');
      setUpReconnect();
    }
    ws.onopen = (e) => {
      ws.send(JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: action.payload.symbol,
        prec: action.payload.precision,
      }));
      setUpCheckTimeout();
    };

    const listener = (msg: any) => {
      const message = JSON.parse(msg.data);
      if (message.event === 'pong') {
        console.log('PONG');
        setUpCheckTimeout();
        if (reconnectTimeout) clearTimeout(reconnectTimeout)
      }
      if (message.event) return;
      connectionId = message[0];
      if (Array.isArray(message[1][1])) {
        dispatch(overrideBook(message))
      }
      if (Array.isArray(message[1])) {
        dispatch(updateOrder(message[1] as [number, number, number]))
      }
    }
    
    ws.addEventListener('message', listener);
  },
});

ordersMiddleware.startListening({
  actionCreator: cleanup,
  effect: () => {
    if (ws) ws.close();
  },
});
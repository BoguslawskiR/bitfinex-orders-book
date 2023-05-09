import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';

export type Channel = 'redux' | 'general'

export interface Message {
  id: number
  channel: Channel
  userName: string
  text: string
}

type Price = number;

interface Order {
  count: number;
  amount: number;
  total: number;
};

interface State {
  id?: number;
  isLoading: boolean;
  orders: {
    ask: Record<Price, Order>;
    bid: Record<Price, Order>;
  }
}

const reduceOrdersWithTotal = (orders: number[][]) => (orders as [number, number, number][]).reduce((acc, [price, count, amount], index) => {
  acc.push([price, count, amount, index === 0 ? amount : acc[index - 1][3] + amount]);
  return acc;
}, [] as [number, number, number, number][])
  .reduce((acc, [price, count, amount, total]) => {
    acc[price] = { count, amount, total };
    return acc;
  }, {} as Record<Price, Order>)

export const ordersBookSlice = createSlice({
  name: 'ordersBook',
  reducers: {
    initialize(state, _: PayloadAction<{ precision: string; symbol: string; }>) {
      return { ...state, isLoading: true };
    },
    cleanup() {
      return { isLoading: false, orders: { ask: {}, bid: {} } };
    },
    overrideBook(_, payloadAction: PayloadAction<[number, [number, number, number][]]>) {
      const id = payloadAction.payload[0];
      const orders = cloneDeep(payloadAction.payload[1]);

      return {
        isLoading: false,
        id,
        orders: {
          ask: reduceOrdersWithTotal(orders
            .filter(([_, __, amount]) => amount <= 0)
            .sort((a, b) => a[0] - b[0])
          ),
          bid: reduceOrdersWithTotal(orders
            .filter(([_, __, amount]) => amount > 0)
            .sort((a, b) => b[0] - a[0])
          ),
        }
      };
    },
    updateOrder(state, payloadAction: PayloadAction<[number, number, number]>) {
      if (!Array.isArray(payloadAction.payload)) return state;
      const newState = cloneDeep(state);
      const [price, count, amount] = payloadAction.payload;

      // when count = 0 then you have to delete the price level.
      // 4.1 if amount = 1 then remove from bids
      // 4.2 if amount = -1 then remove from asks

      if (count === 0 && amount === 1) {
        delete newState.orders.bid[price];
      }
      if (count === 0 && amount === -1) {
        delete newState.orders.ask[price];
      }

      // when count > 0 then you have to add or update the price level
      // 3.1 if amount > 0 then add/update bids
      // 3.2 if amount < 0 then add/update asks
      if (count > 0 && amount > 0) {
        newState.orders.bid[price] = { count, amount, total: 0 };
      }
      if (count > 0 && amount < 0) {
        newState.orders.ask[price] = { count, amount, total: 0 };
      }

      newState.orders.ask = reduceOrdersWithTotal(
        Object.entries(newState.orders.ask)
          .map(([price, { count, amount }]) => [Number(price), count, amount])
          .sort((a, b) => a[0] - b[0])
      );
      newState.orders.bid = reduceOrdersWithTotal(
        Object.entries(newState.orders.bid)
          .map(([price, { count, amount }]) => [Number(price), count, amount])
          .sort((a, b) => b[0] - a[0])
      );

      return newState;
    },
  },
  initialState: {
    isLoading: false,
    orders: {
      ask: {},
      bid: {},
    }
  } as State,
});

export const { initialize, cleanup, overrideBook, updateOrder } = ordersBookSlice.actions
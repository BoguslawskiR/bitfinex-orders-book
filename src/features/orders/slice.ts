import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pullAt } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';

export type Channel = 'redux' | 'general'

export interface Message {
  id: number
  channel: Channel
  userName: string
  text: string
}

export const ordersBookSlice = createSlice({
  name: 'ordersBook',
  reducers: {
    initialize(state, _: PayloadAction<{ precision: string; symbol: string; }>) {
      return state;
    },
    cleanup() {
      return [];
    },
    overrideBook(_, payloadAction: PayloadAction<[number, [number, number, number][]]>) {
      return payloadAction.payload;
    },
    updateOrder(state, payloadAction: PayloadAction<[number, number, number]>) {
      const newState = cloneDeep(state);

      if (!Array.isArray(newState[1])) return state;

      const indexToUpdate = newState[1].findIndex((order) => order[0] === payloadAction.payload[0]);

      if (indexToUpdate !== -1) {
        newState[1][indexToUpdate] = payloadAction.payload;
      } else if (payloadAction.payload[1] !== 0) {
        newState[1].push(payloadAction.payload)
      }

      if (payloadAction.payload[1] === 0 && indexToUpdate !== -1) {
        pullAt(newState[1], [indexToUpdate]);
      }

      return newState as [number, [number, number, number][]];
    },
  },
  initialState: [] as [number, [number, number, number][]] | [],
});

export const { initialize, cleanup, overrideBook, updateOrder } = ordersBookSlice.actions
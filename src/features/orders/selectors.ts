import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectOrders = (state: RootState) => state.ordersBook;

export const askSelector = createSelector(selectOrders, orders => orders.orders.ask);
export const bidSelector = createSelector(selectOrders, orders => orders.orders.bid);
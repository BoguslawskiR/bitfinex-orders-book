import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectOrders = (state: RootState) => state.ordersBook[1];

export const askSelector = createSelector(selectOrders, orders => [...(orders || [])].filter(([_, __, amount]) => amount <= 0).sort((a, b) => a[0] - b[0]));
export const bidSelector = createSelector(selectOrders, orders => [...(orders || [])].filter(([_, __, amount]) => amount > 0).sort((a, b) => b[0] - a[0]));
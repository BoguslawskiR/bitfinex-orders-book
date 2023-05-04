import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { ordersMiddleware } from "../features/orders/middleware";
import { ordersBookSlice } from "../features/orders/slice"

export const store = configureStore({
  reducer: {
    [ordersBookSlice.name]: ordersBookSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(ordersMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { initialize, cleanup } from "./slice"
import { askSelector, bidSelector } from "./selectors";
import Order from "../../components/Order";
import { maxBy } from "lodash";

export default function Orders() {
  const dispatch = useAppDispatch();
  const askOrders = useAppSelector(askSelector);
  const bidOrders = useAppSelector(bidSelector);
  const [precision, setPrecision] = useState('P0');

  useEffect(() => {
    dispatch(initialize({ precision, symbol: 'tXRPUSD' }));
    return () => {
      dispatch(cleanup());
    };
  }, [precision]);

  const maxTotal = useMemo(() => {
    return Math.abs(maxBy([...Object.values(askOrders), ...Object.values(bidOrders)], (el) => Math.abs(el.total))?.total || 50) * 1.1;
  }, [askOrders, bidOrders])

  return <div className="flex flex-col gap-6 p-6">
    <div className="flex flex-col gap-1 w-1/5">
      <label>Precision</label>
      <select className="p-2 border" value={precision} onChange={(e) => setPrecision(e.target.value)}>
        <option value="P0">P0</option>
        <option value="P1">P1</option>
        <option value="P2">P2</option>
        <option value="P3">P3</option>
        <option value="P4">P4</option>
      </select>
    </div>

    <div className="flex flex-col bg-slate-700 text-white text-sm p-4 rounded drop-shadow">
      <div className="grid grid-cols-2">
        <div className="flex flex-col">
          <div className="grid grid-cols-4 text-slate-300">
            <div>Count</div>
            <div>Amount</div>
            <div>Total</div>
            <div>Price</div>
          </div>
          {
            Object
              .entries(bidOrders)
              .sort(([aPrice], [bPrice]) => Number(bPrice) - Number(aPrice))
              .map(([price, { count, amount, total }]) => <Order total={total} price={Number(price)} count={count} amount={amount} key={price} type="bid" max={maxTotal}/>)
          }
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-4 text-slate-300">
            <div>Price</div>
            <div>Total</div>
            <div>Amount</div>
            <div>Count</div>
          </div>
          {
            Object
              .entries(askOrders)
              .sort(([aPrice], [bPrice]) => Number(aPrice) - Number(bPrice))
              .map(([price, { count, amount, total }]) => <Order total={total} price={Number(price)} count={count} amount={amount} key={price} reversed type="ask" max={maxTotal}/>)
          }
        </div>
      </div>
    </div>
  </div>
}
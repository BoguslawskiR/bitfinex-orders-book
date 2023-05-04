import { Fragment, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { initialize, cleanup } from "./slice"
import { askSelector, bidSelector } from "./selectors";
import Order from "../../components/Order";

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

    <div className="flex flex-col bg-slate-50 p-4 rounded drop-shadow">
      <div className="grid grid-cols-2 divide-x divide-solid divide-slate-500">
        <div className="flex flex-col divide-y divide-dashed divide-slate-300">
          {askOrders.map(([price, count, amount]) => <Order price={price} count={count} amount={amount} key={price} />)}
        </div>

        <div className="flex flex-col divide-y divide-dashed divide-slate-300">
          {bidOrders.map(([price, count, amount]) => <Order price={price} count={count} amount={amount} key={price} reversed />)}
        </div>
      </div>
    </div>
  </div>
}
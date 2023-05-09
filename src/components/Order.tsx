import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  price: number;
  count: number;
  amount: number;
  total: number;
  reversed?: boolean;
  type: 'bid' | 'ask';
  max: number;
}

function Order({ price, count, amount, total, reversed, type, max }: Props) {
  return <div className="grid grid-cols-4 relative">
    <div className={reversed ? 'order-4' : 'order-1'}>{count}</div>
    <div className={reversed ? 'order-3' : 'order-2'}>{Math.abs(amount).toFixed(3)}</div>
    <div className={reversed ? 'order-2' : 'order-3'}>{Math.abs(total).toFixed(3)}</div>
    <div className={twMerge(reversed ? 'order-1' : 'order-4')}>{price}</div>
    <div
      className={
        twMerge(
          'absolute top-0 h-full z-[-1] opacity-20',
          reversed ? 'left-0' : 'right-0',
          type === 'bid' ? 'bg-green-800' : 'bg-red-800'
        )
      }
      style={{ width: `${(Math.abs(total) / max) * 100}%` }}
    />
  </div>;
}

export default React.memo(Order);
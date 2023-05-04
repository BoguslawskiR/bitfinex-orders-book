import React from "react";

interface Props {
  price: number;
  count: number;
  amount: number;
  reversed?: boolean;
}

function Order({ price, count, amount, reversed }: Props) {
  return <div className="grid grid-cols-3">
    <div className={reversed ? 'order-last' : 'order-first'}>{count}</div>
    <div>{amount}</div>
    <div className={reversed ? 'order-first' : 'order-last'}>{price}</div>
  </div>;
}

export default React.memo(Order);
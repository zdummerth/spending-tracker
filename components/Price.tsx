import React from 'react';

const Price = ({ price = 0 }: { price: number }) => {
  return (
    <div className="price flex fai-c">
      <div>$</div>
      <div>{`${(price / 100).toFixed(2)}`}</div>
    </div>
  );
};

export default Price;

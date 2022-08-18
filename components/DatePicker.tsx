import React from 'react';
import { useAppState } from '@/utils/useAppState';

const DatePicker = () => {
  const { currentDateRange, dateRangeDispatch } = useAppState();
  return (
    <div className="flex w-full bg-black">
      <button
        className={`flex-1 border p-2 ${
          currentDateRange === 'this-week' && 'text-green-400 font-bold'
        }`}
        onClick={() => dateRangeDispatch('this-week')}
      >
        This Week
      </button>
      <button
        className={`flex-1 border p-2 ${
          currentDateRange === 'this-month' && 'text-green-400 font-bold'
        }`}
        onClick={() => dateRangeDispatch('this-month')}
      >
        This Month
      </button>
      <button
        className={`flex-1 border p-2 ${
          currentDateRange === 'this-year' && 'text-green-400 font-bold'
        }`}
        onClick={() => dateRangeDispatch('this-year')}
      >
        This Year
      </button>
    </div>
  );
};

export default DatePicker;

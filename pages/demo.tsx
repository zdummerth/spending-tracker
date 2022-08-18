import { useState } from 'react';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import useDemoData from '@/utils/useDemoData';
import { VictoryPie, VictoryTooltip, VictoryLabel } from 'victory';
import Price from '@/components/Price';
import { useAppState } from '@/utils/useAppState';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';
// import SeedDatabase from '@/components/SeedDatabase';

export default function DemoPage() {
  const [transactionType, setTransactionType] = useState('expense');
  const [sumAscending, setSumAscending] = useState(false);
  const { startingDate, endingDate } = useAppState();
  const { data, error, loading } = useDemoData({
    startingDate,
    endingDate,
    sumAscending,
    action: 'get_all_category_data'
  });

  const dataByTransactionType = data
    ? data.data.filter((d: any) => d.income_or_expense === transactionType)
    : [];

  const pieChartData = dataByTransactionType.map((d: any) => ({
    x: d.name,
    y: d.total
  }));

  const colorScale = dataByTransactionType.map((d: any) => d.color);

  // console.log(data);
  return (
    <div className="flex flex-col items-center w-full">
      <DatePicker />
      <div className="flex w-full bg-black">
        <button
          className={`flex-1 border p-2 ${
            transactionType === 'expense' && 'text-green-400 font-bold'
          }`}
          onClick={() => setTransactionType('expense')}
        >
          Expenses
        </button>
        <button
          className={`flex-1 border p-2 ${
            transactionType === 'income' && 'text-green-400 font-bold'
          }`}
          onClick={() => setTransactionType('income')}
        >
          Income
        </button>
      </div>
      <h1 className="mt-4 mb-4">Demo Spending Tracker</h1>
      {loading ? (
        <div>...loading data</div>
      ) : (
        <>
          {/* <SeedDatabase /> */}
          <div className="w-2/4">
            <VictoryPie
              data={pieChartData}
              labelComponent={
                <VictoryTooltip labelComponent={<VictoryLabel />} />
              }
              labels={({ datum }) =>
                `  ${datum.x}: $${(datum.y / 100).toFixed(2)}  `
              }
              colorScale={colorScale}
              eventKey={'x'}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onClick: () => ({
                      target: 'data',
                      mutation: (props) => {
                        console.log(props.datum.eventKey);
                      }
                    })
                  }
                }
              ]}
            />
          </div>
          <div className="w-full flex flex-col">
            <button
              className="self-end"
              onClick={() => setSumAscending(!sumAscending)}
            >
              {sumAscending ? 'high to low' : 'low to high'}
            </button>
            <div>
              {dataByTransactionType.map((d: any) => (
                <Link href={`/categories/demo/${d.cid}`} key={d.name}>
                  <a>
                    <div className="flex flex-col border m-2 p-2 rounded shadow-md shadow-white bg-black">
                      <div key={d.name} className="flex justify-between">
                        <div className="flex items-center">
                          <div
                            className={`rounded-full w-4 h-4 mr-1`}
                            style={{
                              backgroundColor: d.color
                            }}
                          ></div>
                          <div>{d.name}</div>
                        </div>
                        <Price price={d.total} />
                      </div>
                      <div>({d.count})</div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

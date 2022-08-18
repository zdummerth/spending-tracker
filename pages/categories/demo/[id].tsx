import { useState } from 'react';
import { GetServerSideProps } from 'next';
import useDemoData from '@/utils/useDemoData';
import Price from '@/components/Price';
import TransactionList from '@/components/TransactionList';
import { useAppState } from '@/utils/useAppState';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';

const ColorPicker = ({ defaultColor }: { defaultColor: string }) => {
  const [color, setColor] = useState(defaultColor);
  const saveColor = () => {};

  return (
    <div className="flex items-center py-2">
      <div className="flex items-center">
        <label
          htmlFor="color"
          className="mr-2 border-l-4 border-green-400 pl-2"
        >
          Color
        </label>
        <input
          type="color"
          id="color"
          name="color"
          value={color}
          className="rounded"
          onChange={(e) => {
            setColor(e.target.value);
          }}
        />
      </div>
      <div>
        {color !== defaultColor && (
          <>
            <button
              className="border border-green-500 mx-2 p-2"
              onClick={saveColor}
            >
              Save Color
            </button>
            <button
              className="border p-2"
              onClick={() => setColor(defaultColor)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const BackLink = () => {
  return (
    <Link href="/demo">
      <a className="p-4 block">{'< All Categories'}</a>
    </Link>
  );
};

export default function CategoryPage({ categoryId }: { categoryId: number }) {
  const { startingDate, endingDate } = useAppState();

  const { data, error, loading } = useDemoData({
    startingDate,
    endingDate,
    categoryId,
    action: 'get_category_data'
  });

  if (error) {
    return (
      <div>
        {/* <DatePicker /> */}
        <BackLink />
        <div>Error fetching category data</div>
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <BackLink />
        <DatePicker />
        <div>...loading category data</div>
      </div>
    );
  }

  const category = data.data[0];

  // console.log({ data });
  if (!category) {
    return (
      <>
        <div>
          <BackLink />
          <DatePicker />
          <p className="p-4 text-center">
            There are no transactions in this date range. Please select another
            category or date range
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <BackLink />

      <DatePicker />
      <section className="border p-4 bg-black mt-2">
        <h1 className="text-2xl border-l-4 border-green-400 pl-2">
          {category.name.toUpperCase()}
        </h1>
      </section>
      <section className="border p-4 my-2 bg-black">
        <ColorPicker defaultColor={category.color} />
      </section>
      <section className="border p-4 bg-black">
        <h2 className="border-l-4 border-green-400 pl-2 mb-2">Insights</h2>
        <div className="flex justify-center">
          <div className="border flex-1 p-2 shadow shadow-white rounded bg-zinc-800">
            <h3>Total</h3>
            <Price price={category.total} />
          </div>
          <div className="border flex-1 p-2 shadow shadow-white rounded bg-zinc-800">
            <h3>Average</h3>
            <Price price={category.average} />
          </div>
          <div className="border flex-1 p-2 shadow shadow-white rounded bg-zinc-800">
            <h3>Max</h3>
            <Price price={category.max} />
          </div>
          <div className="border flex-1 p-2 shadow shadow-white rounded bg-zinc-800">
            <h3>Count</h3>
            <div>{category.count}</div>
          </div>
        </div>
      </section>
      <section className="border p-4 my-2 bg-black">
        <h2 className="border-l-4 border-green-400 pl-2 mb-2">Transactions</h2>
        <TransactionList
          categoryName={category.name}
          categoryId={category.cid}
        />
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const categoryId = context.params?.id;
  return {
    props: {
      categoryId
    }
  };
};

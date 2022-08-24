import useDemoData from '@/utils/useDemoData';
import Price from './Price';
import FormattedDate from './FormattedDate';

export default function TransactionList({
  categoryName,
  categoryId
}: {
  categoryName?: string;
  categoryId?: number;
}) {
  // console.log('cat id', categoryId);
  const { data, error, loading } = useDemoData({
    // categoryName,
    categoryId,
    action: 'get_transactions_by_category'
  });
  if (error) {
    return <div>Error fetching category data</div>;
  }
  if (loading) {
    return <div>loading category data...</div>;
  }

  const transactions = data.data;

  // console.log({ transactions });
  return (
    <>
      <div>
        {transactions.map((t: any) => {
          return (
            <div
              key={t.id}
              className="border mb-3 p-2 shadow shadow-white rounded bg-zinc-800"
            >
              <FormattedDate date={t.created_at} />
              <div className="mt-2 text-lg">
                <Price price={t.amount} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

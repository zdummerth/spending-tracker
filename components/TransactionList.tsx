import useDemoData from '@/utils/useDemoData';
import Price from './Price';
import FormattedDate from './FormattedDate';

export default function TransactionList({
  categoryId
}: {
  categoryId?: number;
}) {
  const { data, error, loading } = useDemoData({
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

import useSWR from 'swr';
import { useAppState } from './useAppState';

export default function useDemoData({
  sumAscending = true,
  categoryName = 'food',
  categoryId = 1,
  action
}: {
  sumAscending?: Boolean;
  categoryName?: string;
  categoryId?: number;
  action: string;
}) {
  const url = '/api/get-demo-data';
  const { endingDate, startingDate } = useAppState();

  const { data, error } = useSWR(
    [action, startingDate, endingDate, sumAscending, categoryName, categoryId],
    async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          startingDate,
          endingDate,
          sumAscending,
          categoryName,
          categoryId,
          action
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    }
  );

  // console.log('is fetching: ', isFetching);
  return { data, error, loading: !data && !error };
}

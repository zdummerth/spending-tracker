import useSWR from 'swr';
import { useAppState } from './useAppState';

export default function useDemoData({
  startingDate,
  endingDate,
  sumAscending,
  categoryName,
  categoryId,
  action
}: {
  startingDate: Date;
  endingDate: Date;
  sumAscending?: Boolean;
  categoryName?: string;
  categoryId?: number;
  action?: string;
}) {
  const url = '/api/get-demo-data';
  // const { endingDate: estate, startingDate: sstate } = useAppState();

  const { data, error } = useSWR(
    [
      url,
      startingDate,
      endingDate,
      sumAscending,
      categoryName,
      categoryId,
      action
    ],
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
      return await response.json();
    }
  );

  return { data, error, loading: !data && !error };
}

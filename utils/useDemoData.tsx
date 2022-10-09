import useSWR from 'swr';
import { useAppState } from './useAppState';
import { useUser } from '@supabase/supabase-auth-helpers/react';

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
  // isDemo?: boolean;
}) {
  const { user, isLoading, error: userErr } = useUser();
  const shouldFetch = !isLoading && !userErr;
  const isDemo = !user && shouldFetch;
  const url = isDemo ? '/api/get-demo-data' : '/api/get-private-data';

  const { endingDate, startingDate } = useAppState();

  const { data, error } = useSWR(
    shouldFetch
      ? [
          url,
          action,
          startingDate,
          endingDate,
          sumAscending,
          categoryName,
          categoryId,
          isDemo
        ]
      : null,
    async () => {
      // console.log('data url: ', url);

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
          action,
          isDemo
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    }
  );

  return {
    data,
    error: error || userErr,
    loading: (!data && !error) || isLoading,
    isDemo
  };
}

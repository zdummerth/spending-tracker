import { createClient } from '@supabase/supabase-js';
import { toDateTime } from './helpers';
import { Customer, UserDetails, Transaction } from 'types';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface ListTransactionsProps {
  select: string;
  limit: number;
  startingDate?: Date;
  endingDate?: Date;
  income_or_expense: string;
  isPublic: boolean;
}
export const listPublicTransactions = async (props: ListTransactionsProps) => {
  let query = supabaseAdmin
    .from<Transaction>('transactions')
    .select(props.select)
    .limit(props.limit)
    .rangeLte('created_at', `[${props.startingDate}, ${props.endingDate}]`);

  const { data, error } = await query;

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || {};
};

export const createDemoData = async () => {
  // let query = supabaseAdmin
  //   .from<Transaction>('transactions')
  //   .select(props.select)
  //   .limit(props.limit)
  //   .rangeLte('created_at', `[${props.startingDate}, ${props.endingDate}]`);
  // const { data, error } = await query;
  // if (error) {
  //   console.log(error.message);
  //   throw error;
  // }
  // return data || {};
  console.log('creating demo data');
};

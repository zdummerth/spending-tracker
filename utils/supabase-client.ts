import { supabaseClient, User } from '@supabase/supabase-auth-helpers/nextjs';
import { UserDetails, Transaction } from 'types';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseAdmin = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key'
);

export const supabase = supabaseClient;

export const updateUserName = async (userId: string, name: string) => {
  const { data, error } = await supabase
    .from<UserDetails>('users')
    .update({
      username: name
    })
    .eq('id', userId)
    .limit(1)
    .order('id', { ascending: false })
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || {};
};

export const updateTransaction = async (payload: Transaction, id: string) => {
  const { data, error } = await supabase
    .from<Transaction>('transactions')
    .update(payload)
    .eq('id', id)
    .limit(1)
    .order('id', { ascending: false })
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || {};
};

interface ListTransactionsProps {
  select: string;
  limit: number;
  startingDate?: Date;
  endingDate?: Date;
  income_or_expense: string;
  isPublic: boolean;
}
export const listTransactions = async (props: ListTransactionsProps) => {
  let query = supabase
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

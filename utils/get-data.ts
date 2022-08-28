import { supabaseAdmin } from '@/utils/supabase-admin';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export const getData = async (req: NextApiRequest) => {
  const action = req.body.action;
  let response;

  switch (action) {
    case 'get_category_data':
      response = await supabaseAdmin.rpc('get_category_data', {
        categoryid: req.body.categoryId,
        startingdate: req.body.startingDate,
        endingdate: req.body.endingDate
      });
      break;

    case 'get_all_category_data':
      response = await supabaseAdmin
        .rpc('get_all_category_data', {
          startingdate: req.body.startingDate,
          endingdate: req.body.endingDate
        })
        .order('total', { ascending: req.body.sumAscending });
      break;

    case 'get_all_category_names':
      response = await supabaseAdmin
        .from('categories')
        .select('id, name, income_or_expense');
      break;

    default:
      response = await supabaseAdmin
        .from('transactions')
        .select(
          'amount, created_at, id, income_or_expense, categories!inner(*)',
          {
            count: 'exact'
          }
        )
        .eq('categories.id', req.body.categoryId)
        .lte('created_at', req.body.endingDate)
        .gte('created_at', req.body.startingDate)
        .order('created_at', { ascending: false })
        .range(0, 9);
  }
  return response;
};

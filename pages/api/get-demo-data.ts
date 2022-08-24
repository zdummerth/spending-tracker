import { supabaseAdmin } from '@/utils/supabase-admin';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log('get demo data function: ', req.body);
  const action = req.body.action;
  console.log('action: ', action);

  try {
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

    if (response.error) {
      throw response.error;
    }
    // console.log(response.data);
    return res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    res.status(500);
  }
};

export default handler;

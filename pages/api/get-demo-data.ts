import { supabaseAdmin } from '@/utils/supabase-admin';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log('get demo data function: ', req.body);
  const action = req.body.action;

  try {
    let response;
    if (action === 'get_category_data') {
      // console.log('geting category data');
      response = await supabaseAdmin.rpc('get_category_data', {
        categoryid: req.body.categoryId,
        startingdate: req.body.startingDate,
        endingdate: req.body.endingDate
      });
    } else if (action === 'get_all_category_data') {
      // console.log('geting all category data');
      response = await supabaseAdmin
        .rpc('get_all_category_data', {
          startingdate: req.body.startingDate,
          endingdate: req.body.endingDate
        })
        .order('total', { ascending: req.body.sumAscending });
    } else {
      // console.log('geting transactons');
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
    return res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};

export default handler;

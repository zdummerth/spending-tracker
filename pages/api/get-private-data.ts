import {
  withApiAuth,
  supabaseServerClient
} from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const action = req.body.action;
  console.log('action: ', action);

  try {
    let response;

    switch (action) {
      case 'get_category_data':
        response = await supabaseServerClient({ req, res }).rpc(
          'get_category_data',
          {
            categoryid: req.body.categoryId,
            startingdate: req.body.startingDate,
            endingdate: req.body.endingDate,
            isdemo: false
          }
        );
        break;

      case 'get_all_category_data':
        response = await supabaseServerClient({ req, res })
          .rpc('get_all_category_data', {
            startingdate: req.body.startingDate,
            endingdate: req.body.endingDate,
            isdemo: false
          })
          .order('total', { ascending: req.body.sumAscending });

        // response = await supabaseServerClient({ req, res })
        //   .from('categories')
        //   .select('name, id, income_or_expense, transactions(id, amount)', {
        //     count: 'exact'
        //   });
        break;

      case 'get_all_category_names':
        response = await supabaseServerClient({ req, res })
          .from('categories')
          .select('id, name, income_or_expense');
        break;

      default:
        response = await supabaseServerClient({ req, res })
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

    console.log(response);
    if (response.error) {
      throw response.error;
    }
    // console.log(response.data);
    return res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    res.status(500);
  }
});

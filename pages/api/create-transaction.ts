import { supabaseAdmin } from '@/utils/supabase-admin';
// import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('create transaction function: ', req.body);

  try {
    // console.log('geting category data');
    const response = await supabaseAdmin.rpc('create_transaction', {
      categoryid: req.body.categoryId,
      amount: req.body.amount,
      income_or_expense: req.body.income_or_expense,
      ispublic: true
    });
    console.log(response);

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

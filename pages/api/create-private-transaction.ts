import {
  withApiAuth,
  supabaseServerClient,
  getUser
} from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { user } = await getUser({ req, res });
    if (!user) {
      throw 'No user';
    }
    console.log('create private transaction user: ', user.id);
    const response = await supabaseServerClient({ req, res }).rpc(
      'create_private_transaction',
      {
        categoryid: req.body.categoryId,
        amount: req.body.amount,
        income_or_expense: req.body.income_or_expense
        // userid: user.id
      }
    );
    console.log(response);

    if (response.error) {
      throw response.error;
    }
    return res.status(200).json(response);
    // return res.status(200).json({ f: '' });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
});

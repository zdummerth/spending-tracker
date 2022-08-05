import {
  getUser,
  withAuthRequired
} from '@supabase/supabase-auth-helpers/nextjs';
import { updateUserName } from '@/utils/supabase-client';
import { NextApiRequest, NextApiResponse } from 'next';

const updateUserRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('update user route body: ', req.body);
  if (req.method === 'POST') {
    try {
      const { user } = await getUser({ req, res });
      if (!user) throw Error('Could not get user');
      const username = await updateUserName(user.id, req.body.username);
      console.log('updated username', username);

      return res.status(200).json({ username });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default withAuthRequired(updateUserRoute);

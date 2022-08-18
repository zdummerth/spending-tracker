// import { updateUserName } from '@/utils/supabase-client';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
  return new Date(
    // getRandomInt(2019, 2022),
    2022, //year
    // getRandomInt(0, 11),
    7,
    getRandomInt(14, 18),
    getRandomInt(1, 23),
    getRandomInt(1, 59)
  );
}

function createTransactions() {
  let transactions: any = [];
  for (let i = 0; i < 200; i++) {
    transactions.push({
      amount: getRandomInt(200, 10000),
      created_at: getRandomDate(),
      ispublic: true,
      income_or_expense: getRandomInt(0, 10) % 5 !== 0 ? 'income' : 'expense'
    });
  }

  let transaction_category: any = transactions.map((t: any, ind: number) => {
    const categoryId =
      t.income_or_expense === 'income'
        ? getRandomInt(6, 7)
        : getRandomInt(1, 5);
    return {
      category_id: categoryId,
      transaction_id: ind + 1,
      ispublic: true
    };
  });
  return {
    transaction_category,
    transactions
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== 'development') {
    res.status(500).json({
      error: { statusCode: 500, message: 'Cannot Create Data In Production' }
    });
  }
  console.log('creating demo data api route');
  try {
    // const expenseCategories = [
    //   'food',
    //   'gas',
    //   'bills',
    //   'mortgage',
    //   'entertainment'
    // ];

    // const formattedExpenseCategories = expenseCategories.map((c) => ({
    //   name: c,
    //   ispublic: true,
    //   income_or_expense: 'expense'
    // }));

    // const incomeCategories = ['salary', 'freelancing'];

    // const formattedIncomeCategories = incomeCategories.map((c) => ({
    //   name: c,
    //   ispublic: true,
    //   income_or_expense: 'income'
    // }));

    // const resData = await supabaseAdmin
    //   .from('categories')
    //   .insert([...formattedExpenseCategories, ...formattedIncomeCategories]);

    const data = createTransactions();

    const { data: resData, error } = await supabaseAdmin
      .from('transactions')
      .insert(data.transactions);

    if (error) {
      throw error;
    }

    const { data: tcData, error: tcErr } = await supabaseAdmin
      .from('transaction_category')
      .insert(data.transaction_category);

    if (tcErr) {
      throw tcErr;
    }

    console.log('data: ', { tcData, resData });

    return res.status(200).json({ data: resData });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};

export default handler;

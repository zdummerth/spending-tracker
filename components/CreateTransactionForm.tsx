import { useReducer } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import isCurrency from 'validator/lib/isCurrency';
import LoadingDots from 'components/ui/LoadingDots';
import useDemoData from 'utils/useDemoData';
import { useAppState } from '@/utils/useAppState';

enum ActionType {
  SET_AMOUNT = 'set_amount',
  SET_LOADING = 'set_loading',
  SET_CATEGORY = 'set_category',
  SET_ERROR = 'set_error',
  SET_SUCCEEDED = 'set_succeeded'
}

interface Action {
  type: ActionType;
  payload?: any;
}

interface State {
  loading: boolean;
  error: boolean;
  amount: string;
  category: {
    name: string;
    income_or_expense: string;
    id: number;
  };
}

const CategorySelect = ({
  onChange,
  currentCategory
}: {
  onChange: any;
  currentCategory: any;
}) => {
  const { data, error, loading } = useDemoData({
    action: 'get_all_category_names'
  });

  const handleChange = (e: any) => {
    if (!data?.data) return;
    const cat = data.data.find((c: any) => c.name === e.target.value);
    if (!cat) return;
    onChange(cat);
  };

  if (loading) {
    return <LoadingDots />;
  }
  if (!data?.data) {
    toast.error('Unable to load categories. Please reload.', {
      autoClose: false
    });
    return null;
  }
  return (
    <>
      <label htmlFor="categories" className="block">
        Category
      </label>

      <select
        name="categories"
        id="categories"
        className="bg-slate-900 mt-2 p-2"
        onChange={handleChange}
        value={currentCategory.name}
      >
        {data.data.map((cat: any) => {
          return (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default function CreateTransactionForm({
  onSubmit
}: {
  onSubmit?: any;
}) {
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case ActionType.SET_AMOUNT:
        return { ...state, amount: action.payload };
      case ActionType.SET_CATEGORY:
        return { ...state, category: action.payload };
      case ActionType.SET_LOADING:
        return { ...state, loading: true, error: false };
      case ActionType.SET_ERROR:
        return { ...state, loading: false, error: action.payload };
      case ActionType.SET_SUCCEEDED:
        return { ...state, loading: false, error: false, amount: '' };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: false,
    amount: '',
    category: {
      name: 'food',
      income_or_expense: 'expense',
      id: 1
    }
  });

  const { setEndingDateToNow } = useAppState();

  const createTransaction = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const verifyAmount = () => {
      if (!isCurrency(state.amount)) {
        throw { message: 'Amount must be a valid US currency' };
      }

      return Math.round(parseFloat(state.amount) * 100);
    };
    dispatch({ type: ActionType.SET_LOADING });
    try {
      const verifiedAmount = verifyAmount();
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          amount: verifiedAmount,
          categoryId: state.category.id,
          income_or_expense: state.category.income_or_expense
        })
      });

      if (response.ok) {
        // Must reset the date range or the new transaction won't be included
        setEndingDateToNow();
        toast.success('Transaction Added');
        dispatch({ type: ActionType.SET_SUCCEEDED });
      } else {
        const { error } = await response.json();
        throw error;
      }
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error });
      toast.error(error.message, {
        autoClose: false
      });
    }
  };

  return (
    <section className="bg-black">
      <div className="text-xl font-semibold">
        <div>
          <form onSubmit={createTransaction}>
            <CategorySelect
              onChange={(category: any) =>
                dispatch({ type: ActionType.SET_CATEGORY, payload: category })
              }
              currentCategory={state.category}
            />
            <label htmlFor="username" className="block mt-2">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              className="bg-slate-900 p-2"
              placeholder="$0.00"
              value={state.amount}
              onChange={(e) =>
                dispatch({
                  type: ActionType.SET_AMOUNT,
                  payload: e.target.value
                })
              }
            />
            <div className="p-2">
              {state.loading ? (
                <div className="h-8 mb-6">
                  <LoadingDots />
                </div>
              ) : (
                <div className="h-4">
                  <button className="mr-2" type="submit">
                    Submit
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

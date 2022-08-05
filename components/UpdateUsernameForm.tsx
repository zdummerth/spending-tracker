import Link from 'next/link';
import { useState, ReactNode, FormEventHandler } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

import { withAuthRequired, User } from '@supabase/supabase-auth-helpers/nextjs';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' });

export default function UpdateUsernameForm({
  defaultUsername,
  onSubmit
}: {
  defaultUsername: string;
  onSubmit: any;
}) {
  const [loading, setLoading] = useState(false);
  const [tempUsername, setTempUsername] = useState(defaultUsername);

  const updateUsername = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const username = await postData({
      //   url: '/api/update-username',
      //   data: {
      //     username: tempUsername
      //   }
      // });
      await onSubmit(tempUsername);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <section className="bg-black">
      <div className="text-xl font-semibold">
        <div>
          <form onSubmit={updateUsername}>
            <label htmlFor="username" className="block p-2">
              username
            </label>
            <input
              type="text"
              id="username"
              className="bg-slate-900"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
            />
            <div className="p-2">
              {loading ? (
                <div className="h-8 mb-6">
                  <LoadingDots />
                </div>
              ) : (
                <div className="h-4">
                  {defaultUsername !== tempUsername && (
                    <>
                      <button className="mr-2" type="submit">
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempUsername(defaultUsername)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

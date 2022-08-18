import { useState, ReactNode } from 'react';
import UpdateUsernameForm from '@/components/UpdateUsernameForm';
import LoadingDots from 'components/ui/LoadingDots';
import { useUser } from 'utils/useUser';

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

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, userDetails, updateUsername } = useUser();

  return (
    <section className="bg-black mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="text-xl font-semibold">
            {userDetails ? (
              <div>
                <UpdateUsernameForm
                  defaultUsername={
                    userDetails?.username ? userDetails.username : ''
                  }
                  onSubmit={updateUsername}
                />
              </div>
            ) : (
              <div className="h-8 mb-6">
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card title="Your Email">
          <p className="text-xl mt-8 mb-4 font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
    </section>
  );
}

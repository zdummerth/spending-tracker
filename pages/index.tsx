import Image from 'next/image';
import { GetServerSideProps } from 'next';
import bannerimg from 'public/moneymap.jpg';
import Money from 'components/icons/Money';
import Link from 'next/link';
import { getUser } from '@supabase/auth-helpers-nextjs';

const Spacer = () => (
  <div className="flex items-center my-6">
    <div
      className="border-t border-zinc-600 flex-grow mr-3"
      aria-hidden="true"
    ></div>
    <div className="text-zinc-400">Or</div>
    <div
      className="border-t border-zinc-600 flex-grow ml-3"
      aria-hidden="true"
    ></div>
  </div>
);

export default function PricingPage(props: any) {
  const { user } = props;
  return (
    <div>
      <div className="relative width-full">
        <Image
          src={bannerimg}
          alt="Picture of the author"
          layout="responsive"
          placeholder="blur"
        />
        <i className="text-sm absolute top-0 p-2 bg-black/50">
          Photo by{' '}
          <a href="https://unsplash.com/es/@agent_illustrateur?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Christine Roy
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com/s/photos/finance?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </i>
      </div>
      <h1 className="text-center p-4 text-xl">
        Welcome to the spending tracker by Integral Developing
      </h1>
      <div className="flex justify-center w-full">
        <div className="w-20 h-20">
          <Money />
        </div>
      </div>
      <div
        // className="flex flex-col items-center mt-6"
        className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 text-center"
      >
        {user ? (
          <>
            <Link href="/demo">
              <a className="border border-green-400 p-2 rounded">
                View Transactions
              </a>
            </Link>
          </>
        ) : (
          <>
            <Link href="/signin">
              <a className="border border-green-400 p-2 rounded">Sign In</a>
            </Link>
            <Spacer />
            <Link href="/signin">
              <a className="border border-green-400 p-2 rounded">
                Create Account
              </a>
            </Link>
            <Spacer />
            <Link href="/dashboard">
              <a className="border p-2 rounded">View Demo Dashboard</a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get user on the server to avoid loading state
  const { user } = await getUser(context);
  return {
    props: {
      user
    }
  };
};

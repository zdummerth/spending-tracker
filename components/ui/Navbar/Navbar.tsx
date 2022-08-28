import Link from 'next/link';
import s from './Navbar.module.css';

import Plus from 'components/icons/Plus';
import User from 'components/icons/User';
import Home from 'components/icons/Home';
import Settings from 'components/icons/Settings';
import { useUser } from 'utils/useUser';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <nav className="fixed bg-black w-full bottom-0">
      <div className="flex justify-around items-center mx-auto max-w-6xl p-2">
        <Link href="/create-transaction">
          <a className={s.logo} aria-label="Create Transaction">
            <div className="flex flex-col items-center">
              <div className="relative border p-2 rounded-full bg-green-200 text-black">
                <Plus />
              </div>
              <i className="text-sm">New Transaction</i>
            </div>
          </a>
        </Link>
        <Link href="/dashboard">
          <a>
            <div className="flex flex-col items-center">
              <div className=" p-2">
                <Home />
              </div>
              <i className="text-xs">Dashboard</i>
            </div>
          </a>
        </Link>
        {user ? (
          <Link href="account">
            <a>
              <div className="flex flex-col items-center">
                <div className=" p-2">
                  <Settings />
                </div>
                <i className="text-xs">Settings</i>
              </div>
            </a>
          </Link>
        ) : (
          <Link href="/signin">
            <a>
              <div className="flex flex-col items-center">
                <div className=" p-2">
                  <User />
                </div>
                <i className="text-xs">Sign In</i>
              </div>
            </a>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

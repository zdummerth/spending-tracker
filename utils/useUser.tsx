import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  User
} from '@supabase/supabase-auth-helpers/react';
import { UserDetails } from 'types';
import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { postData } from 'utils/helpers';
import { updateUserName as updateUsernameDB } from 'utils/supabase-client';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  updateUsername(username: string): any;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  supabaseClient: SupabaseClient;
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const { supabaseClient: supabase } = props;
  const { user, accessToken, isLoading: isLoadingUser } = useSupaUser();
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const getUserDetails = () =>
    supabase.from<UserDetails>('users').select('*').single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsloadingData(true);
      Promise.allSettled([getUserDetails()]).then((results) => {
        const userDetailsPromise = results[0];

        if (userDetailsPromise.status === 'fulfilled')
          setUserDetails(userDetailsPromise.value.data);

        setIsloadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
    }
  }, [user, isLoadingUser]);

  const updateUsername = async (username: string) => {
    const data = await updateUsernameDB(user?.id ? user.id : '', username);
    setUserDetails({
      ...userDetails,
      ...data
    });
    console.log('user update response: ', data);
  };

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    supabase,
    updateUsername
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};

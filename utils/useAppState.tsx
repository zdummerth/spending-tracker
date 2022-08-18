import React, { useState, useContext } from 'react';
// import { useRouter } from 'next/router';

type AppContextType = {
  isMenuOpen: boolean;
  isCartOpen: boolean;
  endingDate: Date;
  startingDate: Date;
  currentDateRange: string;
  openMenu(): any;
  closeMenu(): any;
  toggleMenu(): any;
  dateRangeDispatch(range: string): any;
};

const AppStateContext = React.createContext<AppContextType | undefined>(
  undefined
);

export const AppStateContextProvider = ({ children }: { children: any }) => {
  const getPreviousSunday = (date = new Date()) => {
    const previousMonday = new Date();
    previousMonday.setDate(date.getDate() - date.getDay());
    return previousMonday;
  };
  const getFirstOfMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

  const getFirstOfYear = (date = new Date()) =>
    new Date(date.getFullYear(), 0, 1);

  const now = new Date();

  const [appState, setAppState] = useState({
    isMenuOpen: false,
    isCartOpen: false,
    endingDate: now,
    startingDate: getPreviousSunday(now),
    currentDateRange: 'this-week'
  });

  const dateRangeDispatch = (range: string) => {
    const dateFunction = (func: any, range: string) =>
      setAppState((prev) => ({
        ...prev,
        startingDate: func(),
        currentDateRange: range
      }));
    switch (range) {
      case 'this-week':
        dateFunction(getPreviousSunday, range);
        break;
      case 'this-month':
        dateFunction(getFirstOfMonth, range);
        break;
      case 'this-year':
        dateFunction(getFirstOfYear, range);
        break;
      default:
        dateFunction(getPreviousSunday, 'this-week');
    }
  };

  const openMenu = () =>
    setAppState({ ...appState, isMenuOpen: true, isCartOpen: false });
  const close = () =>
    setAppState({ ...appState, isMenuOpen: false, isCartOpen: false });
  const toggleMenu = () =>
    setAppState({
      ...appState,
      isMenuOpen: !appState.isMenuOpen,
      isCartOpen: false
    });

  // const router = useRouter();

  // useEffect(() => {
  //   router.events.on('routeChangeComplete', close);

  //   return () => {
  //     router.events.off('routeChangeComplete', close);
  //   };
  // }, []);

  return (
    <AppStateContext.Provider
      value={{
        isCartOpen: appState.isCartOpen,
        isMenuOpen: appState.isMenuOpen,
        currentDateRange: appState.currentDateRange,
        openMenu,
        closeMenu: close,
        toggleMenu,
        dateRangeDispatch,
        startingDate: appState.startingDate,
        endingDate: appState.endingDate
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [servingList, setServingList] = useState([]);
  const [prizes, setPrizes] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [money, setMoney] = useState(0);

  // 🔥 NEW (sidebar state)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        events,
        setEvents,
        servingList,
        setServingList,
        prizes,
        setPrizes,
        transactions,
        setTransactions,
        money,
        setMoney,

        // sidebar
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
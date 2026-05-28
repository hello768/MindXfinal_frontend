import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {

    const savedID = localStorage.getItem("hubID");

    return savedID ? { hubID: savedID } : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.hubID) {
      localStorage.setItem("hubID", user.hubID);
    } else if (user === null) {
      localStorage.removeItem("hubID");
    }
    setLoading(false);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
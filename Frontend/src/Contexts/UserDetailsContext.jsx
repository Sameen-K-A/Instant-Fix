import React, { useContext, createContext, useState } from "react";

const UserDetailsContext = createContext(null);
export const useUserDetails = () =>  useContext(UserDetailsContext);

const UserProvider = ({ children }) => {
   const [userDetails, setUserDetails] = useState(() => {
      const userDetailsFromSessionStorage = sessionStorage.getItem("userDetails");
      return userDetailsFromSessionStorage ? JSON.parse(userDetailsFromSessionStorage) : null;
   });

   return (
      <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
         {children}
      </UserDetailsContext.Provider>
   );
};

export default UserProvider;
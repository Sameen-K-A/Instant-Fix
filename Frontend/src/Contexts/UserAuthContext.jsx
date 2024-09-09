import React, { useContext, createContext, useState } from "react";

const UserAuthContext = createContext(null);
export const useUserAuthContext = () => useContext(UserAuthContext);

const UserAuthProvider = ({ children }) => {
   const [isLogged, setIsLogged] = useState(() => {
      const userAuthData = localStorage.getItem("userIsLogged");
      return userAuthData ? JSON.parse(userAuthData) : false;
   });

   return (
      <UserAuthContext.Provider value={{ isLogged, setIsLogged }}>
         {children}
      </UserAuthContext.Provider>
   );
};

export default UserAuthProvider;
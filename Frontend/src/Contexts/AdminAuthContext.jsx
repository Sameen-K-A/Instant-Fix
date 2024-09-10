import React, { useContext, createContext, useState } from "react";

const AdminAuthContext = createContext(null);
export const useAdminAuthContext = () => useContext(AdminAuthContext);

const AdminAuthProvider = ({ children }) => {
   const [adminIsLogged, setAdminIsLogged] = useState(() => {
      const adminAuthData = localStorage.getItem("adminIsLogged");
      return adminAuthData ? JSON.parse(adminAuthData) : false;
   });

   return (
      <AdminAuthContext.Provider value={{ adminIsLogged, setAdminIsLogged }}>
         {children}
      </AdminAuthContext.Provider>
   );
};

export default AdminAuthProvider;
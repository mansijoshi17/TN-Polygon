import React, { useState, createContext, useEffect, useCallback } from "react";

import { collection, addDoc, getDocs, db } from "../firebase";

export const firebaseDataContext = createContext(undefined);

export const FirebaseDataContextProvider = (props) => {
  const [customers, setCustomers] = useState([]);

  async function getCustomers() {
    const customers = collection(db, "customers");
    const customerSnapshot = await getDocs(customers);
    const customersList = customerSnapshot.docs.map((doc) => doc.data());
    setCustomers(customersList);
  }

  return (
    <firebaseDataContext.Provider
      value={{
        getCustomers,
        customers,
      }}
      {...props}
    >
      {props.children}
    </firebaseDataContext.Provider>
  );
};

import React, { useState, createContext, useEffect, useCallback } from "react";

import { collection, addDoc, getDocs, db } from "../firebase";

export const firebaseDataContext = createContext(undefined);

export const FirebaseDataContextProvider = (props) => {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  async function getCustomers() {
    const customers = collection(db, "customers");
    const customerSnapshot = await getDocs(customers);
    const customersList = customerSnapshot.docs.map((doc) => doc.data());
    setCustomers(customersList);
  }

  async function getInvoices() {
    const invoices = collection(db, "invoices");
    const invoiceSnapshot = await getDocs(invoices);
    const invoicesList = invoiceSnapshot.docs.map((doc) => {
      let obj = doc.data();
      obj.id = doc.id;
      return obj;
    });
  
    setInvoices(invoicesList);
  }

  return (
    <firebaseDataContext.Provider
      value={{
        getCustomers,
        getInvoices,
        customers,
        invoices,
      }}
      {...props}
    >
      {props.children}
    </firebaseDataContext.Provider>
  );
};

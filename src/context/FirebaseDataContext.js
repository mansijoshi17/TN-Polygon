import React, { useState, createContext, useEffect, useCallback } from "react";

import { collection, addDoc, getDocs, db, query, where } from "../firebase";

import { useMoralis } from "react-moralis";

export const firebaseDataContext = createContext(undefined);

export const FirebaseDataContextProvider = (props) => {
  const { user } = useMoralis();
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getCustomers() {
    setLoading(true)
    try {
      const customers = query(
        collection(db, "customers"),
        where("admin", "==", localStorage.getItem("user"))
      );

      const customerSnapshot = await getDocs(customers);

      const customersList = customerSnapshot.docs.map((doc) => doc.data());
      setCustomers(customersList);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  async function getInvoices() {
    setLoading(true);
    const invoices = collection(db, "invoices");
    const invoiceSnapshot = await getDocs(invoices);
    const invoicesList = invoiceSnapshot.docs.map((doc) => {
      let obj = doc.data();
      obj.id = doc.id;
      return obj;
    });

    setInvoices(invoicesList);
    setLoading(false)
  }

  useEffect(()=>{
    getPayments();
    getInvoices();
  },[])

  async function getPayments() {
    setLoading(true);
    const payments = collection(db, "payments");
    const paymentSnapshot = await getDocs(payments);
    const paymentsList = paymentSnapshot.docs.map((doc) => {
      let obj = doc.data();
      obj.id = doc.id;
      return obj;
    });

    setPayments(paymentsList);
    setUpdated(!updated);
    setLoading(false)
  }

  return (
    <firebaseDataContext.Provider
      value={{
        getCustomers,
        getInvoices,
        getPayments,
        customers,
        invoices,
        payments,
        updated,
        loading,
      }}
      {...props}
    >
      {props.children}
    </firebaseDataContext.Provider>
  );
};

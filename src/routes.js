import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LendingPageLayout from "./layouts/LendingPageLayout"; 
import DashboardApp from "./pages/DashboardApp"; 
import NotFound from "./pages/Page404"; 
import UserProfile from "./layouts/dashboard/UserProfile"; 
import Lending from "./LendingPage/Lending";  
import Invoice from "./pages/Invoice";  
import Customers from "./pages/Customers";
import SentPayments from "./pages/RecurringPayments/SentPayments";
import ReceivedPayments from "./pages/RecurringPayments/ReceivedPayments";
import InvoiceDetail from "./pages/InvoiceDetail";
import Agreement from "./pages/Agreement";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "app", element: <DashboardApp /> },    
        { path: "userProfile", element: <UserProfile /> },
        { path: "Agreement", element: <Agreement /> },
        { path: "invoice", element: <Invoice /> },  
        { path: "customers", element: <Customers /> },
        { path: "payments/sent", element: <SentPayments /> },
        { path: "payments/receive", element: <ReceivedPayments /> },
      ],
    }, 
    {
      path: "/",
      element: <LendingPageLayout />,
      children: [
        { path: "/", element: <Lending /> },
        { path: "/invoice/:id", element: <InvoiceDetail /> }, 
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> }, 
    { path: "404", element: <NotFound /> },
    { path: "*", element: <Navigate to="/404" /> },
  ]);
}

// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [ 
  {
    title: "Escrow Agreements",
    path: "/dashboard/agreement",
    icon: getIcon("icon-park-outline:agreement"),
  },
  {
    title: "Customers",
    path: "/dashboard/customers",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "Invoice",
    path: "/dashboard/invoice",
    icon: getIcon("uil:invoice"),
  }, 
  {
    title: "Recurring Payments",
    path: "/dashboard/payments",
    icon: getIcon("fluent:wallet-credit-card-24-filled"),
    children: [
      {
        title: "Sent Payments",
        path: "/dashboard/payments/sent",
        icon: getIcon("uil:send"),
      },
      {
        title: "Received Payments",
        path: "/dashboard/payments/receive",
        icon: getIcon("uil:receive"),
      },
    ],
  },
   
];

export default sidebarConfig;

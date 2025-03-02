import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';

import Loadable from '../layouts/full/shared/loadable/Loadable';
import Registration from '../views/formsdata/companyRegistration/Registration';
import Response from '../views/formsdata/responsesManage/Response';
import ContractManagement from '../views/forms/ContractManagement/ContractManagement';
import ContactsSection from '../views/formsdata/companyRegistration/ContactsSection';
import DelegateRegister from '../views/formsdata/delegateData/DelegateRegister';
import AssetsClassifications from '../views/formsdata/assetClassification/AssetsClassifications';
import EquipmentsClassifications from '../views/formsdata/EquipmentsClassifications/EquipmentsClassifications';
// import Response from '../views/formsdata/responsesManage/Response';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));
// const Response = Loadable(lazy(() => import('../views/forms/responsesManage/Response')));
const Router = [
  {
    path: '/',
    // element:<></>, // ProtectedRoute
    children: [
      {
        element: <FullLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboards/modern" /> },
          { path: '/dashboards/modern', exact: true, element: <ModernDash /> },
          { path: '/maininfo', element: <Registration /> },
          { path: '/contacts', element: <ContactsSection /> },
          { path: '/response', element: <Response /> },
          { path: '/contractManagement', element: <ContractManagement /> },
          { path: '/AssetsClassifications', element: <AssetsClassifications /> },
          { path: '/EquipmentsClassifications', element: <EquipmentsClassifications /> },
          { path: '/delegateData', element: <DelegateRegister /> },

          { path: '*', element: <Navigate to="/auth/404" /> },
        ]
      }

    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      // {
      //   path: '/',
      //   element: <PublicRoute />,
      //   children: [{ path: '/login', element: <Login /> }], /// PublicRoute
      // },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;

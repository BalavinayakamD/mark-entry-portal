import React, { Suspense, lazy } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { createTheme } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider, useLocation, Outlet } from "react-router-dom";
import Applayout from "../../layout/Applayout";
import Skeleton from '@mui/material/Skeleton';

const Home = lazy(() => import("../../pages/home/Home"));
const Mainpage = lazy(() => import("../../pages/dashboard/Mainpage"));
const Login = lazy(() => import("../loginandsignup/Login"));

const mainTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={400} />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={400} />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "dashboard",
    element: <Applayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={400} />}>
            <Mainpage />
          </Suspense>
        ),
      },
      //add any path inside the dashboard here :D
    ],
  },
]);

const NAVIGATION = [
  {
    kind: "header",
    title: "Main Menu",
  },
  {
    segment: "/board/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon sx={{ color: "darkorange !important" }} />,
  },
];

function Navigation() {
  const location = useLocation();
  return (
    <nav>
      {NAVIGATION.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: location.pathname === item.segment ? "#f0f0f0" : "transparent",
          }}
        >
          {item.icon}
          {item.title}
        </div>
      ))}
    </nav>
  );
}

export default function Dashboard() {
  return (
    <AppProvider theme={mainTheme} router={router} navigation={NAVIGATION} branding={{
      title: 'Mark Portal',
      homeUrl: '/toolpad/core/introduction',
    }}>
      <RouterProvider router={router}>
        <Navigation />
        <Outlet />
      </RouterProvider>
    </AppProvider>
  );
}

import { lazy } from "react";

const Login = lazy(() => import("../src/pages/login/Login"));
const Home = lazy(() => import("../src/pages/home/Home"));
const clientForm = lazy(() => import("./pages/client_form/ClForm"));
const artists = lazy(() => import("./pages/Artist/Artists"));
const Consent = lazy(() => import("./pages/consent/Consent"));
// const logs = lazy(() => import("./pages/logs/Logs"));

export const routes = [
  {
    path: "/login",
    element: Login,
    exact: true,
    isPublic: true,
  },
  {
    path: "/",
    element: Home,
    exact: true,
    admin: true,
  },
  {
    path: "/cleints",
    element: clientForm,
    exact: true,
  },
  {
    path: "/artists",
    element: artists,
    exact: true,
    admin: true,
  },
  {
    path: "/consent",
    element: Consent,
    exact: true,
  },
  // {
  //   path: "/logs",
  //   element: logs,
  //   exact: true,
  //   admin: true,
  // },
];

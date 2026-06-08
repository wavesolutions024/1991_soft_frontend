import { lazy } from "react";

const login = lazy(() => import("../src/pages/login/Login"));
const home = lazy(() => import("../src/pages/home/Home"));
const clientForm = lazy(() => import("./pages/client_form/ClForm"));
const artists = lazy(() => import("./pages/Artist/Artists"));
const consent = lazy(() => import("./pages/consent/Consent"));
const logs = lazy(() => import("./pages/logs/Logs"));

export const routes = [
  {
    path: "/login",
    element: login,
    exact: true,
    isPublic: true,
  },
  {
    path: "/",
    element: home,
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
    element: consent,
    exact: true,
  },
  {
    path: "/logs",
    element: logs,
    exact: true,
    admin: true,
  },
];

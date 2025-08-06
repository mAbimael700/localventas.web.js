import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routesIndex } from "./routes/routes-index.jsx";
import { routesDashboard } from "./routes/routes-dashboard.jsx";
import { routesCommerce } from "./routes/routes-commerce.jsx";
import { AuthProvider } from "./auth/auth-provider.jsx";

const router = createBrowserRouter([
  ...routesIndex,
  routesDashboard,
  routesCommerce,
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

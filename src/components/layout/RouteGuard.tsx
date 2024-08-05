import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./Navbar";

const validRoutes = ["/products", "/products/create", "/users"];

const isValidDynamicRoute = (pathname: string) => {
  const dynamicProductRoutePattern = /^\/products\/\d+$/;
  return dynamicProductRoutePattern.test(pathname);
};

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const isValidRoute = validRoutes.includes(path) || isValidDynamicRoute(path);

  const isValidQueryRoute =
    isValidRoute || (path.startsWith("/products/") && isValidDynamicRoute(path.split("?")[0]));

  const isNotFoundPage = !isValidQueryRoute;

  return (
    <div>
      {!isNotFoundPage && <Navbar />}
      {children}
    </div>
  );
};

export default RouteGuard;

import React from "react";
import { Navigate, RouteProps, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../store";
import ProductInsUpd from "../product/ProductInsUpd";

const PrivateRoute: React.FC<RouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (mode === "edit") {
    return <ProductInsUpd edit={true} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "./store/userSlice";

import Login from "./pages/Login";
import Products from "./pages/Products";

import ProductInsUpd from "./components/product/ProductInsUpd";
import Users from "./components/users/Users";
import NotFound from "./pages/NotFound";
import ProductView from "./components/product/ProductView";
import PrivateRoute from "./components/layout/PrivateRoute";
import RouteGuard from "./components/layout/RouteGuard";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles/global.scss";

const App: React.FC = () => {
  const dispatch = useDispatch();

  const resetTimer = () => {
    let timer: NodeJS.Timeout;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => dispatch(logout()), 5 * 60 * 1000);
    };
  };

  window.addEventListener("mousemove", resetTimer());
  window.addEventListener("keypress", resetTimer());

  return (
    <Router>
      <RouteGuard>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/create"
            element={
              <PrivateRoute>
                <ProductInsUpd />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <ProductView />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteGuard>
    </Router>
  );
};

export default App;

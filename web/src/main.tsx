import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "./assets/bootstrap.css";
import "./assets/index.css";
import App from "./App.tsx";

import { store } from "./store";

import Home from "./pages/Home.tsx";
import Product from "./pages/Product.tsx";
import CartPage from "./pages/Cart.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Profile from "./pages/Profile.tsx";
import Shipping from "./pages/Shipping.tsx";
import PrivateRoute from "./components/PrivateRoutes.tsx";
import Payments from "./pages/Payments.tsx";
import PlaceOrder from "./pages/PlaceOrder.tsx";
import OrderScreen from "./pages/Order.tsx";
import AdminRoute from "./components/AdminRoutes.tsx";
import OrderList from "./pages/admin/OrdersList.tsx";
import ProductList from "./pages/admin/ProductsList.tsx";
import ProductEdit from "./pages/admin/ProductEdit.tsx";
import UsersList from "./pages/admin/UsersList.tsx";
import UserEdit from "./pages/admin/UserEdit.tsx";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/products/:id" element={<Product />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payments />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<OrderScreen />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orders" element={<OrderList />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/user/:id/edit" element={<UserEdit />} />
      </Route>
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={{ clientId: "test" }}>
        <RouterProvider router={routes} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>,
);

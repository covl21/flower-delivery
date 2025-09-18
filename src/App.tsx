import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShopsPage from "./pages/ShopsPage";
import CartPage from "./pages/CartPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import Header from "./components/Header";
import OrderLookupPage from "./pages/OrderLookupPage";
import CouponsPage from "./pages/CouponsPage";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ShopsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-lookup" element={<OrderLookupPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Routes>
    </Router>
  );
}

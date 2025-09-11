import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShopsPage from "./pages/ShopsPage";
import CartPage from "./pages/CartPage";
//import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ShopsPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Routes>
    </Router>
  );
}

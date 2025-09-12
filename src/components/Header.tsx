// src/components/Header.tsx
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-section">
          <img src="/public/icons/shop.png" alt="shop" />
          <span>Shop</span>
        </Link>
        <Link to="/cart" className="header-section">
          <img src="/public/icons/cart.png" alt="cart" />
          <span>Shoping Cart</span>
        </Link>
      </div>

      <h1>
        Flower-delivery <img src="/public/icons/flower.png" alt="flower" />
      </h1>
    </header>
  );
}

import { useContext, useState } from "react"; 
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import emptyCartImg from "../assets/empty_cart.png";
import { FaTrash } from "react-icons/fa";

export default function CartPage() {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  if (!cartContext) return null;

  const { cart, updateQuantity, removeFromCart, clearCart } = cartContext;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !phone || !address) {
    alert("Please fill in all fields!");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const now = new Date(); // поточний час користувача
  const orderPayload = {
    email,
    phone,
    address,
    products: cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image 
    })),
    totalPrice,
    date: now.toISOString(), // передаємо на сервер дату у форматі UTC
  };

  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error saving order");
    }

    const savedOrder = await response.json();
    clearCart();
    alert("Order placed successfully!");
    navigate("/order-confirmation", { state: savedOrder });
  } catch (err: any) {
    console.error(err);
    alert(`Error placing order: ${err.message}`);
  }
};


  // --- Порожня корзина ---
  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Your cart is empty</h2>
        <img src={emptyCartImg} alt="Empty Cart" />
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {/* Ліва колонка: список товарів */}
      <div className="cart-items-column">
        <h2>Your Cart</h2>
        <div className="cart-container">
          {cart.map((item) => (
            <div key={item.product.id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} />
              <div className="cart-item-details">
                <h4>{item.product.name}</h4>
                <p>${item.product.price}</p>
              </div>
              <div className="cart-item-actions">
                <button
                  className="quantity-btn"
                  onClick={() =>
                    updateQuantity(
                      item.product.id,
                      item.quantity > 1 ? item.quantity - 1 : 1
                    )
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <div className="cart-footer">
            <h3>Total: ${totalPrice}</h3>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Права колонка: форма оформлення замовлення */}
      <div className="order-form-column">
        <h2>Order Details</h2>
        <form onSubmit={handleSubmit} className="order-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit" className="checkout-btn">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

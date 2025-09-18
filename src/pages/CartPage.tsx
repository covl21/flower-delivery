// src/pages/CartPage.tsx
import { useContext, useState, useRef } from "react"; 
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import emptyCartImg from "../assets/empty_cart.png";
import { FaTrash } from "react-icons/fa";
import Map from "../components/Map";
import ReCAPTCHA from "react-google-recaptcha";

export default function CartPage() {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null); 
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Купони
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  if (!cartContext) return null;
  const { cart, updateQuantity, removeFromCart, clearCart } = cartContext;

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountedPrice = totalPrice - (totalPrice * discount) / 100;

  const shopLocation = cart[0]?.product.shopLocation || { lat: 50.4501, lng: 30.5234 };

  const applyCoupon = async () => {
    setCouponError("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/coupons/${couponCode}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      const coupon = await res.json();
      setDiscount(coupon.discount);
    } catch (err: any) {
      setDiscount(0);
      setCouponError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showCaptcha) {
      setShowCaptcha(true);
      return;
    }

    if (!email || !phone || !address || !userLocation) {
      alert("Please fill in all fields and select your location on the map!");
      return;
    }

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      alert("Please complete the captcha!");
      return;
    }

    const now = new Date(); 
    const orderPayload = {
      email,
      phone,
      address,
      location: userLocation,
      products: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        shopId: item.product.shopId
      })),
      totalPrice: discountedPrice,
      appliedCoupon: discount > 0 ? couponCode : null,
      discount,
      date: now.toISOString(),
      recaptchaToken: token,
    };

    console.log("Submitting order payload:", orderPayload);

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
      console.error("Order submission error:", err);
      alert(`Error placing order: ${err.message}`);
    }
  };

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
                <button className="quantity-btn" onClick={() => updateQuantity(item.product.id, Math.max(item.quantity - 1, 1))}>-</button>
                <span>{item.quantity}</span>
                <button className="quantity-btn" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                <button className="remove-btn" onClick={() => removeFromCart(item.product.id)}><FaTrash /></button>
              </div>
            </div>
          ))}


                        {/* Купон */}
              <div className="coupon-section" style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "12px",
                background: "#ffe0b2",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}>
                <h3 style={{ margin: 0, color: "#4a2f1b" }}>Apply Coupon</h3>
                <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "400px" }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "16px"
                    }}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: discount > 0 ? "#43a047" : "#4a2f1b",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = discount > 0 ? "#388e3c" : "#a3623b"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = discount > 0 ? "#43a047" : "#4a2f1b"}
                  >
                    {discount > 0 ? "Applied" : "Apply"}
                  </button>
                </div>

                {couponError && <p style={{ color: "red", margin: 0 }}>{couponError}</p>}
                {discount > 0 && (
                  <p style={{
                    color: "#2e7d32",
                    fontWeight: "bold",
                    margin: 0,
                    marginTop: "5px",
                    fontSize: "16px"
                  }}>
                    Coupon applied: {discount}% OFF
                  </p>
                )}
              </div>


          <div className="cart-footer">
            <h3>
              Total: ${discountedPrice.toFixed(2)}{" "}
              {discount > 0 && <span style={{ textDecoration: "line-through", color: "#ffe0b2", marginLeft: "10px" }}>${totalPrice.toFixed(2)}</span>}
            </h3>
            <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>
      </div>

      <div className="order-form-column">
        <h2>Order Details</h2>
        <form onSubmit={handleSubmit} className="order-form">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
          <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />

          <Map
            shopLocation={shopLocation}
            userAddress={address}
            setUserLocation={setUserLocation}
            setUserAddress={setAddress}
            setDeliveryTime={setDeliveryTime}
          />

          {deliveryTime && (
            <div style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "#e3f2fd",
              border: "1px solid #90caf9",
              borderRadius: "5px",
              fontWeight: "bold",
              color: "#0d47a1",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
            }}>
              Approximate delivery time: {deliveryTime}
            </div>
          )}

          {showCaptcha && (
            <div style={{ marginTop: "15px" }}>
              <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} ref={recaptchaRef}/>
            </div>
          )}

          <button type="submit" className="checkout-btn" style={{ marginTop: "15px" }}>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

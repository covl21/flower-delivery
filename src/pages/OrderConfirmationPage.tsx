// src/pages/OrderConfirmationPage.tsx
import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state;

  if (!order) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>No order information</h1>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt || order.date);
  const formattedDate = orderDate.toLocaleString();

  const hasDiscount = order.appliedCoupon && order.appliedCoupon !== "";
  const discount = order.discount || 0; 

  const originalTotal = order.originalTotalPrice || order.totalPrice;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        backgroundColor: "#4a2f1b"
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          backgroundColor: "#ffffffcb",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "10px", fontSize: "28px", color: "#4a2f1b" }}>
          Thank you for your order!
        </h1>
        <p style={{ marginBottom: "30px", fontWeight: "bold", color: "#000000ff" }}>
          Order ID: {order._id || order.id}
        </p>

        {/* Список товарів */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {order.products.map((item: any) => (
            <div
              key={item.productId || item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "10px 0",
                borderBottom: "1px solid #4a2f1b",
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              <div style={{ flex: 1, textAlign: "left" }}>
                <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                <p style={{ margin: 0, color: "#000000ff" }}>
                  {item.quantity} × ${item.price} = ${item.quantity * item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total з купоном */}
        <hr style={{ margin: "20px 0", borderColor: "#4a2f1b" }} />
        <h3 style={{ marginBottom: "10px", textAlign: "right" }}>
          Total: ${order.totalPrice.toFixed(2)}{" "}
          {hasDiscount && (
            <span style={{ textDecoration: "line-through", color: "gray", marginLeft: "10px" }}>
              ${originalTotal.toFixed(2)}
            </span>
          )}
        </h3>
        {hasDiscount && (
          <p style={{ textAlign: "right", color: "green", fontWeight: "bold" }}>
            Coupon "{order.appliedCoupon}" applied ({discount}% OFF)
          </p>
        )}

        {/* Інформація про замовника */}
        <div style={{ textAlign: "left", color: "#000000ff", lineHeight: 0.6 }}>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Order Date & Time:</strong> {formattedDate}
          </p>
        </div>

        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "30px",
            textDecoration: "none",
            color: "#fff",
            backgroundColor: "#4a2f1b",
            padding: "10px 20px",
            borderRadius: "8px",
            transition: "background 0.2s",
          }}
          onMouseOver={(e: any) => (e.currentTarget.style.backgroundColor = "#a3623b")}
          onMouseOut={(e: any) => (e.currentTarget.style.backgroundColor = "#4a2f1b")}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

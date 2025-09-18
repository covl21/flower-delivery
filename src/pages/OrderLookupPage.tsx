import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError("");
    try {
      let query = "";
      if (orderId) query = `orderId=${orderId}`;
      else if (email && phone) query = `email=${email}&phone=${phone}`;
      else {
        setError("Provide Order ID or Email + Phone");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/orders/find?${query}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      const order = await res.json();
      navigate("/order-confirmation", { state: order });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      padding: "50px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#b87347",
      minHeight: "100vh"
    }}>
      <h2 style={{ marginBottom: "30px", color: "#ffffffff" }}>Find Your Order</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%", maxWidth: "400px" }}>
        <input
          placeholder="Order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
          }}
        />
        <p style={{ textAlign: "center", margin: "0", color: "#ffffffff" }}>Or use Email + Phone:</p>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
          }}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4a2f1b",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0069d9")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#4a2f1b")}
        >
          Search
        </button>

        {error && <p style={{ color: "white", textAlign: "center", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}

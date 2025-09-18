import { useState } from "react";

type Coupon = {
  id: string;
  code: string;
  discount: number; 
  description: string;
};

const couponsList: Coupon[] = [
  { id: "1", code: "WELCOME10", discount: 10, description: "10% off for new users" },
  { id: "2", code: "GOODDAY50", discount: 50, description: "Today is a good day for 50%" },
  { id: "3", code: "FLOWER20", discount: 20, description: "20% off on flowers" },
];

export default function CouponsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#b87347", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "30px", color: "#ffffffff" }}>Available Coupons</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {couponsList.map((coupon) => (
          <div
            key={coupon.id}
            style={{
              borderRadius: "12px",
              padding: "20px",
              background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
              boxShadow: "0 6px 15px rgba(243, 243, 243, 0.45)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#4a2f1b", fontSize: "22px", letterSpacing: "1px" }}>{coupon.code}</h3>
            <p style={{ margin: "0 0 15px 0", color: "#333", fontWeight: 500 }}>{coupon.description}</p>
            <p style={{ fontWeight: "bold", color: "#d84315", fontSize: "18px" }}>{coupon.discount}% OFF</p>
            <button
              onClick={() => handleCopy(coupon.code)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: copied === coupon.code ? "#43a047" : "#4a2f1b",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {copied === coupon.code ? "Copied!" : "Copy Code"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

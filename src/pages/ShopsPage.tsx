// src/pages/ShopsPage.tsx
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import type { Product } from "../types";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../index.css";

type BackendProduct = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  image: string;
  dateAdded?: string;
};

type BackendShop = {
  _id?: string;
  id?: string;
  name: string;
  products: BackendProduct[];
};

type ProductWithDate = Product & { dateAdded: string };
type SortOption = "priceAsc" | "priceDesc" | "dateAsc" | "dateDesc";

export default function ShopsPage() {
  const cartContext = useContext(CartContext);
  if (!cartContext) return null;
  const { addToCart } = cartContext;

  const [shops, setShops] = useState<BackendShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | "all">("all");
  const [shopSlideIndex, setShopSlideIndex] = useState<{ [key: string]: number }>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState<SortOption>("priceAsc");
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const itemsPerPage = 6;

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/shops`)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data: BackendShop[]) => {
        setShops(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  
  useEffect(() => {
    if (selectedShopId !== "all") {
      setCurrentPage(prev => ({ ...prev, [selectedShopId]: 1 }));
    }
  }, [selectedShopId]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20 }}>Error: {error}</div>;

  const toProduct = (p: BackendProduct): ProductWithDate => ({
    id: p._id || p.id || p.name,
    name: p.name,
    price: p.price,
    image: p.image.startsWith("http") ? p.image : `${API_URL}${p.image}`,
    dateAdded: p.dateAdded || new Date().toISOString(),
  });

  const sortProducts = (products: ProductWithDate[]): ProductWithDate[] => {
    const favs = Array.from(favorites);
    let sorted = [...products];

    switch (sortOption) {
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "dateAsc":
        sorted.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case "dateDesc":
        sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
    }

    sorted.sort((a, b) => {
      const aFav = favs.includes(a.id);
      const bFav = favs.includes(b.id);
      return aFav === bFav ? 0 : aFav ? -1 : 1;
    });

    return sorted;
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) newFavs.delete(id);
      else newFavs.add(id);
      return newFavs;
    });
  };

  const visibleProducts = (shopId: string) => {
    const shop = shops.find(s => s.id === shopId || s._id === shopId);
    if (!shop) return [];
    const index = shopSlideIndex[shopId] || 0;
    const sorted = sortProducts(shop.products.map(toProduct));
    return sorted.slice(index, index + 4);
  };

  const next = (shopId: string) => {
    setShopSlideIndex(prev => {
      const shop = shops.find(s => s.id === shopId || s._id === shopId);
      if (!shop) return prev;
      return {
        ...prev,
        [shopId]: Math.min((prev[shopId] || 0) + 1, shop.products.length - 4),
      };
    });
  };

  const prev = (shopId: string) => {
    setShopSlideIndex(prev => ({
      ...prev,
      [shopId]: Math.max((prev[shopId] || 0) - 1, 0),
    }));
  };

  return (
    <div className="main-container">
      {/* Ліва колонка */}
      <div className="sidebar">
        <button
          className={selectedShopId === "all" ? "active-btn btn" : "btn"}
          onClick={() => setSelectedShopId("all")}
        >
          All Stores
        </button>
        {shops.map(shop => (
          <button
            key={shop._id || shop.id}
            className={selectedShopId === (shop._id || shop.id) ? "active-btn btn" : "btn"}
            onClick={() => setSelectedShopId(shop._id || shop.id || "")}
          >
            {shop.name}
          </button>
        ))}
      </div>

      {/* Права колонка */}
      <div className="content">
        {/* Панель сортування */}
        <div className="sort-container">
          <label>
            Sort by:{" "}
            <select value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)}>
              <option value="priceAsc">Price ↑</option>
              <option value="priceDesc">Price ↓</option>
              <option value="dateAsc">Date ↑</option>
              <option value="dateDesc">Date ↓</option>
            </select>
          </label>
        </div>

        {selectedShopId === "all" ? (
          shops.map(shop => (
            <div key={shop._id || shop.id} className="shop-section">
              <h2>{shop.name}</h2>
              <div className="products-slider">
                <button onClick={() => prev(shop._id || shop.id || "")} className="nav-btn">
                  {"<"}
                </button>
                {visibleProducts(shop._id || shop.id || "").map(prod => (
                  <div key={prod.id} className="product-card">
                    <img src={prod.image} alt={prod.name} />
                    <h4>{prod.name}</h4>
                    <p>${prod.price}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button className="btn" onClick={() => addToCart(prod)}>
                        Add to cart
                      </button>
                      <span
                        className="favorite-icon"
                        onClick={() => toggleFavorite(prod.id)}
                      >
                        {favorites.has(prod.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                      </span>
                    </div>
                  </div>
                ))}
                
                <button onClick={() => next(shop._id || shop.id || "")} className="nav-btn">
                  {">"}
                </button>
              </div>
            </div>
          ))
        ) : (
          (() => {
            const shop = shops.find(s => s.id === selectedShopId || s._id === selectedShopId);
            if (!shop) return <p>Store not found</p>;

            const sorted = sortProducts(shop.products.map(toProduct));
            const totalPages = Math.ceil(sorted.length / itemsPerPage);
            const page = currentPage[selectedShopId] || 1;
            const startIndex = (page - 1) * itemsPerPage;
            const paginatedProducts = sorted.slice(startIndex, startIndex + itemsPerPage);

            return (
              <div className="products-list">
                {paginatedProducts.map(prod => (
                  <div key={prod.id} className="product-card">
                    <img src={prod.image} alt={prod.name} />
                    <h4>{prod.name}</h4>
                    <p>${prod.price}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button className="btn" onClick={() => addToCart(prod)}>
                        Add to cart
                      </button>
                      <span
                        className="favorite-icon"
                        onClick={() => toggleFavorite(prod.id)}
                      >
                        {favorites.has(prod.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Кнопки пагінації */}
                <div className="pagination-container">
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${i + 1 === page ? "active" : ""}`}
                      onClick={() =>
                        setCurrentPage(prev => ({ ...prev, [selectedShopId]: i + 1 }))
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}

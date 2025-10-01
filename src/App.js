import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for features
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);

  // Cart
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setFiltered(data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle filters, search, and sort
  useEffect(() => {
    let result = [...products];

    // search filter
    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // category filter
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // sorting
    if (sort === "priceLowHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHighLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFiltered(result);
    setPage(1); // reset pagination
  }, [search, category, sort, products]);

  // Pagination
  const startIndex = (page - 1) * perPage;
  const paginated = filtered.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="app">
      <h1 className="brand">🛒 SAPII Store</h1>

      {/* Search & Filters */}
      <div className="controls">
        <input
          className="search"
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Default</option>
          <option value="az">Name A-Z</option>
          <option value="priceLowHigh">Price Low 192 High</option>
          <option value="priceHighLow">Price High 192 Low</option>
        </select>
      </div>

      {/* Product List */}
      <div className="product-grid">
        {paginated.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="product-img"
            />
            <h2 className="product-title">{product.title}</h2>
            <p className="product-desc">
              {product.description.substring(0, 50)}...
            </p>
            <p className="product-price">${product.price}</p>
            <div className="actions">
              <button
                className="btn primary"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={"pagination-btn " + (page === i + 1 ? "active" : "")}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProduct.title}</h2>
            <img src={selectedProduct.thumbnail} alt={selectedProduct.title} />
            <p>{selectedProduct.description}</p>
            <p>
              <b>Category:</b> {selectedProduct.category}
            </p>
            <p>
              <b>Price:</b> ${selectedProduct.price}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                className="btn primary"
                onClick={() => addToCart(selectedProduct)}
              >
                Add to Cart
              </button>
              <button
                className="btn secondary"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="cart">
        <h2>🛒 Cart ({cart.length} items)</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span>
                  {item.title} (x{item.qty})
                </span>
                <span>${item.price * item.qty}</span>
                <button className="btn" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            ))}
            <h3>
              Total: $
              {cart.reduce((acc, item) => acc + item.price * item.qty, 0)}
            </h3>
            <button
              className="btn primary"
              onClick={() => alert("Checkout successful!")}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

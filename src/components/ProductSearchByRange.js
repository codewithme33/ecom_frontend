import { useState } from "react";

export default function ProductSearchByRange({ productsData, setSearchResults }) {
  const handleSearch = (minPrice, maxPrice) => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    // Filter products based on the price range
    const filtered = productsData.filter(
      (product) => product.isActive && product.price >= min && product.price <= max
    );

    // Update shared search results
    setSearchResults(filtered);
  };

  return (
    <div className="container my-4">
      <h2>Search Products by Price Range</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleSearch(formData.get("minPrice"), formData.get("maxPrice"));
        }}
        className="row g-3"
      >
        <div className="col-md-4">
          <label htmlFor="minPrice" className="form-label">
            Min Price:
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            className="form-control"
            placeholder="1000"
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="maxPrice" className="form-label">
            Max Price:
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            className="form-control"
            placeholder="2000"
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100">
            Search by Price Range
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard.js';
import { Row,Col, CardGroup } from 'react-bootstrap';

export default function UserView({ productsData }) {
  const [products, setProducts] = useState([]); // All products for display
  const [searchResults, setSearchResults] = useState([]); // Search results

  useEffect(() => {
    // Populate initial products
    const productsArr = productsData.map((product) => {
      if (product.isActive === true) {
        return <ProductCard productProp={product} key={product._id} />;
      } else {
        return null;
      }
    });

    setProducts(productsArr);
  }, [productsData]);

  return (
    <div className="container my-4">
      {/* Search Section */}
      <div className="mb-4">
        <ProductSearchSection
          productsData={productsData}
          setSearchResults={setSearchResults}
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <>
          <h1 className="my-4 text-center ">Search Results</h1>
          <Row className="g-4">
            {searchResults.map((product) => (
              <ProductCard productProp={product} key={product._id} />
            ))}
          </Row>
        </>
      )}

      {/* Full Product List */}
      <h1 className="mt-4 text-center">Our Products</h1>
      <CardGroup className="g-4">{products}</CardGroup>
    </div>
  );
}

function ProductSearchSection({ productsData, setSearchResults }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const handleSearchByName = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/search-by-name`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: searchQuery }),
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  const handleSearchByPrice = () => {
    const filteredProducts = productsData.filter(
      (product) =>
        product.isActive && product.price >= minPrice && product.price <= maxPrice
    );
    setSearchResults(filteredProducts);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(100000);
    setSearchResults([]); // Clear search results
  };

  return (
    <div className="product-search-section">
      <h2>Product Search</h2>
      <form>
        <Row className="align-items-center g-3">
          {/* Product Name Input */}
          <Col md={12}>
            <label htmlFor="productName" className="form-label">
              Product Name:
            </label>
            <input
              type="text"
              id="productName"
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter product name"
            />
          </Col>

          {/* Price Range Inputs */}
          <Col md={2}>
            <label htmlFor="minPrice" className="form-label">
              Minimum Price:
            </label>
            <div className="input-group">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setMinPrice((prev) => Math.max(prev - 1, 0))}
              >
                -
              </button>
              <input
                type="number"
                id="minPrice"
                className="form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                min="0"
              />
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setMinPrice((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </Col>

          <Col md={2}>
            <label htmlFor="maxPrice" className="form-label">
              Maximum Price:
            </label>
            <div className="input-group">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setMaxPrice((prev) => Math.max(prev - 1, 0))}
              >
                -
              </button>
              <input
                type="number"
                id="maxPrice"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                min="0"
              />
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setMaxPrice((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row className="mt-3">
          <Col md={2}>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleSearchByName}
            >
              Search by Name
            </button>
          </Col>
          <Col md={2}>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleSearchByPrice}
            >
              Search by Price
            </button>
          </Col>
          <Col md={2}>
            <button
              type="button"
              className="btn btn-danger w-100"
              onClick={clearSearch}
            >
              Clear
            </button>
          </Col>
        </Row>
      </form>
    </div>
  );
}

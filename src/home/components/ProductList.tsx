// src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';
import '../../styles/ProductList.css';
import { Product } from '../../interfaces/Products';
import { getProducts } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [itemsTable, setItemsTable] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      const productList = await getProducts();
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div>
      <h1>Financial Products</h1>
      <input
        type="text"
        placeholder="Search..."
        value={productSearch}
        onChange={(e) => setProductSearch(e.target.value)}
        className="search-input"
      />
      <table className="product-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Release Date</th>
            <th>Version Date</th>
          </tr>
        </thead>
        <tbody>
        {filteredProducts.slice(0, itemsTable).map((product) => (
            <tr key={product.id}>
              <td><img src={product.logo} alt={product.name} className="product-logo" /></td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{new Date(product.date_release).toLocaleDateString()}</td>
              <td>{new Date(product.date_revision).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <p>Showing {filteredProducts.length} results</p>
        <select value={itemsTable} onChange={(e) => setItemsTable(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <button onClick={() => navigate('/add-product')}>Agregar</button>
      </div>
    </div>
  );
};

export default ProductList;

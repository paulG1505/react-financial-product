// src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';
import '../../styles/ProductList.css';
import { Product } from '../../interfaces/Products';
import { deleteProduct, getProducts } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [itemsTable, setItemsTable] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      const productList = await getProducts();
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProduct(product.id);
        setProducts(products.filter(p => p.id !== product.id));
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );
      }
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h1>Financial Products</h1>
        <button className="add-button" onClick={() => navigate('/add-product')}>Agregar</button>
      </div>
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
            <th>Actions</th>
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
              <td>
                <div className="dropdown">
                  <button className="dropbtn">Actions</button>
                  <div className="dropdown-content">
                  <a href="#" onClick={() => navigate(`/edit-product/${product.id}`)}>Editar</a>
                  <a href="#" onClick={() => handleDelete(product)}>Eliminar</a>
                  </div>
                </div>
              </td>
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
      </div>
      
    </div>
  );
};

export default ProductList;

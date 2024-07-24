// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import "../styles/ProductList.css";
import { Product } from "../interfaces/Products";
import { deleteProduct, getProducts } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [itemsTable, setItemsTable] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      const productList = await getProducts();
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const handleEdit = (
    product: Product,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    setSelectedProduct(product);
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const toggleDropdown = (productId: string) => {
    setDropdownOpen(dropdownOpen === productId ? null : productId);
  };

  const handleDelete = async (
    product: Product,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    const result = await Swal.fire({
      title: `¿Estas seguro de eliminar el producto ${product.name} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!",
      cancelButtonText: "No, cancelar",
    });

    if (result.isConfirmed) {
      await deleteProduct(product.id);
      setProducts(products.filter((p) => p.id !== product.id));
      await Swal.fire(
        "Eliminado!",
        "El producto se ha eliminado con éxito.",
        "success"
      );
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h1>Productos Financieros Neoris</h1>
        <button className="add-button" onClick={() => navigate("/product")}>
          Agregar
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar..."
        value={productSearch}
        onChange={(e) => setProductSearch(e.target.value)}
        className="search-input"
      />
      <table className="product-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nombre del Producto</th>
            <th>Descripción</th>
            <th>Fecha de liberación</th>
            <th>Fecha de reestructuración</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.slice(0, itemsTable).map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.logo}
                  alt={product.name}
                  className="product-logo"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                {new Date(product.date_release).toLocaleDateString("en-GB", {
                  timeZone: "UTC",
                })}
              </td>
              <td>
                {new Date(product.date_revision).toLocaleDateString("en-GB", {
                  timeZone: "UTC",
                })}
              </td>
              <td>
                <div className="dropdown">
                  <button
                    className="dropbtn"
                    onClick={() => toggleDropdown(product.id)}
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                  {dropdownOpen === product.id && (
                    <div className="dropdown-content">
                      <a
                        href=""
                        onClick={(event) => handleEdit(product, event)}
                      >
                        Editar
                      </a>
                      <a
                        href=""
                        onClick={(event) => handleDelete(product, event)}
                      >
                        Eliminar
                      </a>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <p>Showing {filteredProducts.length} results</p>
        <select
          value={itemsTable}
          onChange={(e) => setItemsTable(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
};

export default ProductList;

import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

const App = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);

  // Fetch all products when the component mounts
  useEffect(() => {
    fetch('https://66fa2ba1afc569e13a9a9fee.mockapi.io/medical')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Handle form submission to add or edit a product
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProductId) {
      fetch(`https://66fa2ba1afc569e13a9a9fee.mockapi.io/medical/${editingProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, stock }),
      })
        .then(response => response.json())
        .then(updatedProduct => {
          setProducts(products.map(product => (product.id === updatedProduct.id ? updatedProduct : product)));
          resetForm();
        })
        .catch(error => console.error('Error editing product:', error));
    } else {
      fetch('https://66fa2ba1afc569e13a9a9fee.mockapi.io/medical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, stock }),
      })
        .then(response => response.json())
        .then(newProduct => {
          setProducts([...products, newProduct]);
          resetForm();
        })
        .catch(error => console.error('Error adding product:', error));
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setEditingProductId(null);
  };

  const handleDelete = (id) => {
    fetch(`https://66fa2ba1afc569e13a9a9fee.mockapi.io/medical/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setEditingProductId(product.id);
  };

  return (
    <div className="container">
      <h1>Medical Store</h1>

      {/* Add/Edit Product Form */}
      <form onSubmit={handleSubmit}>
        <h2>{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Stock:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </label>
        <button type="submit">{editingProductId ? 'Update Product' : 'Add Product'}</button>
      </form>

      {/* Product List */}
      <h2>Product List</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-item" key={product.id}>
              <div>
                {product.name} - ${product.price} - Stock: {product.stock}
              </div>
              <div>
                <button className="edit-button" onClick={() => handleEdit(product)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './home/HomePage';
import ProductForm from './home/components/ProductForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductForm  />} />
        <Route path="/product/:id" element={<ProductForm isEditMode={true}/>} />
      </Routes>
    </Router>
  );
};

export default App;

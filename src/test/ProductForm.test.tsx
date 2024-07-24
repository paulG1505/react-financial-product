import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { createProduct, updateProduct } from '../services/apiService';
import { Product } from '../interfaces/Products';

jest.mock('../services/apiService');

const renderComponent = (props: any) => {
  return render(
    <BrowserRouter>
      <ProductForm {...props} />
    </BrowserRouter>
  );
};

describe('ProductForm', () => {
  const initialValues: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'Test Logo',
    date_release: new Date('2023-07-24'),
    date_revision: new Date('2024-07-24')
  };

  it('renders ProductForm component', () => {
    renderComponent({});
    expect(screen.getByText(/Agregar Producto Financiero/i)).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    renderComponent({ isEditMode: false });
    
    fireEvent.change(screen.getByLabelText(/ID/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Logo/i), { target: { value: 'Test Logo' } });
    fireEvent.change(screen.getByLabelText(/Fecha de liberación/i), { target: { value: '2023-07-24' } });

    fireEvent.submit(screen.getByRole('button', { name: /Enviar/i }));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'Test Logo',
        date_release: new Date('2023-07-24'),
        date_revision: new Date('2024-07-24')
      });
    });
  });
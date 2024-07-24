import { render, screen, fireEvent } from "@testing-library/react";
import ProductForm from "../components/ProductForm";
import { Product } from "../interfaces/Products";

const initialValues: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  logo: 'Test Logo',
  date_release: new Date('2023-07-24'), 
  date_revision: new Date('2024-07-24') 
};

describe('ProductForm', () => {
  beforeEach(() => {
    render(<ProductForm />);
  });


  test('submits the form with correct values', async () => {
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText(/logo/i), { target: { value: 'New Logo' } });
    fireEvent.change(screen.getByLabelText(/date release/i), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText(/date revision/i), { target: { value: '2025-01-01' } });
    fireEvent.click(screen.getByText(/submit/i));

    
  });
});

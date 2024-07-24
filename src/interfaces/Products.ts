export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;
}

export interface ProductFormProps {
  isEditMode?: boolean;
  onSubmit?: () => void;
}
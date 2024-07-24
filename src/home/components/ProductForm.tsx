import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../styles/ProductForm.css";
import {
  verifyProduct,
  createProduct,
  updateProduct,
} from "../../services/apiService";
import { Product } from "../../interfaces/Products";

interface ProductFormProps {
  product?: Product;
  isEditMode?: boolean;
  onSubmit?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isEditMode = false,
  onSubmit,
}) => {
  const [initialValues, setInitialValues] = useState<Product>({
    id: product?.id ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    logo: product?.logo ?? "",
    date_release: product?.date_release
      ? new Date(product.date_release)
      : new Date(),
    date_revision: product?.date_revision
      ? new Date(product.date_revision)
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  });

  useEffect(() => {
    if (product) {
      setInitialValues({
        id: product.id ?? "",
        name: product.name ?? "",
        description: product.description ?? "",
        logo: product.logo ?? "",
        date_release: new Date(product.date_release),
        date_revision: new Date(product.date_revision),
      });
    }
  }, [product]);

  const validationForm = Yup.object().shape({
    id: Yup.string()
      .required("ID is required")
      .min(3, "ID must be at least 3 characters")
      .max(10, "ID must be at most 10 characters")
      .test("checkUniqueId", "ID already exists", async (value) => {
        if (!value) return false;
        const exists = await verifyProduct(value);
        return !exists || (isEditMode && value === product?.id);
      }),
    name: Yup.string()
      .required("Name is required")
      .min(5, "Name must be at least 5 characters")
      .max(100, "Name must be at most 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description must be at most 200 characters"),
    logo: Yup.string().required("Logo is required"),
    date_release: Yup.date()
      .required("Release Date is required")
      .min(new Date(), "Release Date must be equal or greater than today"),
    date_revision: Yup.date()
      .required("Revision Date is required")
      .min(new Date(), "Revision Date must be equal or greater than today"),
  });

  const handleSubmit = async (values: Product) => {
    try {
      if (isEditMode) {
        await updateProduct(values);
      } else {
        await createProduct(values);
      }
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationForm}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="id">ID</label>
              <Field name="id" type="text" />
              <ErrorMessage name="id" component="div" />
            </div>
            <div>
              <label htmlFor="name">Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Field name="description" type="text" />
              <ErrorMessage name="description" component="div" />
            </div>
            <div>
              <label htmlFor="logo">Logo</label>
              <Field name="logo" type="text" />
              <ErrorMessage name="logo" component="div" />
            </div>
            <div>
              <label htmlFor="date_release">Release Date</label>
              <Field name="date_release" type="date" />
              <ErrorMessage name="date_release" component="div" />
            </div>
            <div>
              <label htmlFor="date_revision">Revision Date</label>
              <Field name="date_revision" type="date" />
              <ErrorMessage name="date_revision" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isEditMode ? "Update" : "Add"}
            </button>
            <button type="reset">Reset</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;

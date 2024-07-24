import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/ProductForm.css";
import {
  createProduct,
  updateProduct,
} from "../services/apiService";
import { Product, ProductFormProps } from "../interfaces/Products";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { validationForm } from "./validations/productFormValidation";



const ProductForm: React.FC<ProductFormProps> = ({
  isEditMode = false,
  onSubmit,
}) => {
  const location = useLocation();
  const product = location.state?.product as Product;

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
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setInitialValues({
        id: product.id ?? "",
        name: product.name ?? "",
        description: product.description ?? "",
        logo: product.logo ?? "",
        date_release: product.date_release
          ? new Date(product.date_release)
          : new Date(),
        date_revision: product.date_revision
          ? new Date(product.date_revision)
          : new Date(),
      });
    }
  }, [product]);

  

  const handleSubmit = async (values: Product) => {
    try {
      if (isEditMode) {
        await updateProduct(values);
      } else {
        await createProduct(values);
      }

      Swal.fire({
        title: "Éxito!",
        text: `Producto ${
          isEditMode ? "actualizado" : "creado"
        } satisfactoriamente!`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });

      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };
  
  const handleDateReleaseChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const date = new Date(e.target.value);
    setFieldValue("date_release", date);
    const newDateRevision = new Date(date);
    newDateRevision.setFullYear(date.getFullYear() + 1);
    setFieldValue("date_revision", newDateRevision);
  };

  return (
    <div className="container">
      <div className="header">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" onClick={() => navigate('/')} />
        <h1>{isEditMode ? "Editar Producto Financiero" : "Agregar Producto Financiero"}</h1>
      </div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationForm(isEditMode, product)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched,values,setFieldValue }) => (
          <Form className="form">
            <div className="form-row">
              <div className="form-group">
                <label className="labelForm" htmlFor="id">
                  ID
                </label>
                <Field
                  name="id"
                  type="text"
                  disabled={isEditMode} 
                  className={touched.id && errors.id ? "error" : ""}
                />
                <ErrorMessage
                  name="id"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label className="labelForm" htmlFor="name">
                  Nombre
                </label>
                <Field
                  name="name"
                  type="text"
                  className={touched.name && errors.name ? "error" : ""}
                />
                <ErrorMessage
                  className="error-message"
                  name="name"
                  component="div"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="labelForm" htmlFor="description">
                  Descripción
                </label>
                <Field
                  name="description"
                  type="text"
                  className={
                    touched.description && errors.description ? "error" : ""
                  }
                />
                <ErrorMessage
                  className="error-message"
                  name="description"
                  component="div"
                />
              </div>
              <div className="form-group">
                <label className="labelForm" htmlFor="logo">
                  Logo
                </label>
                <Field
                  name="logo"
                  type="text"
                  className={touched.logo && errors.logo ? "error" : ""}
                />
                <ErrorMessage
                  className="error-message"
                  name="logo"
                  component="div"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="labelForm" htmlFor="date_release">
                  Fecha de liberación
                </label>
                <Field
                  name="date_release"
                  type="date"
                  id="date_release"
                  className={
                    touched.date_release && errors.date_release ? "error" : ""
                  }
                  value={values.date_release.toISOString().substring(0, 10)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleDateReleaseChange(e, setFieldValue)
                  }
                />
                <ErrorMessage
                  className="error-message"
                  name="date_release"
                  component="div"
                />
              </div>
              <div className="form-group">
                <label className="labelForm" htmlFor="date_revision">
                  Fecha de reestructuración
                </label>
                <Field
                  name="date_revision"
                  type="date"
                  className={
                    touched.date_revision && errors.date_revision ? "error" : ""
                  }
                  value={values.date_revision.toISOString().substring(0, 10)}
                  onChange={(e:any) => {
                    const date = new Date(e.target.value);
                    setFieldValue("date_revision", date);
                  }}
                  disabled={true} 
                />
                <ErrorMessage
                  className="error-message"
                  name="date_revision"
                  component="div"
                />
              </div>
            </div>
            <div className="buttons">
              <button type="reset">Reiniciar</button>
              <button type="submit" disabled={isSubmitting}>
                {isEditMode ? "Actualizar" : "Enviar"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;

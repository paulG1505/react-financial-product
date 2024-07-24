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
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface ProductFormProps {
  isEditMode?: boolean;
  onSubmit?: () => void;
}

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
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
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
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });
    }
  }, [product]);

  const validationForm = Yup.object().shape({
    id: Yup.string()
      .required("ID es requerido")
      .min(3, "ID no puede ser menor a 3 caracteres")
      .max(10, "ID no puede ser mayor a 10 caracteres")
      .test("checkUniqueId", "ID ya existe", async (value) => {
        if (!value) return false;
        const exists = await verifyProduct(value);
        return !exists || (isEditMode && value === product?.id);
      }),
    name: Yup.string()
      .required("Nombre es requerido")
      .min(5, "Nombre no puede ser menor a 5 caracteres")
      .max(100, "Nombre no puede ser mayor a 100 caracteres"),
    description: Yup.string()
      .required("Descripción es requerido")
      .min(10, "Descripción no puede ser menor a 10 caracteres")
      .max(200, "Descripción no puede ser mayor a 200 caracteres"),
    logo: Yup.string().required("Logo es requerido"),
    date_release: Yup.date()
      .required("Fecha de Liberación es requerido")
      .min(
        new Date(new Date().setDate(new Date().getDate() - 1)),
        "Fecha de Liberación debe ser igual o superior a hoy"
      ),
    date_revision: Yup.date()
      .required("Fecha de Reestructuración es requerido")
      .test(
        "is-exactly-one-year",
        "Fecha de Reestructuración debe ser exactamente un año después de la Fecha de Liberación",
        function (value) {
          const { date_release } = this.parent;
          return value && date_release && new Date(value).getTime() === new Date(new Date(date_release).setFullYear(new Date(date_release).getFullYear() + 1)).getTime();
        }
      )
  });

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

  return (
    <div className="container">
      <div className="header">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" onClick={() => navigate('/')} />
        <h1>{isEditMode ? "Editar Producto Financiero" : "Agregar Producto Financiero"}</h1>
      </div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationForm}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
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

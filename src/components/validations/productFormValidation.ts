import * as Yup from "yup";
import { verifyProduct } from "../../services/apiService";
import { Product } from "../../interfaces/Products";

export const validationForm = (isEditMode: boolean, product?: Product) => {
    return Yup.object().shape({
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
};
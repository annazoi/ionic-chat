import * as yup from "yup";

export const registerSchema = yup.object().shape({
  phone: yup.string().required("Invalid phone"),
  username: yup.string().required("Invalid username"),
  password: yup.string().required("Invalid password"),
  // avatar: yup.string().optional(),
});

export const loginSchema = yup.object().shape({
  username: yup.string().required("Invalid username"),
  password: yup.string().required("Invalid password"),
});

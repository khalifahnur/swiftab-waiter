import * as Yup from "yup";

export const signUpSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  // verificationcode: Yup.string()
  //   .max(6, "Code suppose to be 6-digit")
  //   .required("Validation code is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

import * as yup from "yup";
import { VALIDATION_MESSAGES, REGEX } from "./constants";

/**
 * Login Form Validation Schema
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN),
});

/**
 * Signup Form Validation Schema
 */
export const signupSchema = yup.object({
  username: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(3, VALIDATION_MESSAGES.STRING_MIN(3))
    .max(50, VALIDATION_MESSAGES.STRING_MAX(50)),
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  phone: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .matches(REGEX.PHONE, VALIDATION_MESSAGES.PHONE_INVALID),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN)
    .max(50, VALIDATION_MESSAGES.PASSWORD_MAX),
  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf([yup.ref("password")], "Passwords must match"),
});

/**
 * Property Form Validation Schema
 */
export const propertySchema = yup.object({
  name: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(5, VALIDATION_MESSAGES.STRING_MIN(5))
    .max(200, VALIDATION_MESSAGES.STRING_MAX(200)),
  description: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(20, VALIDATION_MESSAGES.STRING_MIN(20))
    .max(2000, VALIDATION_MESSAGES.STRING_MAX(2000)),
  bedrooms: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .positive("Must be positive")
    .integer("Must be an integer")
    .min(1, VALIDATION_MESSAGES.NUMBER_MIN(1))
    .max(20, VALIDATION_MESSAGES.NUMBER_MAX(20)),
  bathrooms: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .positive("Must be positive")
    .integer("Must be an integer")
    .min(1, VALIDATION_MESSAGES.NUMBER_MIN(1))
    .max(20, VALIDATION_MESSAGES.NUMBER_MAX(20)),
  floorArea: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .positive("Must be positive")
    .min(100, VALIDATION_MESSAGES.NUMBER_MIN(100)),
  totalFloors: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .positive("Must be positive")
    .integer("Must be an integer")
    .min(1, VALIDATION_MESSAGES.NUMBER_MIN(1))
    .max(100, VALIDATION_MESSAGES.NUMBER_MAX(100)),
  address: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(10, VALIDATION_MESSAGES.STRING_MIN(10)),
  city: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.STRING_MIN(2)),
  state: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.STRING_MIN(2)),
  country: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.STRING_MIN(2)),
  contactName: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(3, VALIDATION_MESSAGES.STRING_MIN(3)),
  contactEmail: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  contactPhoneNumber: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .matches(REGEX.PHONE, VALIDATION_MESSAGES.PHONE_INVALID),
  price: yup
    .number()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .positive("Must be positive")
    .min(100000, VALIDATION_MESSAGES.NUMBER_MIN(100000)),
});

/**
 * Contact Form Validation Schema
 */
export const contactSchema = yup.object({
  name: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(3, VALIDATION_MESSAGES.STRING_MIN(3))
    .max(100, VALIDATION_MESSAGES.STRING_MAX(100)),
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  subject: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(5, VALIDATION_MESSAGES.STRING_MIN(5))
    .max(200, VALIDATION_MESSAGES.STRING_MAX(200)),
  message: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(20, VALIDATION_MESSAGES.STRING_MIN(20))
    .max(1000, VALIDATION_MESSAGES.STRING_MAX(1000)),
});

/**
 * Forgot Password Validation Schema
 */
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
});

/**
 * Reset Password Validation Schema
 */
export const resetPasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN),
  newPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN)
    .max(50, VALIDATION_MESSAGES.PASSWORD_MAX),
  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

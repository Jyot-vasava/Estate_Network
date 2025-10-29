import * as yup from "yup";
import { VALIDATION_MESSAGES, REGEX } from "./constants";

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
  propertyType: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf(["sale", "rent"], "Property type must be either Sale or Rent"),
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
  discountedPrice: yup
    .number()
    .nullable()
    .positive("Must be positive")
    .test(
      "is-less-than-price",
      "Discounted price must be less than original price",
      function (value) {
        const { price } = this.parent;
        return !value || value < price;
      }
    ),
});

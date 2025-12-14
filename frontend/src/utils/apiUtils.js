export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "ApiError";
  }
}

/**
 * Extract error message from error object
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { data, status } = error.response;
    return new ApiError(
      data?.message || "Server error occurred",
      status,
      data?.errors || []
    );
  } else if (error.request) {
    // Request made but no response
    return new ApiError("No response from server", 503);
  } else {
    // Error in request setup
    return new ApiError(error.message || "Request failed", 500);
  }
};

/**
 * API Response Handler
 * Formats successful API responses
 */
export class ApiResponse {
  constructor(data, message = "Success", statusCode = 200) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

/**
 * Format successful response
 */
export const handleApiResponse = (response) => {
  return new ApiResponse(
    response.data?.data || response.data,
    response.data?.message || "Success",
    response.status
  );
};

/**
 * Simple validation function
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    // Required validation
    if (rule.required && (!value || value.toString().trim() === "")) {
      errors[field] = rule.requiredMessage || `${field} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value) return;

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] =
        rule.minLengthMessage ||
        `${field} must be at least ${rule.minLength} characters`;
      return;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] =
        rule.maxLengthMessage ||
        `${field} must be at most ${rule.maxLength} characters`;
      return;
    }

    // Min value validation
    if (rule.min !== undefined && Number(value) < rule.min) {
      errors[field] =
        rule.minMessage || `${field} must be at least ${rule.min}`;
      return;
    }

    // Max value validation
    if (rule.max !== undefined && Number(value) > rule.max) {
      errors[field] = rule.maxMessage || `${field} must be at most ${rule.max}`;
      return;
    }

    // Email validation
    if (rule.email) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(value)) {
        errors[field] = rule.emailMessage || "Invalid email address";
        return;
      }
    }

    // Phone validation
    if (rule.phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        errors[field] =
          rule.phoneMessage ||
          "Invalid phone number (10 digits starting with 6-9)";
        return;
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${field} format is invalid`;
      return;
    }

    // Custom validation
    if (rule.validate) {
      const customError = rule.validate(value, values);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validation rules for forms
 */
export const validationRules = {
  // Auth validations
  login: {
    email: {
      required: true,
      email: true,
      requiredMessage: "Email is required",
    },
    password: {
      required: true,
      minLength: 8,
      requiredMessage: "Password is required",
    },
  },

  signup: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 50,
      requiredMessage: "Username is required",
    },
    email: {
      required: true,
      email: true,
      requiredMessage: "Email is required",
    },
    phone: {
      required: true,
      phone: true,
      requiredMessage: "Phone number is required",
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 50,
      requiredMessage: "Password is required",
    },
    confirmPassword: {
      required: true,
      validate: (value, values) => {
        if (value !== values.password) {
          return "Passwords must match";
        }
        return null;
      },
      requiredMessage: "Please confirm your password",
    },
  },

  // Property validations
  property: {
    name: {
      required: true,
      minLength: 5,
      maxLength: 200,
      requiredMessage: "Property name is required",
    },
    description: {
      required: true,
      minLength: 20,
      maxLength: 2000,
      requiredMessage: "Description is required",
    },
    propertyType: {
      required: true,
      validate: (value) => {
        if (!["sale", "rent"].includes(value)) {
          return "Property type must be either Sale or Rent";
        }
        return null;
      },
      requiredMessage: "Property type is required",
    },
    bedrooms: {
      required: true,
      min: 1,
      max: 20,
      requiredMessage: "Number of bedrooms is required",
    },
    bathrooms: {
      required: true,
      min: 1,
      max: 20,
      requiredMessage: "Number of bathrooms is required",
    },
    floorArea: {
      required: true,
      min: 100,
      requiredMessage: "Floor area is required",
    },
    totalFloors: {
      required: true,
      min: 1,
      max: 100,
      requiredMessage: "Total floors is required",
    },
    address: {
      required: true,
      minLength: 10,
      requiredMessage: "Address is required",
    },
    city: {
      required: true,
      minLength: 2,
      requiredMessage: "City is required",
    },
    state: {
      required: true,
      minLength: 2,
      requiredMessage: "State is required",
    },
    country: {
      required: true,
      minLength: 2,
      requiredMessage: "Country is required",
    },
    contactName: {
      required: true,
      minLength: 3,
      requiredMessage: "Contact name is required",
    },
    contactEmail: {
      required: true,
      email: true,
      requiredMessage: "Contact email is required",
    },
    contactPhoneNumber: {
      required: true,
      phone: true,
      requiredMessage: "Contact phone is required",
    },
    price: {
      required: true,
      min: 500,
      requiredMessage: "Price is required",
    },
    discountedPrice: {
      required: false,
      min: 0,
      validate: (value, values) => {
        if (value && Number(value) >= Number(values.price)) {
          return "Discounted price must be less than original price";
        }
        return null;
      },
    },
  },

  // Contact validations
  contact: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      requiredMessage: "Name is required",
    },
    email: {
      required: true,
      email: true,
      requiredMessage: "Email is required",
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 200,
      requiredMessage: "Subject is required",
    },
    message: {
      required: true,
      minLength: 20,
      maxLength: 1000,
      requiredMessage: "Message is required",
    },
  },
};

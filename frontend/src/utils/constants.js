// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"; // Updated default to match backend PORT

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  THEME: "theme",
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: "/users/signup",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  REFRESH_TOKEN: "/users/refresh-token",
  FORGOT_PASSWORD: "/users/forgot-password",
  RESET_PASSWORD: "/users/reset-password",

  // Properties
  PROPERTIES: "/properties",
  PROPERTY_BY_ID: (id) => `/properties/${id}`,
  CREATE_PROPERTY: "/properties",
  UPDATE_PROPERTY: (id) => `/properties/${id}`,
  DELETE_PROPERTY: (id) => `/properties/${id}`,

  // Contacts
  CONTACTS: "/contacts",
  CONTACT_BY_ID: (id) => `/contacts/${id}`,
  CONTACT_OWNER: "/contact-owner",
};

// Property Amenities Options
export const AMENITIES = [
  "WiFi",
  "Parking",
  "Swimming Pool",
  "Gym",
  "Security",
  "Garden",
  "Balcony",
  "Air Conditioning",
  "Heating",
  "Elevator",
  "Pet Friendly",
  "Furnished",
  "Laundry",
  "Dishwasher",
  "Microwave",
  "TV",
  "Fireplace",
];

// Property Types
export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Condo",
  "Studio",
  "Penthouse",
  "Townhouse",
  "Bungalow",
];

// Price Ranges for Filters
export const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹50 Lakh", min: 0, max: 5000000 },
  { label: "₹50L - ₹1 Cr", min: 5000000, max: 10000000 },
  { label: "₹1 Cr - ₹2 Cr", min: 10000000, max: 20000000 },
  { label: "₹2 Cr - ₹5 Cr", min: 20000000, max: 50000000 },
  { label: "Above ₹5 Cr", min: 50000000, max: Infinity },
];

// Bedroom Options
export const BEDROOM_OPTIONS = [
  { label: "Any", value: null },
  { label: "1 BHK", value: 1 },
  { label: "2 BHK", value: 2 },
  { label: "3 BHK", value: 3 },
  { label: "4 BHK", value: 4 },
  { label: "5+ BHK", value: 5 },
];

// Sort Options
export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Bedrooms: Low to High", value: "bedrooms-asc" },
  { label: "Bedrooms: High to Low", value: "bedrooms-desc" },
];

// Pagination
export const ITEMS_PER_PAGE = 12;

// Toast Messages
export const TOAST_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logout successful!",
  SIGNUP_SUCCESS: "Account created successfully!",
  PASSWORD_RESET_SENT: "Password reset email sent!",
  PASSWORD_CHANGED: "Password changed successfully!",

  // Properties
  PROPERTY_CREATED: "Property created successfully!",
  PROPERTY_UPDATED: "Property updated successfully!",
  PROPERTY_DELETED: "Property deleted successfully!",

  // Contacts
  CONTACT_SENT: "Message sent successfully!",
  CONTACT_DELETED: "Contact deleted successfully!",

  // Errors
  ERROR_GENERIC: "Something went wrong. Please try again.",
  ERROR_NETWORK: "Network error. Please check your connection.",
  ERROR_UNAUTHORIZED: "Please login to continue.",
  ERROR_FORBIDDEN: "You do not have permission to perform this action.",
};

// User Roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_MIN: "Password must be at least 8 characters",
  PASSWORD_MAX: "Password must be at most 50 characters",
  PHONE_INVALID: "Invalid phone number",
  NUMBER_MIN: (min) => `Must be at least ${min}`,
  NUMBER_MAX: (max) => `Must be at most ${max}`,
  STRING_MIN: (min) => `Must be at least ${min} characters`,
  STRING_MAX: (max) => `Must be at most ${max} characters`,
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Image Upload
export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  MAX_FILES: 10,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  FULL: "MMMM dd, yyyy hh:mm a",
  SHORT: "MM/dd/yyyy",
  TIME: "hh:mm a",
};

// Navigation Links
export const NAV_LINKS = {
  PUBLIC: [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Contact", path: "/contact" },
  ],
  USER: [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Contact", path: "/contact" },
  ],
  ADMIN: [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Create Property", path: "/properties/create" },
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Contacts", path: "/admin/contacts" },
  ],
};

// Status Colors
export const STATUS_COLORS = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

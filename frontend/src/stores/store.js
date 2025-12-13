import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import propertyReducer from "../features/properties/propertySlice.js";
import themeReducer from "../features/theme/themeSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

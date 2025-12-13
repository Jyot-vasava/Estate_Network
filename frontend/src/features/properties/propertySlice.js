import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { propertyApi } from "../../api/propertyApi.js";
import toast from "react-hot-toast";

// Initial state
const initialState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    city: "",
    minPrice: 0,
    maxPrice: Infinity,
    bedrooms: null,
    sortBy: "newest",
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  "properties/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await propertyApi.getAllProperties(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await propertyApi.getPropertyById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch property"
      );
    }
  }
);

export const createProperty = createAsyncThunk(
  "properties/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await propertyApi.createProperty(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create property"
      );
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await propertyApi.updateProperty(id, formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update property"
      );
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id, { rejectWithValue }) => {
    try {
      await propertyApi.deleteProperty(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete property"
      );
    }
  }
);

// Property slice
const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;

        // Safe data extraction - handles multiple response structures
        const data = action.payload?.data || action.payload;

        if (Array.isArray(data)) {
          state.properties = data;
          state.pagination.total = data.length;
        } else if (data?.properties && Array.isArray(data.properties)) {
          state.properties = data.properties;
          state.pagination.total = data.properties.length;
        } else {
          state.properties = [];
          state.pagination.total = 0;
        }
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.properties = [];
        toast.error(action.payload || "Failed to fetch properties");
      });

    // Fetch property by ID
    builder
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;

        // Safe data extraction
        const data = action.payload?.data || action.payload;
        state.currentProperty = data?.property || data || null;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch property");
      });

    // Create property
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data || action.payload;
        const newProperty = data?.property || data;

        if (newProperty) {
          state.properties.unshift(newProperty);
          state.pagination.total += 1;
        }

        toast.success("Property created successfully!");
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to create property");
      });

    // Update property
    builder
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data || action.payload;
        const updatedProperty = data?.property || data;

        if (updatedProperty?._id) {
          const index = state.properties.findIndex(
            (p) => p._id === updatedProperty._id
          );
          if (index !== -1) {
            state.properties[index] = updatedProperty;
          }
          state.currentProperty = updatedProperty;
        }

        toast.success("Property updated successfully!");
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to update property");
      });

    // Delete property
    builder
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter(
          (p) => p._id !== action.payload
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        toast.success("Property deleted successfully!");
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to delete property");
      });
  },
});

export const {
  clearError,
  clearCurrentProperty,
  setFilters,
  resetFilters,
  setPage,
} = propertySlice.actions;

export default propertySlice.reducer;

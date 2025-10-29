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
        state.properties = action.payload.data;
        state.pagination.total = action.payload.data.length;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Fetch property by ID
    builder
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload.data;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Create property
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties.unshift(action.payload.data);
        toast.success("Property created successfully!");
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Update property
    builder
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex(
          (p) => p._id === action.payload.data._id
        );
        if (index !== -1) {
          state.properties[index] = action.payload.data;
        }
        state.currentProperty = action.payload.data;
        toast.success("Property updated successfully!");
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
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
        toast.success("Property deleted successfully!");
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
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

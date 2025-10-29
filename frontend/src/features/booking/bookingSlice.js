import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingApi } from "../../api/bookingApi.js";
import toast from "react-hot-toast";

// Initial state
const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

// Async thunks
export const processPayment = createAsyncThunk(
  "bookings/processPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await bookingApi.processPayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment processing failed"
      );
    }
  }
);

export const sendConfirmationEmail = createAsyncThunk(
  "bookings/sendConfirmation",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await bookingApi.sendConfirmationEmail(emailData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send confirmation email"
      );
    }
  }
);

// Booking slice
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Process payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data;
        state.bookings.push(action.payload.data);
        toast.success("Payment processed successfully!");
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Send confirmation email
    builder
      .addCase(sendConfirmationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendConfirmationEmail.fulfilled, (state) => {
        state.loading = false;
        toast.success("Confirmation email sent!");
      })
      .addCase(sendConfirmationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearError, clearCurrentBooking, addBooking } =
  bookingSlice.actions;

export default bookingSlice.reducer;

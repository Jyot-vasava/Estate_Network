import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StatCard from "./StatCard";
import { fetchProperties } from "../../features/properties/propertySlice.js";
import { formatCurrency, formatDate } from "../../utils/helper.js";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties } = useSelector((state) => state.properties);
  const { bookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const totalRevenue = bookings?.reduce(
    (sum, booking) => sum + booking.amount,
    0
  );

  return (
    <Box>
      {/* Header with Back Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your property management system
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Properties"
            value={properties?.length || 0}
            icon={<HomeIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Bookings"
            value={bookings?.length || 0}
            icon={<PeopleIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue || 0)}
            icon={<AttachMoneyIcon />}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Messages"
            value="15"
            icon={<ContactMailIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Recent Properties */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Properties
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties?.slice(0, 5).map((property) => (
                <TableRow key={property._id}>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>
                    {property.city}, {property.state}
                  </TableCell>
                  <TableCell>{formatCurrency(property.price)}</TableCell>
                  <TableCell>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(property.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Bookings */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Bookings
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings?.slice(0, 5).map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.bookingId}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{formatCurrency(booking.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      label="Completed"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(booking.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;

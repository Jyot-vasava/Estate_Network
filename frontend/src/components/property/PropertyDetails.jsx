import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "../../components/common/Loader.jsx";
import {
  fetchPropertyById,
  deleteProperty,
} from "../../features/properties/propertySlice.js";
import { formatCurrency } from "../../utils/helper.js";
import { contactApi } from "../../api/contactApi.js";
import toast from "react-hot-toast";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";


const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProperty, loading } = useSelector((state) => state.properties);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }
  }, [dispatch, id]);

  // Check if current user is the owner
  const isOwner =
    isAuthenticated &&
    currentProperty?.createdBy &&
    user?._id &&
    currentProperty.createdBy.toString() === user._id.toString();

  // Log for debugging
  useEffect(() => {
    if (currentProperty && user) {
      console.log("Ownership Check:", {
        propertyCreatedBy: currentProperty.createdBy,
        currentUserId: user._id,
        isOwner: isOwner,
      });
    }
  }, [currentProperty, user, isOwner]);

  const handleContactOwner = async () => {
    setContactLoading(true);
    try {
      const response = await contactApi.contactOwner({
        ...contactForm,
        ownerEmail: currentProperty.contactEmail,
      });

      console.log("Email response:", response);
      toast.success(
        "Message sent successfully! Check backend console for email preview."
      );

      if (response?.data?.previewUrl) {
        console.log("📧 Email Preview URL:", response.data.previewUrl);
        if (
          window.confirm(
            "Email sent! Would you like to preview it in a new tab?"
          )
        ) {
          window.open(response.data.previewUrl, "_blank");
        }
      }

      setContactDialogOpen(false);
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact owner error:", error);
      toast.error("Failed to send message");
    } finally {
      setContactLoading(false); 
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProperty(id)).unwrap();
      toast.success("Property deleted successfully!");
      navigate("/properties");
    } catch (error) {
      toast.error(error || "Failed to delete property");
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!currentProperty) {
    return (
      <Container>
        <Typography variant="h5" textAlign="center" mt={4}>
          Property not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/properties")}
          sx={{ mb: 2 }}
        >
          Back to Properties
        </Button>

        {/* Images */}
        {currentProperty.images && currentProperty.images.length > 0 && (
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <ImageList
              sx={{ width: "100%", height: 450 }}
              cols={currentProperty.images.length > 1 ? 2 : 1}
              rowHeight={currentProperty.images.length > 1 ? 220 : 450}
            >
              {currentProperty.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    loading="lazy"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
        )}

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {currentProperty.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon color="action" />
                    <Typography variant="body1" color="text.secondary">
                      {currentProperty.address}, {currentProperty.city},{" "}
                      {currentProperty.state}, {currentProperty.country}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={formatCurrency(currentProperty.price)}
                  color="primary"
                  sx={{ fontSize: "1.2rem", fontWeight: "bold", px: 2, py: 3 }}
                />
              </Box>

              {/* Add property type and discount display */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  label={
                    currentProperty.propertyType === "rent"
                      ? "For Rent"
                      : "For Sale"
                  }
                  color={
                    currentProperty.propertyType === "rent"
                      ? "secondary"
                      : "success"
                  }
                />
                {currentProperty.discountedPrice &&
                  currentProperty.discountedPrice < currentProperty.price && (
                    <Chip
                      icon={<LocalOfferIcon />}
                      label={`${
                        currentProperty.discountPercentage ||
                        Math.round(
                          ((currentProperty.price -
                            currentProperty.discountedPrice) /
                            currentProperty.price) *
                            100
                        )
                      }% OFF`}
                      color="error"
                    />
                  )}
              </Box>

              {/* Update price display */}
              {currentProperty.discountedPrice &&
              currentProperty.discountedPrice < currentProperty.price ? (
                <Box>
                  <Chip
                    label={formatCurrency(currentProperty.discountedPrice)}
                    color="primary"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      px: 2,
                      py: 3,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                      mt: 1,
                    }}
                  >
                    {formatCurrency(currentProperty.price)}
                  </Typography>
                </Box>
              ) : (
                <Chip
                  label={formatCurrency(currentProperty.price)}
                  color="primary"
                  sx={{ fontSize: "1.2rem", fontWeight: "bold", px: 2, py: 3 }}
                />
              )}

              <Divider sx={{ my: 3 }} />

              {/* Property Stats */}
              <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <BedIcon fontSize="large" color="primary" />
                    <Typography variant="h6">
                      {currentProperty.bedrooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bedrooms
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <BathtubIcon fontSize="large" color="primary" />
                    <Typography variant="h6">
                      {currentProperty.bathrooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bathrooms
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <SquareFootIcon fontSize="large" color="primary" />
                    <Typography variant="h6">
                      {currentProperty.floorArea}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sq. Ft.
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" color="primary">
                      {currentProperty.totalFloors}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Floors
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {currentProperty.description}
                </Typography>
              </Box>

              {/* Amenities */}
              {currentProperty.amenities &&
                currentProperty.amenities.length > 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Amenities
                    </Typography>
                    <List>
                      <Grid container>
                        {currentProperty.amenities.map((amenity, index) => (
                          <Grid size={{ xs: 6, sm: 4 }} key={index}>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" />
                              </ListItemIcon>
                              <ListItemText primary={amenity} />
                            </ListItem>
                          </Grid>
                        ))}
                      </Grid>
                    </List>
                  </Box>
                )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Contact Information */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Contact Person"
                    secondary={currentProperty.contactName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={currentProperty.contactEmail}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={currentProperty.contactPhoneNumber}
                  />
                </ListItem>
              </List>

              {isAuthenticated && (
                <>
                  {/* Show Contact Owner button only if NOT the owner */}
                  {!isOwner && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setContactDialogOpen(true)}
                      sx={{ mb: 2 }}
                    >
                      Contact Owner
                    </Button>
                  )}

                  {/* Show Edit/Delete buttons only if IS the owner */}
                  {isOwner && (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/properties/edit/${id}`)}
                      >
                        Edit Property
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Delete Property
                      </Button>
                    </Box>
                  )}
                </>
              )}

              {!isAuthenticated && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Please login to contact the owner
                </Typography>
              )}
            </Paper>

            {/* Legal Documentation */}
            {currentProperty.legalDocumentation && (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Legal Documentation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentProperty.legalDocumentation}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Contact Owner Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => !contactLoading && setContactDialogOpen(false)} // Disable close while loading
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Contact Property Owner</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Your Name"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              disabled={contactLoading}
            />
            <TextField
              fullWidth
              label="Your Email"
              type="email"
              value={contactForm.email}
              onChange={(e) =>
                setContactForm({ ...contactForm, email: e.target.value })
              }
              disabled={contactLoading}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              disabled={contactLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setContactDialogOpen(false)}
            disabled={contactLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleContactOwner}
            disabled={
              !contactForm.name ||
              !contactForm.email ||
              !contactForm.message ||
              contactLoading
            }
            startIcon={contactLoading ? <CircularProgress size={20} /> : null}
          >
            {contactLoading ? "Sending..." : "Send Message"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyDetails;

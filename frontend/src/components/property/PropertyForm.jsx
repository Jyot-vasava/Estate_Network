import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Button as MuiButton,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import {
  createProperty,
  updateProperty,
  fetchPropertyById,
} from "../../features/properties/propertySlice.js";
import { validateForm, validationRules } from "../../utils/apiUtils.js";
import { AMENITIES } from "../../utils/constants";

const PropertyForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProperty, loading } = useSelector((state) => state.properties);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    propertyType: "sale",
    bedrooms: "",
    bathrooms: "",
    floorArea: "",
    totalFloors: "",
    amenities: [],
    address: "",
    city: "",
    state: "",
    country: "",
    contactName: "",
    contactEmail: "",
    contactPhoneNumber: "",
    price: "",
    discountedPrice: "",
    legalDocumentation: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchPropertyById(id));
    }
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && currentProperty) {
      // Populate form with existing data
      setFormData({
        name: currentProperty.name || "",
        description: currentProperty.description || "",
        propertyType: currentProperty.propertyType || "sale",
        bedrooms: currentProperty.bedrooms || "",
        bathrooms: currentProperty.bathrooms || "",
        floorArea: currentProperty.floorArea || "",
        totalFloors: currentProperty.totalFloors || "",
        amenities: currentProperty.amenities || [],
        address: currentProperty.address || "",
        city: currentProperty.city || "",
        state: currentProperty.state || "",
        country: currentProperty.country || "",
        contactName: currentProperty.contactName || "",
        contactEmail: currentProperty.contactEmail || "",
        contactPhoneNumber: currentProperty.contactPhoneNumber || "",
        price: currentProperty.price || "",
        discountedPrice: currentProperty.discountedPrice || "",
        legalDocumentation: currentProperty.legalDocumentation || "",
      });

      // Set existing images
      if (currentProperty.images) {
        setExistingImages(currentProperty.images);
        setImagePreviews(currentProperty.images);
      }
    }
  }, [isEdit, currentProperty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAmenitiesChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      amenities: typeof value === "string" ? value.split(",") : value,
    }));
    if (errors.amenities) {
      setErrors((prev) => ({
        ...prev,
        amenities: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);

    // Create previews for new files
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];

    // Check if this is an existing image from backend
    if (existingImages.includes(imageToRemove)) {
      // Mark for deletion
      setImagesToDelete([...imagesToDelete, imageToRemove]);
      setExistingImages(existingImages.filter((img) => img !== imageToRemove));
    } else {
      // Remove from new files
      const fileIndex = index - existingImages.length;
      const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
      setImageFiles(newFiles);
    }

    // Remove from previews
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateForm(formData, validationRules.property);

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Scroll to first error
      const firstError = Object.keys(validation.errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "amenities") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append new images
    imageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    // In edit mode, send existing images that should be kept
    if (isEdit) {
      formDataToSend.append("existingImages", JSON.stringify(existingImages));
      formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    try {
      if (isEdit) {
        const result = await dispatch(
          updateProperty({ id, formData: formDataToSend })
        ).unwrap();
        console.log("Property updated:", result);

        const propertyId = result?.data?._id || result?._id || id;
        navigate(`/properties/${propertyId}`);
      } else {
        const result = await dispatch(createProperty(formDataToSend)).unwrap();
        console.log("Property created, full result:", result);

        const propertyId = result?.data?._id || result?._id;

        if (propertyId) {
          navigate(`/properties/${propertyId}`);
        } else {
          navigate("/properties");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isEdit && loading) {
    return <Loader fullScreen />;
  }

  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {isEdit ? "Edit Property" : "Create New Property"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Fill in the details below to {isEdit ? "update" : "create"} a
            property
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Property Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Property Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>

              {/* Bedrooms & Bathrooms */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  error={!!errors.bedrooms}
                  helperText={errors.bedrooms}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  error={!!errors.bathrooms}
                  helperText={errors.bathrooms}
                />
              </Grid>

              {/* Floor Area & Total Floors */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Floor Area (sq ft)"
                  name="floorArea"
                  type="number"
                  value={formData.floorArea}
                  onChange={handleChange}
                  error={!!errors.floorArea}
                  helperText={errors.floorArea}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Total Floors"
                  name="totalFloors"
                  type="number"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  error={!!errors.totalFloors}
                  helperText={errors.totalFloors}
                />
              </Grid>

              {/* Amenities */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth error={!!errors.amenities}>
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    multiple
                    value={formData.amenities}
                    onChange={handleAmenitiesChange}
                    input={<OutlinedInput label="Amenities" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {AMENITIES.map((amenity) => (
                      <MenuItem key={amenity} value={amenity}>
                        {amenity}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.amenities && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {errors.amenities}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>

              {/* City, State, Country */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  error={!!errors.country}
                  helperText={errors.country}
                />
              </Grid>

              {/* Contact Details */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  error={!!errors.contactName}
                  helperText={errors.contactName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  name="contactPhoneNumber"
                  value={formData.contactPhoneNumber}
                  onChange={handleChange}
                  error={!!errors.contactPhoneNumber}
                  helperText={errors.contactPhoneNumber}
                />
              </Grid>

              {/* Property Type */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.propertyType}>
                  <InputLabel>Property Type *</InputLabel>
                  <Select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    label="Property Type *"
                  >
                    <MenuItem value="sale">For Sale</MenuItem>
                    <MenuItem value="rent">For Rent</MenuItem>
                  </Select>
                  {errors.propertyType && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {errors.propertyType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Price */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Price (₹) *"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>

              {/* Discounted Price */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Discounted Price (₹) - Optional"
                  name="discountedPrice"
                  type="number"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  error={!!errors.discountedPrice}
                  helperText={errors.discountedPrice || "Set 0 for no discount"}
                  placeholder="0"
                />
              </Grid>

              {/* Legal Documentation */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Legal Documentation"
                  name="legalDocumentation"
                  value={formData.legalDocumentation}
                  onChange={handleChange}
                  error={!!errors.legalDocumentation}
                  helperText={errors.legalDocumentation}
                />
              </Grid>

              {/* Image Upload */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Property Images
                </Typography>
                {isEdit && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Current images will be kept unless you delete them. Upload
                    new images to add more.
                  </Typography>
                )}
                <MuiButton
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </MuiButton>

                {imagePreviews.length > 0 && (
                  <Grid container spacing={2}>
                    {imagePreviews.map((preview, index) => (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                        <Box sx={{ position: "relative" }}>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: 150,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "white",
                              "&:hover": { bgcolor: "white" },
                            }}
                            size="small"
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                          {existingImages.includes(preview) && (
                            <Chip
                              label="Existing"
                              size="small"
                              color="primary"
                              sx={{
                                position: "absolute",
                                bottom: 4,
                                left: 4,
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>

              {/* Submit Buttons */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <MuiButton
                    variant="outlined"
                    onClick={() => navigate("/properties")}
                  >
                    Cancel
                  </MuiButton>
                  <Button type="submit" variant="contained" loading={loading}>
                    {isEdit ? "Update Property" : "Create Property"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default PropertyForm;

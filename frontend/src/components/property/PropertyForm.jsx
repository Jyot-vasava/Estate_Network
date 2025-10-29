import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { propertySchema } from "../../utils/validation_property.js";
import { AMENITIES } from "../../utils/constants";

const PropertyForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProperty, loading } = useSelector((state) => state.properties);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Track existing images from backend
  const [imagesToDelete, setImagesToDelete] = useState([]); // Track images to delete

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      amenities: [],
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchPropertyById(id));
    }
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && currentProperty) {
      // Populate form with existing data
      Object.keys(currentProperty).forEach((key) => {
        if (key !== "images") {
          setValue(key, currentProperty[key]);
        }
      });

      // Set existing images
      if (currentProperty.images) {
        setExistingImages(currentProperty.images);
        setImagePreviews(currentProperty.images);
      }
    }
  }, [isEdit, currentProperty, setValue]);

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

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all form fields
    Object.keys(data).forEach((key) => {
      if (key === "amenities") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    // Append new images
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // In edit mode, send existing images that should be kept
    if (isEdit) {
      formData.append("existingImages", JSON.stringify(existingImages));
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    try {
      if (isEdit) {
        const result = await dispatch(
          updateProperty({ id, formData })
        ).unwrap();
        console.log("Property updated:", result);

        const propertyId = result?.data?._id || result?._id || id;
        navigate(`/properties/${propertyId}`);
      } else {
        const result = await dispatch(createProperty(formData)).unwrap();
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Property Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Property Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              {/* Bedrooms & Bathrooms */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  {...register("bedrooms")}
                  error={!!errors.bedrooms}
                  helperText={errors.bedrooms?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  {...register("bathrooms")}
                  error={!!errors.bathrooms}
                  helperText={errors.bathrooms?.message}
                />
              </Grid>

              {/* Floor Area & Total Floors */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Floor Area (sq ft)"
                  type="number"
                  {...register("floorArea")}
                  error={!!errors.floorArea}
                  helperText={errors.floorArea?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Total Floors"
                  type="number"
                  {...register("totalFloors")}
                  error={!!errors.totalFloors}
                  helperText={errors.totalFloors?.message}
                />
              </Grid>

              {/* Amenities */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Amenities</InputLabel>
                  <Controller
                    name="amenities"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        multiple
                        input={<OutlinedInput label="Amenities" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
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
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>

              {/* City, State, Country */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="City"
                  {...register("city")}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="State"
                  {...register("state")}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Country"
                  {...register("country")}
                  error={!!errors.country}
                  helperText={errors.country?.message}
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
                  {...register("contactName")}
                  error={!!errors.contactName}
                  helperText={errors.contactName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  {...register("contactEmail")}
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  {...register("contactPhoneNumber")}
                  error={!!errors.contactPhoneNumber}
                  helperText={errors.contactPhoneNumber?.message}
                />
              </Grid>

             

              {/* Property Type */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.propertyType}>
                  <InputLabel>Property Type *</InputLabel>
                  <Controller
                    name="propertyType"
                    control={control}
                    defaultValue="sale"
                    render={({ field }) => (
                      <Select {...field} label="Property Type *">
                        <MenuItem value="sale">For Sale</MenuItem>
                        <MenuItem value="rent">For Rent</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.propertyType && (
                    <Typography variant="caption" color="error">
                      {errors.propertyType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Price */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Price (₹) *"
                  type="number"
                  {...register("price")}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>

              {/* Discounted Price */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Discounted Price (₹) - Optional"
                  type="number"
                  {...register("discountedPrice")}
                  error={!!errors.discountedPrice}
                  helperText={
                    errors.discountedPrice?.message ||
                    "Leave empty if no discount"
                  }
                />
              </Grid>

              {/* Legal Documentation */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Legal Documentation"
                  {...register("legalDocumentation")}
                  error={!!errors.legalDocumentation}
                  helperText={errors.legalDocumentation?.message}
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

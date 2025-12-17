import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Property from "../models/Property.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const createProperty = AsyncHandler(async (req, res) => {
  const {
    name,
    description,
    propertyType,
    bedrooms,
    bathrooms,
    floorArea,
    totalFloors,
    amenities,
    address,
    city,
    state,
    country,
    contactName,
    contactEmail,
    contactPhoneNumber,
    price,
    discountedPrice,
    legalDocumentation,
  } = req.body;

  // Validation
  if ([name, description, address, city, price].some((f) => !f?.trim())) {
    throw new ApiError(400, "Required fields missing");
  }

  // Upload images to Cloudinary
  const imageUrls = [];
  if (req.files?.length > 0) {


    for (const file of req.files) {

      const result = await uploadToCloudinary(file.path);

      if (result?.secure_url) {
        imageUrls.push(result.secure_url);

      } else {

      }
    }

  }

  // Create property
  const property = await Property.create({
    name,
    description,
    propertyType,
    bedrooms: +bedrooms,
    bathrooms: +bathrooms,
    floorArea: +floorArea,
    totalFloors: +totalFloors,
    amenities: amenities ? JSON.parse(amenities) : [],
    address,
    city,
    state,
    country,
    contactName,
    contactEmail,
    contactPhoneNumber,
    price: +price,
    discountedPrice: discountedPrice ? +discountedPrice : undefined,
    legalDocumentation,
    images: imageUrls,
    createdBy: req.user._id,
  });



  return res
    .status(201)
    .json(new ApiResponse(201, property, "Property created"));
});

const getAllProperties = AsyncHandler(async (req, res) => {
  const properties = await Property.find().sort({ createdAt: -1 });


  if (properties.length > 0) {

  }

  return res
    .status(200)
    .json(new ApiResponse(200, properties, "Properties fetched"));
});

const getPropertyById = AsyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) throw new ApiError(404, "Property not found");



  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property fetched"));
});

const updateProperty = AsyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, "Property not found");
  if (property.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  const updatedData = { ...req.body };

  // Parse amenities if it's a string
  if (updatedData.amenities && typeof updatedData.amenities === "string") {
    updatedData.amenities = JSON.parse(updatedData.amenities);
  }

  // Handle existing images
  let existingImages = property.images || [];

  if (req.body.existingImages) {
    existingImages = JSON.parse(req.body.existingImages);
  }

  // Upload new images
  const newImageUrls = [];
  if (req.files?.length > 0) {


    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path);
      if (result?.secure_url) {
        newImageUrls.push(result.secure_url);

      }
    }
  }

  // Combine existing and new images
  updatedData.images = [...existingImages, ...newImageUrls];


  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true, runValidators: true }
  );


  return res
    .status(200)
    .json(new ApiResponse(200, updatedProperty, "Property updated"));
});

const deleteProperty = AsyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, "Property not found");
  if (property.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  await Property.findByIdAndDelete(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Property deleted"));
});

export {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};

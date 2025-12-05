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
  } = req.body;

  if ([name, description, address, city, price].some((f) => !f?.trim())) {
    throw new ApiError(400, "Required fields missing");
  }

  const imageUrls = [];
  if (req.files?.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path);
      if (result?.secure_url) imageUrls.push(result.secure_url);
    }
  }

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
    images: imageUrls,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, property, "Property created"));
});

const getAllProperties = AsyncHandler(async (req, res) => {
  const properties = await Property.find().sort({ createdAt: -1 });
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

  // Reuse create logic for simplicity (or expand as needed)
  const updatedData = { ...req.body };
  if (req.files?.length > 0) {
    const newUrls = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path);
      if (result?.secure_url) newUrls.push(result.secure_url);
    }
    updatedData.images = [...(property.images || []), ...newUrls];
  }

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

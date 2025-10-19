import { Property } from "../models/Property.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js";

// Create property with image upload
const createProperty = asyncHandler(async (req, res) => {
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
    legalDocumentation,
    price,
    discountedPrice,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !propertyType ||
    !bedrooms ||
    !bathrooms ||
    !floorArea ||
    !totalFloors ||
    !address ||
    !city ||
    !state ||
    !country ||
    !contactName ||
    !contactEmail ||
    !contactPhoneNumber ||
    !price
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.path);
      imageUrls.push(uploadResult.secure_url);
    }
  }

  const property = await Property.create({
    name,
    description,
    propertyType,
    images: imageUrls,
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    floorArea: Number(floorArea),
    totalFloors: Number(totalFloors),
    amenities: Array.isArray(amenities)
      ? amenities
      : JSON.parse(amenities || "[]"),
    address,
    city,
    state,
    country,
    contactName,
    contactEmail,
    contactPhoneNumber,
    legalDocumentation,
    price: Number(price),
    discountedPrice: discountedPrice ? Number(discountedPrice) : null,
    createdBy: req.user._id,
  });

  console.log(
    "Property created with ID:",
    property._id,
    "by user:",
    req.user._id
  );

  return res
    .status(201)
    .json(new ApiResponse(201, property, "Property created successfully"));
});

// Update property - Add ownership check
// const updateProperty = asyncHandler(async (req, res) => {
//   const property = await Property.findById(req.params.id);

//   if (!property) {
//     throw new ApiError(404, "Property not found");
//   }

//   // Check if user is the owner
//   if (property.createdBy.toString() !== req.user._id.toString()) {
//     throw new ApiError(403, "You are not authorized to update this property");
//   }

//   const {
//     name,
//     description,
//     bedrooms,
//     bathrooms,
//     floorArea,
//     totalFloors,
//     amenities,
//     address,
//     city,
//     state,
//     country,
//     contactName,
//     contactEmail,
//     contactPhoneNumber,
//     legalDocumentation,
//     price,
//     existingImages,
//     imagesToDelete,
//   } = req.body;

//   console.log("Existing images to keep:", existingImages);
//   console.log("Images to delete:", imagesToDelete);

//   let imageUrls = [];
//   if (existingImages) {
//     try {
//       imageUrls = JSON.parse(existingImages);
//     } catch (e) {
//       imageUrls = [];
//     }
//   }

//   if (req.files && req.files.length > 0) {
//     for (const file of req.files) {
//       const uploadResult = await uploadToCloudinary(file.path);
//       imageUrls.push(uploadResult.secure_url);
//     }
//   }

//   const updatedPropertyData = {
//     name: name || property.name,
//     description: description || property.description,
//     images: imageUrls,
//     bedrooms: bedrooms ? Number(bedrooms) : property.bedrooms,
//     bathrooms: bathrooms ? Number(bathrooms) : property.bathrooms,
//     floorArea: floorArea ? Number(floorArea) : property.floorArea,
//     totalFloors: totalFloors ? Number(totalFloors) : property.totalFloors,
//     amenities: amenities
//       ? Array.isArray(amenities)
//         ? amenities
//         : JSON.parse(amenities)
//       : property.amenities,
//     address: address || property.address,
//     city: city || property.city,
//     state: state || property.state,
//     country: country || property.country,
//     contactName: contactName || property.contactName,
//     contactEmail: contactEmail || property.contactEmail,
//     contactPhoneNumber: contactPhoneNumber || property.contactPhoneNumber,
//     legalDocumentation: legalDocumentation || property.legalDocumentation,
//     price: price ? Number(price) : property.price,
//   };

//   const updatedProperty = await Property.findByIdAndUpdate(
//     req.params.id,
//     updatedPropertyData,
//     { new: true, runValidators: true }
//   );

//   console.log(
//     "Property updated successfully with images:",
//     updatedProperty.images
//   );

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, updatedProperty, "Property updated successfully")
//     );
// });
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Check if user is the owner
  if (property.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this property");
  }

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
    legalDocumentation,
    price,
    discountedPrice,
    existingImages,
    imagesToDelete,
  } = req.body;

  console.log("Existing images to keep:", existingImages);
  console.log("Images to delete:", imagesToDelete);

  // Handle existing images
  let imageUrls = [];
  if (existingImages) {
    try {
      imageUrls = JSON.parse(existingImages);
    } catch (e) {
      imageUrls = [];
    }
  }

  // Remove deleted images from Cloudinary (optional if you track public_id)
  if (imagesToDelete) {
    try {
      const toDelete = JSON.parse(imagesToDelete);
      // If you have public_ids stored, delete from Cloudinary here
      // for (const img of toDelete) await deleteFromCloudinary(img);
      imageUrls = imageUrls.filter((url) => !toDelete.includes(url));
    } catch (err) {
      console.error("Error parsing imagesToDelete:", err);
    }
  }

  // Upload new images if any
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.path);
      imageUrls.push(uploadResult.secure_url);
    }
  }

  // Construct updated property data
  const updatedPropertyData = {
    name: name || property.name,
    description: description || property.description,
    propertyType: propertyType || property.propertyType,
    images: imageUrls,
    bedrooms: bedrooms ? Number(bedrooms) : property.bedrooms,
    bathrooms: bathrooms ? Number(bathrooms) : property.bathrooms,
    floorArea: floorArea ? Number(floorArea) : property.floorArea,
    totalFloors: totalFloors ? Number(totalFloors) : property.totalFloors,
    amenities: amenities
      ? Array.isArray(amenities)
        ? amenities
        : JSON.parse(amenities)
      : property.amenities,
    address: address || property.address,
    city: city || property.city,
    state: state || property.state,
    country: country || property.country,
    contactName: contactName || property.contactName,
    contactEmail: contactEmail || property.contactEmail,
    contactPhoneNumber: contactPhoneNumber || property.contactPhoneNumber,
    legalDocumentation: legalDocumentation || property.legalDocumentation,
    price: price ? Number(price) : property.price,
    discountedPrice: discountedPrice
      ? Number(discountedPrice)
      : property.discountedPrice || null,
  };

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    updatedPropertyData,
    { new: true, runValidators: true }
  );

  console.log(
    "Property updated successfully with ID:",
    updatedProperty._id,
    "and images:",
    updatedProperty.images
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProperty, "Property updated successfully")
    );
});


// Delete property - Add ownership check
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Check if user is the owner
  if (property.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this property");
  }

  await Property.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Property deleted successfully"));
});

// Get all properties - unchanged
const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, properties, "Properties fetched successfully"));
});

// Get single property - unchanged
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property fetched successfully"));
});

export {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};

import mongoose from "mongoose";

const { Schema } = mongoose;

const propertySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    floorArea: {
      type: Number,
      required: true,
    },
    totalFloors: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    contactPhoneNumber: {
      type: String,
      required: true,
    },
    legalDocumentation: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export  {Property};


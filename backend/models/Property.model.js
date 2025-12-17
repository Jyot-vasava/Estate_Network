import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    propertyType: { type: String, enum: ["sale", "rent"], default: "sale" },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    floorArea: { type: Number, required: true },
    totalFloors: { type: Number, required: true },
    amenities: [String],
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true },
    contactPhoneNumber: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    legalDocumentation: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-calculate discount percentage
propertySchema.virtual("discountPercentage").get(function () {
  if (this.discountedPrice && this.price > this.discountedPrice) {
    return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }
  return 0;
});

export default mongoose.model("Property", propertySchema);

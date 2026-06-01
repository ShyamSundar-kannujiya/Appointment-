import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;

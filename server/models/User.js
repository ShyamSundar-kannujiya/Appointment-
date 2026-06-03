import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    whatsappConnected: {
      type: Boolean,
      default: false,
    },

    whatsappToken: String,

    whatsappPhoneNumberId: String,

    whatsappBusinessAccountId: String,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

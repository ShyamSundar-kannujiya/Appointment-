import User from "../models/User.js";
import Service from "../models/Service.js";

/* Get Shop By Slug */
export const getShopBySlug = async (req, res) => {
  try {
    const shop = await User.findOne({
      slug: req.params.slug,
    }).select("-password");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Get Services By Slug */
export const getServicesBySlug = async (req, res) => {
  try {
    const shop = await User.findOne({
      slug: req.params.slug,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const services = await Service.find({
      shopId: shop._id,
    });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPublicBooking = async (req, res) => {
  try {
    const { slug, serviceId, clientName, clientPhone, bookingDate, slotTime } =
      req.body;

    // Validation
    if (
      !slug ||
      !serviceId ||
      !clientName ||
      !clientPhone ||
      !bookingDate ||
      !slotTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find shop by slug
    const shop = await Shop.findOne({ slug });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Create booking
    const booking = new Booking({
      shopId: shop._id,
      serviceId,
      clientName,
      clientPhone,
      bookingDate: new Date(bookingDate),
      slotTime,
      status: "pending",
    });

    await booking.save();

    res.status(201).json({
      message:
        "Booking request sent successfully! Please wait for confirmation.",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: error.message });
  }
};
